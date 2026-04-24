import Image from "next/image";
import React from "react";
import UserImg from "@/public/static/images/shareimg.png";
import { ShortscommentLikeIcon } from "@/app/_shared/icons/icons";
import { CommentType, PaginationType } from "@/helpers/types";

const ShortsComments = ({
  shortId,
  comment,
  pagination,
}: {
  shortId?: number | string | null;
  comment?: CommentType;
  pagination?: PaginationType;
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const likeCount = (comment as any)?.likes_count ?? 0;

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex gap-3 flex-1 min-w-0">
        <div className="min-w-[2.5rem] w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={comment?.user?.photo || UserImg}
            alt={comment?.user?.username || "User avatar"}
            width={40}
            height={40}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="flex flex-col text-sm min-w-0">
          <h3 className="font-semibold text-white truncate">
            {comment?.user?.username || ""}
          </h3>
          <p className="text-white/80 break-words">{comment?.comment}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsLiked((v) => !v)}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike comment" : "Like comment"}
        >
          <ShortscommentLikeIcon
            className={`h-5 w-5 cursor-pointer ${
              isLiked ? "text-[#4ADD80]" : "text-white"
            }`}
          />
        </button>
        <span className="text-xs text-white/70">{likeCount}</span>
      </div>
    </div>
  );
};

export default ShortsComments;