import { SendCommnetIcon } from "@/app/_shared/icons/icons";
import React from "react";

function ShortCommentInput() {
  const [message, setMessage] = React.useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Send:", message);
    setMessage("");
  };

  return (
    <div className="w-full flex items-center gap-2 p-2 bg-transparent  pb-4">
      <div className="flex flex-1 items-center bg-[#475467] rounded-full px-4 py-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a comment"
          className="flex-1 bg-[#475467] outline-none text-white text-sm border-none "
        />
        <button
          onClick={handleSend}
          className="text-[#00C07F] hover:scale-110 transition-transform"
        >
          <SendCommnetIcon className="w-6 h-6 text-[#00C07F]" />
        </button>
      </div>
    </div>
  );
}

export default ShortCommentInput;
