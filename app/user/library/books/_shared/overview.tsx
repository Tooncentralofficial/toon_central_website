"use client";

import Likes from "@/app/_shared/cards/likes";
import { GreenUser } from "@/app/_shared/icons/icons";
import { Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ViewComicProps } from "../page";
import { useQuery } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { formatDate, parseArray } from "@/helpers/parsArray";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";

const LibraryBookOverview = ({ uid, data, isLoading ,comicId }: ViewComicProps) => {
  const disabled = useMemo(() => data?.episodes?.length <= 0, [data]);
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const { user, token } = useSelector(selectAuthState);
  const readChapter = () =>
    router.push(`${pathname}/chapter?chapter=${0}&uid=${uid}`);
  const {
    data: likeResponse,
    isSuccess: isLikeSuccess,
    refetch: likeComic,
    isLoading: isLiking,
  } = useQuery({
    queryKey: ["like"],
    queryFn: () => getRequestProtected(`/comics/${uid}/like`, token),
    enabled: isLiked != false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  useEffect(() => {
    if (isLikeSuccess) {
      toast(likeResponse?.message, {
        toastId: `toast_${uid}`,
        type: "success",
      });
      setIsLiked(false);
    }
    return setIsLiked(false);
  }, [likeResponse]);
  const subscribe = () => {
    setIsLiked(true);
    likeComic();
  };
  return (
    <Skeleton
      isLoaded={data !== null}
      className={`${
        data == null && "h-[300px]"
      } bg-secondary my-10 rounded-lg `}
    >
      <div className="bg-[var(--bg-secondary)] rounded-sm p-6 lg:p-9">
        <div className=" flex gap-6">
          <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] max-h-[120px] sm:max-h-unset rounded-lg overflow-hidden">
            <Image
              src={`${data?.backgroundImage || data?.coverImage || ""}`}
              alt={`${data?.title || "toon_central"}`}
              width={200}
              height={271}
              style={{
                objectFit: "cover",
                maxWidth: "100%",
                width: "100%",
                height: "100%",
              }}
              unoptimized
            />
          </div>
          <div className="w-[80%] ">
            <p className="text-gray font-bold mb-2">Continue writing</p>
            <p className="text-2xl font-semibold lg:text-4xl uppercase">
              {data?.title}
            </p>
            <div className="hidden sm:flex flex-col sm:flex-row text-gray gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
              <span> Published : {formatDate(data?.createdAt)}</span>
              <span> Published : {formatDate(data?.updatedAt)}</span>
              <span> Episodes : {parseArray(data?.episodes).length}</span>
            </div>

            <div className="hidden lg:block text-lg">
              <p className="text-gray">{data?.description}</p>
            </div>
          </div>
        </div>

        <div className="flex sm:hidden text-gray gap-1 sm:gap-6 justify-between w-full max-w-[460px] pt-3">
          <span> Published : {formatDate(data?.createdAt)}</span>
          <span> Published : {formatDate(data?.updatedAt)}</span>
          <span> Episodes : {parseArray(data?.episodes).length}</span>
        </div>

        <div className="block lg:block text-lg mt-3">
          {/* <p className="text-gray">{data?.description}</p> */}
          <div className="w-[100px] mt-3">
            <SolidPrimaryButton
              disabled={data?.uuid}
              as={Link}
              href={`/creator/edit?uuid=${data?.uuid}&comicId=${data?.id}`}
            >
              Edit
            </SolidPrimaryButton>
          </div>
        </div>
      </div>
    </Skeleton>
  );
};

export default LibraryBookOverview;
// creator/edit