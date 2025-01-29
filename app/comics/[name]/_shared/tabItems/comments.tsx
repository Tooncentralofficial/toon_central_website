"use client";

import { dummyItems } from "@/app/_shared/data";
import PaginationCustom from "../../../../_shared/sort/pagination";
import Comment from "../other/comment";
import { ComicTab } from "../tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatInput, InputOutline, InputSolid } from "@/app/_shared/inputs_actions/inputFields";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected, postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";
import Input_ from "postcss/lib/input";
import { CommentIcon, Mobilecommenticon, Sendicon } from "@/app/_shared/icons/icons";
import {motion} from 'framer-motion'
import Picker from "@emoji-mart/react";
import dat from "@emoji-mart/data";
const Comments = ({ data }: ComicTab) => {
  
  
  const { user, userType, token } = useSelector(selectAuthState);
  const comments: any[] = useMemo(() => data?.comments || [], [data]);
  const [comment, setComment] = useState<string>("");
  const [commentData,setCommentData] = useState([])
  const queryClient = useQueryClient();
  const querykey = `fetchcomment_${data?.id}`
  const[currentEmoji,setCurrentEmoji ]= useState()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  console.log(pagination)
  const {
    data: commentResponse,
    isSuccess: isCommentSuccess,
    isLoading: isCommentLoading,
  } = useQuery({
    queryKey: [querykey,pagination.page],
    queryFn: () =>
      getRequestProtected(
        `comments/${data?.id}?page=${pagination.page}&limit=5`,
        token,
        prevRoutes().library
      ),
    staleTime: 0,
  });
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
          queryClient.invalidateQueries({
            queryKey: [`fetchcomment_${data?.id}`],
          });
         queryClient.refetchQueries({ queryKey: [querykey] });
        setComment("")
        toast(message, {
          toastId: "add_comment",
          type: "success",
        });
       ;
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
      console.log("lime")
      setCommentData(commentResponse?.data?.comic_comments || []);
      setPagination(() => ({
        page: commentResponse?.data?.pagination?.currentPage || 1,
        total: commentResponse?.data?.pagination?.totalPages || 1,
      }));
    }
  },[isCommentLoading,isCommentSuccess,commentData,pagination.page])
  const changePage = (page: number) => {
    console.log(page)
    setPagination((prevState) => ({
      ...prevState,
      page: page,
    }));
  };
  const addEmoji = (emoji: any) => {
    setComment((prev) => prev + emoji.native);
    setShowEmojiPicker(false)
  };
  return (
    <div>
      <div className="pb-10">
        <div className="grid grid-cols-1 gap-8">
          {commentData?.map((item: any, i) => (
            <div key={i}>
              <Comment data={item} createdAt={item?.created_at} />
            </div>
          ))}
        </div>
      </div>
      <div className=" hidden md:flex gap-5  ">
        <aside className="mt-3">
          <CommentIcon />
        </aside>
        <div className="w-full relative">
          <FlatInput
            label={""}
            placeholder="Type here to join the conversation"
            name={"title"}
            value={comment}
            onChange={(e: any) => setComment(e.target.value)}
            placecolor
          />
          <span
            className="absolute right-3 top-4 text-[#05834B] text-[1.2rem]"
            onClick={() => addComment.mutate()}
          >
            Post
          </span>
        </div>
      </div>

      <div className=" flex gap-5 relative md:hidden w-full">
        <div className="w-full bg-[#FAFCFE] shadow-lg rounded-2xl p-3 relative ">
          {/* Top Section: Avatar + Input + Send Button */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <Mobilecommenticon />
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Leave a comment"
              className="flex-1 outline-none text-[#05834B] placeholder:text-[#05834B] bg-[#FAFCFE]"
              value={comment}
              onChange={(e: any) => setComment(e.target.value)}
            />

            {/* Send Button */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-md"
              onClick={() => addComment.mutate()}
            >
              <Sendicon />
            </button>
          </div>

          {/* Bottom Section: Emoji, GIF, Attachments */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700"
            >
              😊
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <PaginationCustom
          onChange={changePage}
          total={pagination.total}
          page={pagination.page}
        />
      </div>
      {showEmojiPicker && (
        <div className="absolute top-40 left-0">
          <Picker data={dat} onEmojiSelect={addEmoji} theme="light"  perRow={4} />
          
        </div>
      )}
    </div>
  );
};

export default Comments;
