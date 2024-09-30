"use client";

import { Pagination, PaginationProps } from "@nextui-org/react";

const PaginationCustom = ({ ...props }: PaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs">Showing {props.page} of {props.total}</span>
      <Pagination
        {...props}
        radius="sm"
        disableCursorAnimation={false}
        showControls
        showShadow
        classNames={{
          item: "bg-[#ffffff] text-[#212429]",
          cursor: "bg-[var(--green100)]",
          wrapper: "gap-2",
          prev: "bg-[#ffffff] text-[#212429]",
          next: "bg-[#ffffff] text-[#212429]",
        }}
      />
    </div>
  );
};

export default PaginationCustom;
