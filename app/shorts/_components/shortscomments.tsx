import Image from "next/image";
import React from "react";
import UserImg from "@/public/static/images/shareimg.png";
import { ShortscommentLikeIcon } from "@/app/_shared/icons/icons";
import { CommentType, PaginationType } from "@/helpers/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useSelector } from "react-redux";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";


const isPersistedId = (id: unknown) =>
  typeof id === "number" || (typeof id === "string" && /^\d+$/.test(id));

const ShortsComments = ({
  shortId,
  comment,
  pagination,
  pending,
}: {
  shortId?: number | string | null;
  comment?: CommentType;
  pagination?: PaginationType;
  pending?: boolean;
}) => {
  const { token } = useSelector(selectAuthState);
  const queryClient = useQueryClient();

  const commentId = comment?.id;
  const serverIsLiked = comment?.isLiked ?? false;
  const serverLikesCount = comment?.likesCount ?? 0;

  
  const [isLiked, setIsLiked] = React.useState(serverIsLiked);
  const [likesCount, setLikesCount] = React.useState(serverLikesCount);

  
  const lastServerRef = React.useRef({
    id: commentId,
    isLiked: serverIsLiked,
    likesCount: serverLikesCount,
  });
  React.useEffect(() => {
    const last = lastServerRef.current;
    if (
      last.id === commentId &&
      last.isLiked === serverIsLiked &&
      last.likesCount === serverLikesCount
    ) {
      return;
    }
    lastServerRef.current = {
      id: commentId,
      isLiked: serverIsLiked,
      likesCount: serverLikesCount,
    };
    setIsLiked(serverIsLiked);
    setLikesCount(serverLikesCount);
  }, [commentId, serverIsLiked, serverLikesCount]);

  const revertLike = (attempted: boolean) => {
    setIsLiked(!attempted);
    setLikesCount((count) => Math.max(0, attempted ? count - 1 : count + 1));
  };

  const { mutate: likeComment, isPending: likeInFlight } = useMutation({
    mutationKey: ["like_short_comment", commentId],
    mutationFn: (_nextLiked: boolean) =>
      postRequestProtected(
        { commentId },
        `short-comments/${commentId}/like`,
        token || "",
        prevRoutes().library,
        "json"
      ),
    onSuccess: (data, nextLiked) => {
      
      if (!data?.success) {
        revertLike(nextLiked);
        toast.error(data?.message || "Failed to like comment");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["short-comments"] });
    },
    onError: (_error, nextLiked) => {
      revertLike(nextLiked);
      toast.error("Failed to like comment");
    },
  });

  
  const canLike = !pending && isPersistedId(commentId) && !likeInFlight;

  const handleLike = () => {
    if (!token) {
      toast.info("Please login to like a comment", {
        toastId: "login_to_like_comment",
      });
      return;
    }
    if (!canLike) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((count) => Math.max(0, nextLiked ? count + 1 : count - 1));
    likeComment(nextLiked);
  };

  return (
    <div
      className={`flex gap-2 justify-between transition-opacity ${
        pending ? "opacity-60" : "opacity-100"
      }`}
    >
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
          onClick={handleLike}
          disabled={!!token && !canLike}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike comment" : "Like comment"}
          title={pending ? "Posting comment..." : undefined}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShortscommentLikeIcon
            className={`h-5 w-5 cursor-pointer ${
              isLiked ? "text-[#4ADD80]" : "text-white"
            }`}
          />
        </button>
        <span className="text-xs text-white/70">{likesCount}</span>
      </div>
    </div>
  );
};

export default ShortsComments;
