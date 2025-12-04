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
}

function ShortCommentInput({ shortId, page = 1 }: ShortCommentInputProps) {
  const [message, setMessage] = React.useState("");
  const queryClient = useQueryClient();
  const { token } = useSelector(selectAuthState) as { token?: string };
  const addComment = useMutation({
    mutationKey: ["add_short_comment", shortId],
    mutationFn: async () =>
      postRequestProtected(
        { comment: message },
        `short-comments/${shortId}/add-comment`,
        token || "",
        prevRoutes().library,
        "json"
      ),
    onSuccess(data) {
      // Invalidate paginated comments for this short so server canonical data is fetched
      queryClient.invalidateQueries({ queryKey: ["short-comments", shortId] });
      setMessage("");
      try {
        const { message: msg } = data;
        if (msg) toast(msg, { toastId: `add_short_comment_${shortId}`, type: "success" });
      } catch (e) {
        // ignore
      }
    },
    onError() {
      toast("Could not post comment. Try again.", {
        toastId: `add_short_comment_err_${shortId}`,
        type: "error",
      });
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    if (!token) {
      // show login prompt via toast; UI tooltip can be added where available
      toast.info("Please login to post a comment", { toastId: "login_to_comment" });
      return;
    }

    addComment.mutate();
  };

  return (
    <div className="w-full flex items-center gap-2 p-2 bg-transparent pb-4">
      <div className="flex flex-1 items-center bg-[#475467] rounded-full px-4 py-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={token ? "Type a comment" : "Login to comment"}
          className="flex-1 bg-[#475467] outline-none text-white text-sm border-none"
          disabled={!token || addComment.isPending}
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
