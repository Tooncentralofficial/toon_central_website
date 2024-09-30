"use client";

import { Dot, EyeFilled, HeartTwoTone, ThumbsSolid } from "../icons/icons";

const Likes = ({ likesNViews }: { likesNViews?: any }) => {
  let views = likesNViews?.views?.length || 0;
  let likes = likesNViews?.likes?.length || 0;
  return (
    <div className="flex items-center gap-[9px]">
      <div className="flex items-center gap-[2.5px] text-sm font-light">
        <EyeFilled /> {views}
      </div>
      <Dot />
      <div className="flex items-center gap-[2.5px] text-sm font-light">
        <HeartTwoTone /> 1k
      </div>
      <Dot />
      <div className="flex items-center gap-[2.5px] text-sm font-light">
        <ThumbsSolid /> {likes}
      </div>
    </div>
  );
};

export default Likes;
