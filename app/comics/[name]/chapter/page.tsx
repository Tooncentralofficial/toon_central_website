"use client";
import { dummyItems } from "@/app/_shared/data";
import {
  AutoScrollIcon,
  BXSLeft,
  BXSRight,
  CommentPop,
} from "@/app/_shared/icons/icons";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import BackButton from "@/app/_shared/layout/back";
import {
  getRequestProtected,
  postRequestProtected,
} from "@/app/utils/queries/requests";
import { parseArray } from "@/helpers/parsArray";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { Button } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CommentPopUp from "../_shared/commentpopup";
import { motion, AnimatePresence } from "framer-motion";
import UnlockPanelDialog from "./_shared/UnlockPanelDialog";
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    uid: string | undefined;
    chapter: string | undefined;
    comicid: string;
  };
}) => {
  const adLink = "https://otieu.com/4/9441919";
  const { uid, chapter: chapterSlug, comicid } = searchParams;
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const fullUrl = pathname + "?" + searchParams.toString();
  const initialSpeed = 2;
  const [chapter, setChapter] = useState(parseInt(chapterSlug || "0") + 1);
  const [episodeId, setEpisodeId] = useState<string>("");
  const [episode, setEpisode] = useState<any[]>([]);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [typedComment, setTypedComment] = useState<string>("");
  const { user, token }: any = useSelector(selectAuthState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showButton, setShowButton] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [selectedUnlockOption, setSelectedUnlockOption] = useState(0);
  const [unlockOptions, setUnlockOptions] = useState<any[]>([]);
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  const [selectedPanelImage, setSelectedPanelImage] = useState<string | null>(
    null
  );
  const [isLoadingUnlockOptions, setIsLoadingUnlockOptions] = useState(false);

  const toggleCommentPopup = () => {
    setShowCommentPopup((prev) => !prev);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const commentQueryString = `getcomment`;

  const comicQueryKey = `comic_${uid}`;

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [comicQueryKey],
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token, fullUrl),
    enabled: token !== null,
  });
  useEffect(() => {
    if (data?.data?.episodes && data.data.episodes.length > 0) {
      const episode = parseArray(data.data.episodes)[chapter - 1];
      if (episode?.id) {
        setEpisodeId(episode.id);
      }
    }
  }, [data, chapter]);

  const BackgroundImage = data?.data?.backgroundImage;

  useEffect(() => {
    if (isSuccess) setEpisode(parseArray(data?.data?.episodes));
  }, [data, isFetching, isSuccess]);

  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/like`, token, fullUrl),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast_${uid}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: [comicQueryKey],
        });
        return;
      }
      toast(data?.message, {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },

    onError(error, variables, context) {
      toast("Failed to like", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
  });

  useEffect(() => {
    let lastTap = 0;
    let hideTimer: NodeJS.Timeout;

    const handleDoubleClick = () => {
      setShowButton(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShowButton(false), 10000);
    };

    const handleTouch = () => {
      const now = Date.now();
      const timeSince = now - lastTap;

      if (timeSince < 300 && timeSince > 0) {
        // Detected double tap
        handleDoubleClick();
      }

      lastTap = now;
    };

    // Desktop double click
    window.addEventListener("dblclick", handleDoubleClick);
    // Mobile double tap
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("touchstart", handleTouch);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleAutoScroll = () => {
    if (!scrolling) {
      setScrolling(true);
    } else {
      setSpeed((prev) => (prev >= 8 ? 2 : prev * 2));
    }
  };

  const subscribe = () => {
    if (!token) {
      router.push(`/auth/login?previous=${prevRoutes(uid).comic}`);
      return;
    }
    likeComic();
  };
  const {
    data: currentEpisode,
    isLoading: isLoadingEpisode,
    isFetching: isFetchingEpisode,
    refetch: refetchEpisode,
  } = useQuery({
    queryKey: ["episode", uid, episodeId, chapter],
    queryFn: () =>
      getRequestProtected(
        `comics/${uid}/episode/${episodeId}/get`,
        token,
        fullUrl
      ),
    enabled: token !== null && !!episodeId,
  });
  console.log("@@currentEpisode", currentEpisode);

  const images = useMemo(
    () => parseArray(currentEpisode?.data?.comicImages || []),
    [currentEpisode, chapter]
  );
  console.log("@comicImages", images);

  // Handle unlock button click for locked images
  const handleUnlockClick = async (panelId: number, imageUrl: string) => {
    if (!token) {
      router.push(`/auth/login?previous=${prevRoutes(uid).comic}`);
      return;
    }

    setSelectedPanelId(panelId);
    setSelectedPanelImage(imageUrl);
    setIsLoadingUnlockOptions(true);

    try {
      // Fetch unlock options for this panel
      const response = await getRequestProtected(
        `unlock-tasks`,
        token,
        fullUrl
      );
      console.log("@@response", response);

      if (response?.success && Array.isArray(response?.data)) {
        setUnlockOptions(response.data);
        setSelectedUnlockOption(0);
        setShowUnlockDialog(true);
      } else {
        toast(response?.message || "Failed to fetch unlock options", {
          type: "error",
        });
      }
    } catch (error: any) {
      toast(
        error?.response?.data?.message ||
          "An error occurred while fetching unlock options",
        {
          type: "error",
        }
      );
    } finally {
      setIsLoadingUnlockOptions(false);
    }
  };

  // Detect unlock options in currentEpisode response (legacy - may not be needed)
  useEffect(() => {
    if (
      currentEpisode?.success &&
      Array.isArray(currentEpisode?.data) &&
      currentEpisode.data.length > 0
    ) {
      // Check if it's unlock options structure
      const firstItem = currentEpisode.data[0];
      if (
        firstItem?.tag &&
        (firstItem.tag === "PAY_WITH_AIRTIME" ||
          firstItem.tag === "UNLOCK_WITH_POINT" ||
          firstItem.tag === "UNLOCK_FULL_CHAPTER")
      ) {
        // Only auto-show dialog if no panel is selected (legacy behavior)
        if (!selectedPanelId) {
          setUnlockOptions(currentEpisode.data);
          setShowUnlockDialog(true);
          setSelectedUnlockOption(0); // Default to first option
        }
      }
    }
  }, [currentEpisode, selectedPanelId]);

  const addEpisodeComment = useMutation({
    mutationKey: ["add_episode_comment"],
    mutationFn: () =>
      postRequestProtected(
        { comment: typedComment },
        `/episode-comments/${
          data?.data?.episodes?.[chapter - 1].id
        }/add-episode-comment`,
        token || "",
        fullUrl,
        "json"
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        queryClient.invalidateQueries({
          queryKey: [commentQueryString],
        });
        queryClient.refetchQueries({ queryKey: [commentQueryString] });
        setTypedComment("");
        toast(message, {
          toastId: "add_comment",
          type: "success",
        });
      } else {
        toast(message, {
          toastId: "add_comment",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "add_comment",
        type: "error",
      });
    },
  });
  // const [hasClicked, setHasClicked] = useState(false);
  // useEffect(() => {
  //   const storedClick = localStorage.getItem("hasClickedAd");
  //   if (storedClick === "true") {
  //     setHasClicked(true);
  //   }
  // }, [chapter]);
  // const redirectToAd = () => {
  //   window.open(adLink, "_blank");
  // };
  // const prevChapter = () => {
  //   if (!hasClicked && chapter > 3) {
  //     localStorage.setItem("hasClickedAd", "true");
  //     setHasClicked(true);
  //     redirectToAd();
  //   } else {
  //     if (chapter > 1) {
  //       setChapter((prev) => prev - 1);
  //       localStorage.removeItem("hasClickedAd");
  //       setHasClicked(false);
  //     }
  //   }
  // };
  const prevChapter = () => {
    localStorage.removeItem("hasClickedAd");
    if (chapter > 1) {
      setChapter((prev) => prev - 1);
    }
  };
  const animationRef = useRef<number | null>(null);
  const scrollStep = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const atBottom = scrollTop + windowHeight >= fullHeight;

    if (atBottom) {
      setScrolling(false);
      return;
    }

    window.scrollBy(0, speedRef.current); // ✅ always use the latest speed
    animationRef.current = requestAnimationFrame(scrollStep);
  }, []);

  // const nextChapter = () => {
  //   if (!hasClicked && chapter > 3) {
  //     localStorage.setItem("hasClickedAd", "true");
  //     setHasClicked(true);
  //     redirectToAd();
  //   } else {
  //     if (chapter < parseArray(data?.data?.episodes).length) {
  //       setChapter((prev) => prev + 1);
  //       setTimeout(() => {
  //         window.scrollTo({
  //           top: 0,
  //           behavior: "smooth",
  //         });
  //       }, 50);
  //       localStorage.removeItem("hasClickedAd");
  //       setHasClicked(false);
  //     }
  //   }
  // };
  const nextChapter = () => {
    "clicked next chapter";
    if (chapter < parseArray(data?.data?.episodes).length) {
      setChapter((prev) => prev + 1);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);
    }
  };
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  const backDisabled = useMemo(() => chapter <= 1, [chapter]);

  useEffect(() => {
    if (scrolling) {
      animationRef.current = requestAnimationFrame(scrollStep);
    } else {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrolling, speed]);
  useEffect(() => {
    if (!scrolling) return;

    const cancelOnUserInput = (
      e: MouseEvent | WheelEvent | KeyboardEvent | TouchEvent
    ) => {
      // Prevent scroll cancel if clicking the action button
      const target = e.target as HTMLElement;
      if (target.closest("#scroll-button")) return;

      setScrolling(false);
    };

    window.addEventListener("wheel", cancelOnUserInput, { once: true });
    window.addEventListener("touchstart", cancelOnUserInput, { once: true });
    window.addEventListener("keydown", cancelOnUserInput, { once: true });
    window.addEventListener("mousedown", cancelOnUserInput, { once: true });

    return () => {
      window.removeEventListener("wheel", cancelOnUserInput);
      window.removeEventListener("touchstart", cancelOnUserInput);
      window.removeEventListener("keydown", cancelOnUserInput);
      window.removeEventListener("mousedown", cancelOnUserInput);
    };
  }, [scrolling]);
  const nextDisabled = useMemo(
    () => chapter >= parseArray(data?.data?.episodes).length,
    [chapter, data]
  );
  const subscribed = useMemo(() => {
    return parseArray(data?.data?.likesAndViews?.likes).some((value: any) => {
      return value?.user_id === user?.id;
    });
  }, [user, data]);

  return (
    <main>
      <div className="parent-wrap py-10 relative">
        <div className="min-h-screen   w-[100%] max-w-[1400px] px-[5px] sm:px-[5px] md:px-[10px] lg:px-[25px] xl:px-[25px]  ">
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                id="scroll-button"
                className="fixed bottom-16 right-1 sm:right-5 w-20 h-20 flex flex-col items-center justify-center gap-1 bg-[#061A29] text-white rounded-full shadow-md z-[20] hover:scale-105"
                onClick={handleAutoScroll}
              >
                <AutoScrollIcon className="w-4 h-9 text-white" />
                {speed / initialSpeed}x
              </motion.button>
            )}
          </AnimatePresence>
          <>
            {/* TO ADD LATER */}
            {/* <div className="w-full flex items-center justify-center">
              <button onClick={() => setScrolling((prev) => !prev)}>
                lime
              </button>
            </div> */}
          </>
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="flex items-center gap-4">
              <button
                disabled={backDisabled}
                className={`${backDisabled ? "text-[#475467]" : ""}`}
                onClick={() => prevChapter()}
              >
                <BXSLeft />
              </button>
              Chapter {chapter}
              <button
                disabled={nextDisabled}
                className={`${nextDisabled ? "text-[#475467]" : ""}`}
                onClick={() => nextChapter()}
              >
                <BXSRight />
              </button>
            </div>
            <Button
              isLoading={isPending}
              onClick={() => subscribe()}
              className="bg-[#475467] font-bold"
              size="sm"
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          </div>

          <div className="my-10 sm:my-1 md:my-2 relative">
            <div className="flex flex-col items-center gap-0 lg:gap-0">
              {isLoadingEpisode || isFetchingEpisode ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-full max-w-[80%] h-[600px] bg-gray-800 animate-pulse rounded" />
                  <div className="w-full max-w-[80%] h-[600px] bg-gray-800 animate-pulse rounded" />
                  <div className="w-full max-w-[80%] h-[600px] bg-gray-800 animate-pulse rounded" />
                </div>
              ) : images && images.length > 0 ? (
                images.map((image: any, i: number) => {
                  const isLocked = image?.is_lock === 1;
                  return (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        width: isMobile ? "98%" : "80%",
                        maxWidth: "100%",
                      }}
                    >
                      <Image
                        src={optimizeCloudinaryUrl(image?.image ?? "")}
                        alt="image"
                        width={500}
                        height={600}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                          maxWidth: "100%",
                          background: "var(--image-bkg)",
                          filter: isLocked ? "blur(20px)" : "none",
                          transition: "filter 0.3s ease",
                        }}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 bg-[#0000]/70 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-[#1d2a3c] rounded-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                            <Button
                              onClick={() =>
                                handleUnlockClick(image?.id, image?.image)
                              }
                              isLoading={
                                isLoadingUnlockOptions &&
                                selectedPanelId === image?.id
                              }
                              className="bg-[#05834B] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d5132] transition-colors"
                            >
                              Unlock
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-4 w-full py-20">
                  <p className="text-white">No images found for this chapter</p>
                </div>
              )}
              <div className="flex items-center gap-4 mt-10">
                <button
                  disabled={backDisabled}
                  className={`${backDisabled ? "text-[#475467]" : ""}`}
                  onClick={() => prevChapter()}
                >
                  <BXSLeft />
                </button>
                Chapter {chapter}
                <button
                  disabled={nextDisabled}
                  className={`${nextDisabled ? "text-[#475467]" : ""}`}
                  onClick={() => nextChapter()}
                >
                  <BXSRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-[0] left-0 z-[10]">
        <div className="w-full bg-[#1d2a3c] h-12 flex items-end justify-center px-[5px] sm:px-[5px] md:px-[10px] lg:px-[25px] xl:px-[25px]">
          <div className=" w-[74%]  flex justify-center items-center gap-14 px-1 relative">
            <div
              className={`w-full rounded-[8px] overflow-hidden  $ flex justify-end relative`}
            >
              <input
                type={"text"}
                value={typedComment}
                onChange={(e) => setTypedComment(e.target.value)}
                className={`w-full py-[10px] px-6 bg-[#D9D9D9] rounded-[5px] h-8 text-[#8C8C8C] focus:text-[#000000] border-none pr-16`}
                placeholder={"type here to join the conversation"}
              />
              <div
                className="absolute right-5 top-1 text-[1.2rem] text-[#467b63] hover:text-[#0d5132] cursor-pointer"
                onClick={() => addEpisodeComment.mutate()}
              >
                Post
              </div>
            </div>
            <div
              onClick={toggleCommentPopup}
              className="flex gap-2 items-center"
            >
              <CommentPop />
              {episode?.[chapter - 1]?.episode_comments?.length && (
                <span className="bg-[#05834B] w-5 h-5 rounded-full text-white flex items-center justify-center">
                  {episode?.[chapter - 1]?.episode_comments?.length}
                </span>
              )}
              {}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center relative">
          <AnimatePresence>
            {showCommentPopup && (
              <motion.div
                className="absolute bottom-0 w-[92%] sm:w-[92%] md:w-[85%] lg:w-[80%] xl:w-[80%] z-[-1]"
                initial={{ opacity: 1, height: 0 }}
                animate={{ opacity: 1, height: "32rem" }}
                exit={{ opacity: 1, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <CommentPopUp
                  closePopup={toggleCommentPopup}
                  episodeComments={episode?.[chapter - 1]?.episode_comments}
                  comicId={episode?.[chapter - 1]?.id}
                  queryString={commentQueryString}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <UnlockPanelDialog
        isOpen={showUnlockDialog}
        onClose={() => {
          setShowUnlockDialog(false);
          setSelectedPanelId(null);
          setSelectedPanelImage(null);
        }}
        options={unlockOptions}
        selectedOption={selectedUnlockOption}
        onOptionSelect={setSelectedUnlockOption}
        panelId={selectedPanelId}
        episodeId={episodeId}
        uid={uid || ""}
        onUnlockSuccess={() => {
          refetchEpisode();
          setSelectedPanelId(null);
          setSelectedPanelImage(null);
        }}
        previewImage={
          selectedPanelImage ||
          BackgroundImage ||
          (images && images.length > 0 ? images[0]?.image : undefined)
        }
      />
    </main>
  );
};

export default Page;
