"use client";
import { dummyItems } from "@/app/_shared/data";
import { BXSLeft, BXSRight, CommentPop } from "@/app/_shared/icons/icons";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected, postRequestProtected } from "@/app/utils/queries/requests";
import { parseArray } from "@/helpers/parsArray";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { Button } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CommentPopUp from "../_shared/commentpopup";
import {motion,AnimatePresence} from "framer-motion"
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { uid: string | undefined; chapter: string | undefined ;comicid :string};
}) => {
  const { uid, chapter: chapterSlug,comicid } = searchParams;
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [chapter, setChapter] = useState(parseInt(chapterSlug || "0") + 1);
  const [episode, setEpisode] = useState<any[]>([]);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [typedComment, setTypedComment] = useState<string>("");
  const { user, token }: any = useSelector(selectAuthState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
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
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token, pathname),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setEpisode(parseArray(data?.data?.episodes));
  }, [data, isFetching, isSuccess]);
  const currentEpisodeId  =data?.data?.episodes?.[chapter-1]?.id 
  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/like`, token, prevRoutes(uid).comic),
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
  
  const subscribe = () => {
    if (!token) {
      router.push(`/auth/login?previous=${prevRoutes(uid).comic}`);
      return;
    }
    likeComic();
  };
  const { data: episodeCount } = useQuery({
    queryKey: ["episdodelive",currentEpisodeId],
    queryFn: () =>
      getRequestProtected(
        `comics/${uid}/episode/${currentEpisodeId}/get`,
        token,
        pathname
      ),
    enabled: token !== null,
  });
  console.log(episodeCount)
  const addEpisodeComment = useMutation({
    mutationKey: ["add_episode_comment"],
    mutationFn: () =>
      postRequestProtected(
        { comment: typedComment },
        `/episode-comments/${data?.data?.episodes?.[chapter-1].id}/add-episode-comment`,
        token || "",
        prevRoutes().library,
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

  const prevChapter = () => {
    if (chapter > 1) {
      setChapter((prev) => prev - 1);
    }
  };
  const nextChapter = () => {
    if (chapter < parseArray(data?.data?.episodes).length) {
      setChapter((prev) => prev + 1);
    }
  };

  const backDisabled = useMemo(() => chapter <= 1, [chapter]);

  const nextDisabled = useMemo(
    () => chapter >= parseArray(data?.data?.episodes).length,
    [chapter, data]
  );
  const subscribed = useMemo(() => {
    return parseArray(data?.data?.likesAndViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [user, data]);
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="min-h-screen   w-[100%] max-w-[1400px] px-[5px] sm:px-[5px] md:px-[10px] lg:px-[25px] xl:px-[25px]  ">
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
              {parseArray(episode[chapter - 1]?.comic_images).map(
                (image, i) => (
                  <Image
                    key={i}
                    src={`${image?.image || ""}`}
                    alt="iamge"
                    width={500}
                    height={600}
                    style={{
                      width: isMobile ? "98%" : "80%",
                      height: "auto",
                      objectFit: "cover",
                      maxWidth: "100%",
                      background: "var(--image-bkg)",
                    }}
                    unoptimized
                  />
                )
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
            <div onClick={toggleCommentPopup}>
              <CommentPop />
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
    </main>
  );
};

export default Page;
