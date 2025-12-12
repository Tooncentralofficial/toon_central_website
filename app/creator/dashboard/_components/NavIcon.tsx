"use client";

const NavIcon = ({ type }: { type: "home" | "chart" | "wallet" }) => {
  switch (type) {
    case "home":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M5 10.5V20h5v-4h4v4h5v-9.5" />
        </svg>
      );
    case "chart":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M4 20h16" />
          <rect x="6" y="10" width="3" height="7" rx="1" />
          <rect x="11" y="6" width="3" height="11" rx="1" />
          <rect x="16" y="12" width="3" height="5" rx="1" />
        </svg>
      );
    case "wallet":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M17 12h2.5" />
          <circle cx="15.5" cy="12" r="1" />
        </svg>
      );
    default:
      return null;
  }
};

export default NavIcon;
