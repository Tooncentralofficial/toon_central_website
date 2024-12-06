"use client";

import { dummyItems } from "@/app/_shared/data";
import PaginationCustom from "../../../../_shared/sort/pagination";
import Comment from "../other/comment";
import { ComicTab } from "../tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequestProtected, postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";
import Input_ from "postcss/lib/input";
const Comments = ({ data }: ComicTab) => {
  
  
  const { user, userType, token } = useSelector(selectAuthState);
  const comments: any[] = useMemo(() => data?.comments || [], [data]);
  const [comment, setComment] = useState<string>("");
  const [commentData,setCommentData] = useState([])
  const {
    data: commentResponse,
    isSuccess: isCommentSuccess,
    isLoading: isCommentLoading,
  } = useQuery({
    queryKey: [`fetchcomment_${data?.id}`],
    queryFn: () =>
      getRequestProtected(
        `comments/${data?.id}?page=1&limit=10`,
        token,
        prevRoutes().library
      ),
  });
  console.log(commentData)
  const addComment = useMutation({
    mutationKey: ["add_comment"],
    mutationFn: () =>
      postRequestProtected(
        { comment: comment },
        `/comments/${data?.id}/add-comment`,
        token || "",
        prevRoutes().library,
        "json"
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        setComment("")
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
  useEffect(()=>{
    if(isCommentSuccess){
      setCommentData(commentResponse?.data?.comic_comments);
    }
  },[isCommentLoading,isCommentSuccess])
  return (
    <div>
      <div className="w-[37rem] flex gap-5">
        <FlatInput
          label={"Comment"}
          name={"title"}
          value={comment}
          onChange={(e: any) => setComment(e.target.value)}
          
        />
        <div className="mt-7">
          <SolidPrimaryButton
            className="w-full"
            onClick={() => addComment.mutate()}
            isLoading={addComment.isPending}
          >
            Comment
          </SolidPrimaryButton>
        </div>
      </div>
      <div className="pb-10">
        <div className="grid grid-cols-1 gap-8">
          {commentData?.map((item, i) => (
            <div key={i}>
              <Comment data={item} />
            </div>
          ))}
        </div>
      </div>
      {/* <PaginationCustom page={1} total={1} /> */}
    </div>
  );
};

export default Comments;
