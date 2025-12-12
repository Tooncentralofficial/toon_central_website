"use client";

const MetaIcon = ({ type }: { type: "eye" | "heart" | "comment" | "time" }) => {
  switch (type) {
    case "eye":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[16px] h-[16px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "heart":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[16px] h-[16px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10Z" />
        </svg>
      );
    case "comment":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[16px] h-[16px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M5 19v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9Z" />
          <path d="M6 8h12M6 12h7" />
        </svg>
      );
    case "time":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[16px] h-[16px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
};

export default MetaIcon;
