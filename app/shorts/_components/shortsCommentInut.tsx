import { SendCommnetIcon } from "@/app/_shared/icons/icons";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";

interface ShortCommentInputProps {
  shortId?: number | string | null;
  page?: number; // optional, defaults to 1 if parent wants to pass
  uuid?: string;
  onOptimisticAdd?: (comment: any) => void;
  onOptimisticConfirm?: (tempId: number | string, saved?: any) => void;
  onOptimisticRevert?: (tempId: number | string) => void;
}

interface SendCommentVariables {
  comment: string;
  tempId: string;
}

function ShortCommentInput({
  shortId,
  page = 1,
  uuid,
  onOptimisticAdd,
  onOptimisticConfirm,
  onOptimisticRevert,
}: ShortCommentInputProps) {
  const [message, setMessage] = React.useState("");
  const queryClient = useQueryClient();
  const { user, token } = useSelector(selectAuthState);
  const tempIdRef = React.useRef(0);

  const failComment = (variables: SendCommentVariables, msg?: string) => {
    onOptimisticRevert?.(variables.tempId);
    // give the user their text back so a failed post is not lost
    setMessage((current) => current || variables.comment);
    toast(msg || "Could not post comment. Try again.", {
      toastId: `add_short_comment_err_${shortId}`,
      type: "error",
    });
  };

  const addComment = useMutation({
    mutationKey: ["add_short_comment", uuid],
    mutationFn: async ({ comment }: SendCommentVariables) =>
      postRequestProtected(
        { comment },
        `short-comments/${uuid}/add-comment`,
        token || "",
        prevRoutes().library,
        "json"
      ),
    onSuccess(data, variables) {
      // the request helpers resolve on API failure too, so the flag decides
      // whether the optimistic comment stays or gets rolled back
      if (!data?.success) {
        failComment(variables, data?.message);
        return;
      }

      onOptimisticConfirm?.(variables.tempId, data?.data);
      // Invalidate paginated comments for this short so server canonical data is fetched
      queryClient.invalidateQueries({ queryKey: ["short-comments", shortId] });

      const { message: msg } = data;
      if (msg) toast(msg, { toastId: `add_short_comment_${uuid}`, type: "success" });
    },
    onError(_error, variables) {
      failComment(variables);
    },
  });

  const handleSend = () => {
    const comment = message.trim();
    if (!comment) return;
    if (!token) {
      // show login prompt via toast; UI tooltip can be added where available
      toast.info("Please login to post a comment", { toastId: "login_to_comment" });
      return;
    }
    if (addComment.isPending) return;

    const tempId = `optimistic-${shortId ?? uuid}-${(tempIdRef.current += 1)}`;
    onOptimisticAdd?.({
      id: tempId,
      comment,
      short_id: shortId,
      user_id: user?.id,
      user,
      // the like button reads these, so seed them or a fresh row renders blank
      isLiked: false,
      likesCount: 0,
    });
    // the comment is already on screen, so the box can clear right away
    setMessage("");
    addComment.mutate({ comment, tempId });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ignore Enter while an IME composition is in progress
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="w-full flex items-center gap-2 p-2 bg-transparent pb-4">
      <div className="flex flex-1 items-center bg-[#475467] rounded-full px-4 py-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          enterKeyHint="send"
          placeholder={token ? "Type a comment" : "Login to comment"}
          className="flex-1 bg-[#475467] outline-none text-white text-sm border-none"
          disabled={!token}
          title={!token ? "Login to comment" : undefined}
        />
        <button
          onClick={handleSend}
          className="text-[#00C07F] hover:scale-110 transition-transform"
          disabled={!token || addComment.isPending}
          aria-disabled={!token || addComment.isPending}
        >
          <SendCommnetIcon className="w-6 h-6 text-[#00C07F]" />
        </button>
      </div>
    </div>
  );
}

export default ShortCommentInput;
