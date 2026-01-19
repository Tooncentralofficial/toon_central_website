"use client";
import { CreditIcon } from "../icons/icons";

interface CreditsBannerProps {
  credits?: number;
}

export default function CreditsBanner({ credits }: CreditsBannerProps) {
  // Format number with commas (e.g., 2847 -> "2,847")
  const formatCredits = (value: number | undefined): string => {
    if (value === undefined || value === null) {
      return "---";
    }
    return value.toLocaleString("en-US");
  };

  return (
    <div className="inline-flex items-center gap-2 bg-[var(--bg-menu-cont)] border border-[#122034] rounded-lg px-3 py-2">
      <CreditIcon className="w-5 h-5 text-[#34D399] flex-shrink-0" />
      <span className="text-[#34D399] font-bold text-base">
        {formatCredits(credits)}
      </span>
      <span className="text-[#7f8ca0] font-semibold text-sm">Credits</span>
    </div>
  );
}
