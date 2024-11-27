"use client";

import { dummyItems } from "@/app/_shared/data";
import PaginationCustom from "../../../../_shared/sort/pagination";
import Comment from "../other/comment";
import { ComicTab } from "../tabs";
import { useMemo, useState } from "react";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";

const Comments = ({ data }: ComicTab) => {
  console.log(data)
  const comments:any[] = useMemo(() => data?.comments || [], [data]);
  const [comment,setComment] = useState()
  return (
    <div>
      <div className="w-[37rem] flex gap-5">
        <FlatInput
          label={"Comment"}
          name={"title"}
          value={comment}
          onChange={(e: any) => setComment(e.target.value)}
        />
        <div className="mt-7" >
          <SolidPrimaryButton className="w-full">Comment</SolidPrimaryButton>
        </div>
      </div>
      <div className="pb-10">
        <div className="grid grid-cols-1 gap-8">
          {comments.map((item, i) => (
            <div key={i}>
              <Comment />
            </div>
          ))}
        </div>
      </div>
      {/* <PaginationCustom page={1} total={1} /> */}
    </div>
  );
};

export default Comments;
