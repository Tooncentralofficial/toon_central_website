import { ArrowLeft, ArrowRight } from "@/app/_shared/icons/icons";
import React, { useEffect, useState } from "react";
import Comment from "./other/comment";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { prevRoutes } from "@/lib/session/prevRoutes";
const CommentPopUp = ({
  closePopup,
  episodeComments,
  comicId,
  queryString
}: {
  closePopup: () => void;
  episodeComments: any;
  comicId:string;
  queryString?:string
}) => {
  const [episdoeComment,setEpisodeComment]= useState([])
  
  const episodeId = episodeComments?.[0]?.id;
  const { user, token }: any = useSelector(selectAuthState);
  
  const {
    data: commentResponse,
    isSuccess: isCommentSuccess,
    isLoading: isCommentLoading,
  } = useQuery({
    queryKey: [queryString],
    queryFn: () =>
      getRequestProtected(
        `/episode-comments/${comicId}?page=1&limit=10`,
        token,
        prevRoutes().comic
      ),
    staleTime: 0,
  });
  useEffect(()=>{
    if(isCommentSuccess){
      setEpisodeComment(commentResponse?.data?.comic_catalog_comments);
    }
  },[commentResponse])
  
  return (
    <div className="w-full h-[30rem] bg-[#151D29] px-[24px] pt-5 overflow-y-auto">
      <div className="flex gap-2 ">
        <div onClick={closePopup}>
          <ArrowLeft />
        </div>
        <h3>Comments {episdoeComment?.length}</h3>
      </div>
      <div className="mb-5">
        {episdoeComment?.map((item: any,i:number) => (
          <div key={i}>
            <Comment data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPopUp;
