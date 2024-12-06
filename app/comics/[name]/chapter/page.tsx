"use client";
import { dummyItems } from "@/app/_shared/data";
import { BXSLeft, BXSRight } from "@/app/_shared/icons/icons";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
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
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { uid: string | undefined; chapter: string | undefined };
}) => {
  
  const { uid, chapter:chapterSlug } = searchParams;
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  //chapter state and update
  const [chapter, setChapter] = useState(parseInt(chapterSlug || "0") + 1);
  const [episode, setEpisode] = useState<any[]>([]);
  const { user, token }: any = useSelector(selectAuthState);
   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

   
   useEffect(() => {
     const handleResize = () => {
       setIsMobile(window.innerWidth < 600);
     };
     window.addEventListener("resize", handleResize);
     return () => window.removeEventListener("resize", handleResize);
   }, []);
  
  const comicQueryKey = `comic_${uid}`;

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [comicQueryKey],
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token, pathname),
    enabled: token !== null,
  });


  useEffect(() => {
    if (isSuccess) setEpisode(parseArray(data?.data?.episodes));
  }, [data, isFetching, isSuccess]);

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
          <div className="my-10 sm:my-1 md:my-2">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
