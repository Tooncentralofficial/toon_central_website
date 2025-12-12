"use client";

type Status = "Published" | "Scheduled";

const StatusPill = ({ status }: { status: Status }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-[13px] font-bold ${
      status === "Published"
        ? "bg-[#1ec069] text-[#052214]"
        : "bg-[#f5b74a] text-[#3c2403]"
    }`}
  >
    {status}
  </span>
);

export default StatusPill;
