"use client";
import { dummyItems } from "@/app/_shared/data";
import { BXSLeft, BXSRight } from "@/app/_shared/icons/icons";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { parseArray } from "@/helpers/parsArray";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { uid: string | undefined; chapterSlug: string | undefined };
}) => {
  const { uid, chapterSlug } = searchParams;

  //chapter state and update
  const [chapter, setChapter] = useState(parseInt(chapterSlug || "0") + 1);
  const [episode, setEpisode] = useState<any[]>([]);
  const [subscribing, setSubscribing] = useState(false);
  const { token }: any = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uid}`],
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setEpisode(parseArray(data?.data?.episodes));
  }, [data, isFetching, isSuccess]);

  //  const {data:likeData,refetch:likeComic}=useQuery({
  //     queryKey:["like"],
  //     queryFn:()=>{}
  //   })
  const subscribe = async () => {
    setSubscribing(true);
    const { data, message, success } = await getRequestProtected(
      `/comics/${uid}/subscribe`,
      token
    );

    if (success) {
      toast(message, {
        toastId: "view_comic",
        type: "success",
      });
    } else {
      toast(message, {
        toastId: "view_comic",
        type: "error",
      });
    }
    setSubscribing(false);
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
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap min-h-screen">
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
              isLoading={subscribing}
              onClick={() => subscribe()}
              className="bg-[#475467] font-bold"
              size="sm"
            >
              Subscribe
            </Button>
          </div>
          <div className="my-10">
            <div className="flex flex-col items-center gap-6 lg:gap-8">
              {parseArray(episode[chapter - 1]?.comic_images).map(
                (image, i) => (
                  <Image
                  key={i}
                    src={`${image?.image || ""}`}
                    alt="iamge"
                    width={500}
                    height={600}
                    style={{
                      width: "80%",
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
