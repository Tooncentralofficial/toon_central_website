import { ArrowLeft, ArrowRight } from "@/app/_shared/icons/icons";
import React from "react";
import Comment from "./other/comment";
const CommentPopUp = ({
  closePopup,
  episodeComments,
}: {
  closePopup: () => void;
  episodeComments: any;
}) => {
  return (
    <div className="w-full h-[30rem] bg-[#151D29] px-[24px] pt-5 overflow-y-auto">
      <div className="flex gap-2 ">
        <div onClick={closePopup}>
          <ArrowLeft />
        </div>
        <h3>Comments</h3>
      </div>
      <div className="mb-5">
        {episodeComments?.map((item: any,i:number) => (
          <div key={i}>
            <Comment data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPopUp;
