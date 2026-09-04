"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    pbjs: any;
  }
}

const PREBID_TIMEOUT = 3000;
const PREBID_JS_URL = "https://visabloom.com/prebid11.14.0.js";
const SLOT_ID = "div-1";

/*
 * Room left around the creative so it never runs under the viewport edges or
 * the close button. Used to work out how far a large creative has to scale.
 */
const VIEWPORT_PADDING_X = 32;
const VIEWPORT_PADDING_Y = 96;

export default function HeaderAd() {
  /*
   * Null until an auction actually produces a winner. Nothing renders in the
   * meantime, so a page with no fill never shows a placeholder or a message —
   * the ad simply never appears.
   */
  const [winningBid, setWinningBid] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  const slotRef = useRef<HTMLDivElement | null>(null);
  const renderedAdIdRef = useRef<string | null>(null);

  const isOpen = !!winningBid && !dismissed;

  const close = useCallback(() => {
    setDismissed(true);
  }, []);

  /*
   * Run the auction. This only ever hands a winning bid to state; everything
   * that can go wrong (script blocked, no bids, bad response) leaves the
   * component rendering nothing.
   */
  useEffect(() => {
    let cancelled = false;

    const isMobile = window.innerWidth <= 768;

    /*
     * Mobile can request 728x90.
     * The render step scales it down visually if it wins.
     */
    const DESKTOP_SIZES = [
      [728, 90],
      [970, 250],
    ];

    const MOBILE_SIZES = [
      [320, 50],
      [300, 250],
      [728, 90],
    ];

    const SLOT_SIZES = isMobile ? MOBILE_SIZES : DESKTOP_SIZES;

    /*
     * Make sure pbjs exists before loading Prebid.
     */
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    function loadPrebidScript(callback: () => void) {
      /*
       * Prebid is already available.
       */
      if (window.pbjs && typeof window.pbjs.requestBids === "function") {
        callback();
        return;
      }

      /*
       * Prevent loading the same script multiple times.
       */
      const existingScript = document.querySelector(
        `script[src="${PREBID_JS_URL}"]`
      );

      if (existingScript) {
        existingScript.addEventListener("load", callback, { once: true });
        return;
      }

      const script = document.createElement("script");

      script.async = true;
      script.src = PREBID_JS_URL;

      script.onload = () => {
        if (cancelled) return;

        console.log("Prebid.js script loaded:", PREBID_JS_URL);
        console.log("pbjs.version:", window.pbjs.version);
        console.log("pbjs.requestBids:", typeof window.pbjs.requestBids);
        console.log("pbjs.addAdUnits:", typeof window.pbjs.addAdUnits);
        console.log("pbjs.renderAd:", typeof window.pbjs.renderAd);
        console.log("Installed modules:", window.pbjs.installedModules);

        if (typeof window.pbjs.requestBids !== "function") {
          console.error(
            "Prebid script loaded, but pbjs.requestBids is missing. " +
              "Confirm this is a valid Prebid.js build with " +
              "adastraBidAdapter and dochaseBidAdapter."
          );

          return;
        }

        callback();
      };

      script.onerror = () => {
        /*
         * Nothing to clean up in the DOM: with no winning bid the modal was
         * never rendered in the first place.
         */
        console.error("Failed to load Prebid.js:", PREBID_JS_URL);
      };

      document.head.appendChild(script);
    }

    loadPrebidScript(() => {
      if (cancelled) return;

      window.pbjs.que.push(() => {
        /*
         * Prebid configuration.
         */
        window.pbjs.setConfig({
          priceGranularity: "medium",

          sizeConfig: [
            {
              mediaQuery: "(min-width: 769px)",

              sizesSupported: [
                [728, 90],
                [970, 250],
              ],
            },

            {
              mediaQuery: "(max-width: 768px)",

              sizesSupported: [
                [320, 50],
                [300, 250],
                [728, 90],
              ],
            },
          ],

          floors: {
            currency: "USD",

            schema: {
              fields: ["mediaType", "size"],
            },

            values: {
              "banner|728x90": 0.2,
              "banner|970x250": 0.2,
              "banner|320x50": 0.03,
              "banner|300x250": 0.03,
            },
          },

          ortb2: {
            user: {
              id: "1234567890",

              customdata: {
                test: "abc",
              },
            },
          },
        });

        /*
         * Add the ad unit.
         */
        window.pbjs.addAdUnits([
          {
            code: SLOT_ID,

            mediaTypes: {
              banner: {
                sizes: SLOT_SIZES,
              },
            },

            bids: [
              {
                bidder: "adastra",

                params: {
                  seat: "VvFg3g33jyyY6suJ9rL0",

                  token: "gjYNPegxTMs6msYAMUsvvBxeE9O93AGB",

                  minBidfloor: isMobile ? 0.03 : 0.2,

                  pos: 1,
                },
              },

              {
                bidder: "dochase",

                params: {
                  placement_id: 5734,

                  bid_floor: 0,
                },
              },
            ],
          },
        ]);

        /*
         * Request bids.
         */
        window.pbjs.requestBids({
          timeout: PREBID_TIMEOUT,

          bidsBackHandler: () => {
            if (cancelled) return;

            const allResponses = window.pbjs.getBidResponses();
            const highestBids = window.pbjs.getHighestCpmBids(SLOT_ID);

            console.log("All Prebid bid responses:", allResponses);
            console.log(`Highest bid for ${SLOT_ID}:`, highestBids);

            /*
             * Log auction events.
             */
            console.log(
              "Auction events:",
              window.pbjs
                .getEvents()
                .filter((event: any) =>
                  [
                    "auctionInit",
                    "bidRequested",
                    "bidResponse",
                    "bidWon",
                    "bidTimeout",
                    "bidderError",
                    "auctionEnd",
                  ].includes(event.eventType)
                )
            );

            if (!highestBids || highestBids.length === 0) {
              /*
               * No fill. Leave the page alone.
               */
              console.log("No bids returned from Adastra or Dochase.");
              return;
            }

            const bid = highestBids[0];

            if (!bid?.adId) {
              console.error("Missing adId on winning bid:", bid);
              return;
            }

            console.log("Winning bidder:", bid.bidder);
            console.log("Winning CPM:", bid.cpm);
            console.log("Winning size:", `${bid.width}x${bid.height}`);
            console.log("Winning adId:", bid.adId);
            console.log("Has ad markup:", !!bid.ad);
            console.log(
              "Ad markup snippet:",
              bid.ad ? bid.ad.slice(0, 1000) : null
            );
            console.log("Winning bid object:", bid);

            /*
             * Opens the modal. The creative itself is written in the effect
             * below, once the slot is actually in the document and measurable.
             */
            setWinningBid(bid);
          },
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Paint the creative once the modal is mounted. Doing this here rather than
   * straight from bidsBackHandler means the slot exists and has been laid out,
   * so the scale below is measured against a real box.
   */
  useEffect(() => {
    if (!isOpen) return;

    const slot = slotRef.current;
    if (!slot) return;

    const bid = winningBid;

    /*
     * A re-render must not paint the same creative twice.
     */
    if (renderedAdIdRef.current === bid.adId) return;
    renderedAdIdRef.current = bid.adId;

    const width = bid.width || 320;
    const height = bid.height || 50;

    /*
     * Shrink anything too big for the viewport, keeping the aspect ratio.
     * A 728x90 winner on a 390px phone ends up at roughly 50% scale.
     */
    const scale = Math.min(
      1,
      (window.innerWidth - VIEWPORT_PADDING_X) / width,
      (window.innerHeight - VIEWPORT_PADDING_Y) / height
    );

    const boxWidth = Math.round(width * scale);
    const boxHeight = Math.ceil(height * scale);

    slot.style.width = `${boxWidth}px`;
    slot.style.height = `${boxHeight}px`;
    slot.style.overflow = "hidden";

    const iframe = document.createElement("iframe");

    iframe.title = "Advertisement";

    iframe.width = String(width);
    iframe.height = String(height);

    iframe.frameBorder = "0";
    iframe.marginWidth = "0";
    iframe.marginHeight = "0";
    iframe.scrolling = "no";

    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.style.display = "block";
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;

    /*
     * top left, not top center: the slot is already sized to the scaled
     * creative, so scaling from the corner lines the two up exactly.
     */
    iframe.style.transformOrigin = "top left";
    iframe.style.transform = scale === 1 ? "none" : `scale(${scale})`;

    if (scale < 1) {
      console.log("Creative scaled to fit viewport:", {
        originalWidth: width,
        originalHeight: height,
        scale,
        boxWidth,
        boxHeight,
      });
    }

    slot.appendChild(iframe);

    try {
      console.log("Calling pbjs.renderAd for adId:", bid.adId);

      window.pbjs.renderAd(iframe?.contentWindow?.document, bid.adId);

      console.log("pbjs.renderAd called successfully");
    } catch (error) {
      console.error("pbjs.renderAd failed:", error);
      console.error("Failed bid object:", bid);
    }
  }, [isOpen, winningBid]);

  /*
   * Escape closes the modal, like any other dialog on the site.
   */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  /*
   * No winner, or the reader closed it: render nothing at all.
   */
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
      onClick={close}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
    >
      {/* stops a click on the creative itself from closing the modal */}
      <div className="relative" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={close}
          aria-label="Close advertisement"
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black text-lg leading-none hover:bg-white transition-colors"
        >
          ✕
        </button>

        {/* left empty for React: the creative is appended imperatively */}
        <div id={SLOT_ID} ref={slotRef} />
      </div>
    </div>
  );
}
