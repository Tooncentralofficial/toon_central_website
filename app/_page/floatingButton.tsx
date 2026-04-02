"use client";

import { motion } from "framer-motion";
import OtakuModal from "./otakuModal";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import ItelLogo from "@/public/static/images/events/itel/Itel_logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequestProtected, postRequestProtected } from "../utils/queries/requests";
import { Offer } from "@/helpers/types";

/** Replace with final reward destination URL when ready */
const PROMO_REWARD_LINK =
  "https://www.jumia.com.ng/itel-city-200-7.45mm-12844gb-unibody-metallic-deco-6.78-120hz-ip65-5200mah-android-purple-419283461.html";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, token } = useSelector(selectAuthState);
  const router = useRouter();
  const pathname = usePathname()

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const isLoggedIn = Boolean(token && user);
   const { data, isLoading } = useQuery({
    queryKey: ["list_offers"],
    queryFn: () => getRequestProtected("offers",token,pathname),
  });
 const itelOffer = data?.data?.find((offer:Offer)=>offer.name === "itel_offer")
 console.log("itelOffer", itelOffer);
 const {mutate: claimOffer} = useMutation({
  mutationKey: ["claim_offer"],
  mutationFn: () => postRequestProtected({},`offers/${itelOffer?.id}/claim`,token as any,pathname,"json"),
 });
  const handleModalClick = () => {
    if (isLoggedIn) {
      claimOffer();
      window.location.assign(PROMO_REWARD_LINK);
      return;
    }

    router.push("/auth/login");
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50"
        onClick={onOpen}
        aria-label="Open Itel Modal"
      >
        <Image
          src={ItelLogo}
          alt="Itel Logo"
          width={100}
          height={100}
          className="w-24 h-24 animate-pulse hover:scale-110 transition-all duration-300"
          style={{
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </motion.div>

      <OtakuModal isOpen={isOpen} onClose={onClose} maxWidth="39rem">
        <div
          className="w-full mx-auto flex flex-1 flex-col p-4 pt-24 pb-8 sm:pt-32 md:p-8 md:pt-40 lg:pt-48 md:pb-10 text-white cursor-pointer"
          onClick={handleModalClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleModalClick();
            }
          }}
        >
          {/* Header with Logos */}
          <div className="flex justify-between items-center mb-2 md:mb-4 relative px-0 sm:px-4">
            {/* Stylized X Separator - Center */}
            {/* <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2 z-20">
              <span
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-[#ffffff] leading-none"
                style={{
                  textShadow:
                    "0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px rgba(74, 255, 255, 0.4)",
                  filter: "drop-shadow(0 0 10px rgba(74, 158, 255, 0.8))",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✕
              </span>
              <span
                className="text-3xl hidden md:block md:text-4xl mt-2"
                style={{
                  filter: "drop-shadow(0 0 5px rgba(255, 165, 0, 0.8))",
                }}
              >
                🔥
              </span>
            </div> */}
          </div>

          <div className="flex-shrink-0 mt-14 sm:mt-24 md:mt-32">
            {/* Main Heading */}

            {/* Description Text */}
            {/* <p className="text-base md:text-lg text-white mb-6 md:mb-8 text-center leading-relaxed">
              Toon Central and itel are giving readers an exclusive chance to
              earn rewards and explore more stories. Tap the button below, and
              claim your reward now.
            </p> */}
          </div>

          <div className="mt-auto mb-2 md:mb-4 rounded-xl  bg-black/35 p-4 md:p-5  text-center">
            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href={PROMO_REWARD_LINK}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleClaimReward}
                className="w-24 sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#4ADD80] px-6 py-3 md:px-8 md:py-3.5 text-white font-bold text-sm md:text-base hover:bg-[#3a4554] transition-colors duration-200 shadow-lg hover:shadow-xl min-w-[180px]"
              >
                Claim Reward
              </a>
            </div> */}
          </div>
        </div>
      </OtakuModal>
    </>
  );
}
