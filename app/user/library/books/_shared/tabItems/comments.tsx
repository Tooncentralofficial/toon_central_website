"use client";

import Comment from "../other/comment";
import { ComicTab } from "../tabs";
import { useMemo } from "react";

const Comments = ({ data }: ComicTab) => {
  const comments:any[] = useMemo(() => data?.comments || [], [data]);
  return (
    <div>
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
