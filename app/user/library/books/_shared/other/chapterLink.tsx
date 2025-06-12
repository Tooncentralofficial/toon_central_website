"use client";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VerticalMenu } from "@/app/_shared/icons/icons";
import React, { useState } from "react";
import { deleteRequestProtected } from "@/app/utils/queries/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";

const ChapterLink = ({
  uid,
  index,
  image,
  comicId,
  chapter,
}: {
  uid:any
  index: number;
  image: string;
  comicId:string;
  chapter: any;
}) => {

  const sanitizedSlug = chapter?.slug.replace(/\s+/g, "-");
  const { user, userType, token } = useSelector(selectAuthState);
  const [show,setShow]= useState<boolean>(false)
  const router = useRouter();

  const readChapter = () =>
    router.push(
      `/comics/${uid}/chapter?chapter=${index}&uid=${uid}&comicid=${comicId}`
    );
  
  const deleteEpisode = useMutation({
    mutationKey: [`comic${comicId}_delete_episode`],
    mutationFn: () =>
      deleteRequestProtected(
        `/my-libraries/chapters/${chapter?.id}/comic/${comicId}/delete`,
        token || "",
        prevRoutes().library
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast("Episode Deleted", {
          toastId: "delete_episode",
          type: "success",
        });
      } else {
        toast(message, {
          toastId: "delete_episode",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "delete_episode",
        type: "error",
      });
    },
  });
  return (
    <div className="flex gap-4 relative">
      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden">
        <Image
          src={image}
          width={60}
          height={60}
          alt={`${chapter?.title || "toon_central"}`}
          style={{
            objectFit: "cover",
            maxWidth: "100%",
            width: "100%",
            height: "100%",
          }}
          unoptimized
        />
      </div>
      <div className="cursor-pointer " onClick={readChapter}>
        <p className="mb-3 text-[#969AA0]">{chapter?.slug}</p>
        <p className="font-bold text-[#FCFCFD]">{chapter?.title}</p>
      </div>
      <div className="mt-1 ml-2" onClick={() => setShow((prev) => !prev)}>
        <VerticalMenu />
      </div>
      {show && (
        <div className="absolute w-[10rem] h-[7rem] bg-[#151d29b9] flex flex-col gap-1 rounded-md left-3">
          <p
            className="hover:bg-[#05834B] pl-3"
            onClick={() => router.push(`/user/library/books/addpart?uuid=${uid}&comicId=${comicId}&chapterid=${chapter.id}`)}
          >
            Edit
          </p>
          {/* <p className="hover:bg-[#05834B] pl-3">View mobile</p> */}
          <p className="hover:bg-[#05834B] pl-3" onClick={()=>deleteEpisode.mutate()}>Delete</p>
        </div>
      )}
    </div>
  );
};

export default ChapterLink;
