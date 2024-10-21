"use client";
import { dummyItems } from "@/app/_shared/data";
import { BXSLeft, BXSRight } from "@/app/_shared/icons/icons";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const pathname=usePathname()
  const { uid, chapter } = searchParams;
  const [episode, setEpisode] = useState<any[]>([]);
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uid}`],
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token,pathname),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setEpisode(data?.data?.episodes || []);
  }, [data, isFetching, isSuccess]);
  const chapterNum=useMemo(()=>{
    if(chapter){
      return parseInt(chapter.toString())
    }
    return 1
  },[chapter])
//  const {data:likeData,refetch:likeComic}=useQuery({
//     queryKey:["like"],
//     queryFn:()=>{}
//   })
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap min-h-screen">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="flex items-center gap-4">
              {/* <button>
                <BXSLeft />{" "}
              </button> */}
              Chapter {chapterNum+1}
              {/* <button>
                <BXSRight />
              </button> */}
            </div>
            <div>Subscribe</div>
          </div>
          <div className="my-10">
            <div className="flex flex-col items-center gap-6 lg:gap-8">
              {episode?.length > 0 && (
                <Image
                  src={`${episode[chapterNum]?.comic_image || ""}`}
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
              )}

              {/* {dummyItems.map((item, i) => (
                <Image
                  key={i}
                  src={`/static/images/comics/Panel${i + 1}.PNG`}
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
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
