"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ViewComicProps } from "../page";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRequestProtected,
  putRequestProtected,
} from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { formatDate, parseArray } from "@/helpers/parsArray";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";
import { LoadingLibraryItem } from "../../_shared/loadingLibraryItem";
import { Button } from "@nextui-org/react";

const LibraryBookOverview = ({
  uid,
  data,
  isLoading,
  comicId,
}: ViewComicProps) => {
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
    queryFn: () => getRequestProtected(`/comics/${uid}/like`, token, pathname),
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

  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationKey: [`publish_${uid}`],
    mutationFn: () =>
      putRequestProtected(
        null,
        `/my-libraries/comics/${data?.id}/toggle`,
        token || "",
        pathname,
        "json"
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "comic_in_library",
          type: "success",
        });
      } else {
        toast(message, {
          toastId: "comic_in_library",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "comic_in_library",
        type: "error",
      });
    },
  });
  return (
    <>
      <div className="flex flex-col  my-10 ">
        {data == null ? (
          <LoadingLibraryItem />
        ) : (
          <div className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] p-6 lg:p-9">
            <div className=" flex gap-6">
              <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] h-[140px] md:h-[271px] rounded-lg overflow-hidden">
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
                <div className="flex flex-col sm:flex-row text-gray text-xs md:text-base gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
                  <span> Published : {formatDate(data?.createdAt)}</span>
                  <span> Published : {formatDate(data?.updatedAt)}</span>
                  <span> Episodes : {parseArray(data?.episodes).length}</span>
                </div>

                <div className="hidden md:block ">
                  <p className="text-gray text-lg mb-7">{data?.description}</p>
                  <div className="flex gap-5 items-center">
                    <SolidPrimaryButton
                      className="w-max"
                      isDisabled={!data?.uuid}
                      as={Link}
                      href={`/creator/edit?uuid=${data?.uuid}&comicId=${data?.id}`}
                    >
                      Edit
                    </SolidPrimaryButton>
                    <Button
                      isDisabled={data?.statusId == 1}
                      onClick={() => data?.statusId == 0 && publish()}
                      className="  rounded-lg"
                      size="lg"
                      isLoading={isPublishing}
                    >
                      {data?.statusId == 1 ? "Published" : "Publish"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden ">
              <p className="text-gray text-base mb-7">{data?.description}</p>
              <SolidPrimaryButton
                className="w-max"
                disabled={!data?.uuid}
                as={Link}
                href={`/creator/edit?uuid=${data?.uuid}&comicId=${data?.id}`}
              >
                Edit
              </SolidPrimaryButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LibraryBookOverview;
// creator/edit
