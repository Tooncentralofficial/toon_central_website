"use client";

import NavIcon from "./NavIcon";

const QuickAction = ({
  icon,
  label,
}: {
  icon: "chart" | "book";
  label: string;
}) => (
  <button className="w-full flex items-center gap-2 px-3 py-3 rounded-[12px] border border-[#122034] bg-[#0b101a] text-[#f5f7fb] text-left">
    <NavIcon type={icon === "chart" ? "chart" : "wallet"} />
    <span>{label}</span>
  </button>
);

export default QuickAction;
