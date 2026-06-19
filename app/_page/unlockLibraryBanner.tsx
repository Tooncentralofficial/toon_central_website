"use client";

import Link from "next/link";

export default function UnlockLibraryBanner() {
  return (
    <div className="parent-wrap py-4">
      <div className="child-wrap">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-[16px] border border-white/10 bg-gradient-to-r from-[#0d1b16] via-[#10231b] to-[#0c1118] px-6 py-6 md:px-9 md:py-8">
          {/* Left: icon + copy */}
          <div className="flex items-center gap-5">
            <div className="flex h-[58px] w-[58px] flex-shrink-0 items-center justify-center rounded-[14px] bg-[#0c1612]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="10.5"
                  width="16"
                  height="11"
                  rx="2.5"
                  fill="#4ade80"
                />
                <path
                  d="M7.5 10.5V8a4.5 4.5 0 1 1 9 0v2.5"
                  stroke="#4ade80"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="15" r="1.6" fill="#0c1612" />
                <rect x="11.2" y="15.5" width="1.6" height="3.4" rx="0.8" fill="#0c1612" />
              </svg>
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[22px] font-bold uppercase leading-none tracking-wide text-white md:text-[30px]">
                Unlock the full library
              </h2>
              <p className="text-sm text-[#9aa6b4] md:text-base">
                Premium titles, early chapters, and ad-free reading - all from{" "}
                <span className="line-through">₦500</span>/month.
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            href="/subscription"
            className="group relative inline-flex w-full flex-shrink-0 self-stretch sm:w-auto sm:self-center"
          >
            <span
              className="relative inline-flex w-full items-center justify-center rounded-[6px] bg-gradient-to-b from-[#5fd877] via-[#34c759] to-[#27ab49] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#0c1612] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-3px_0_rgba(0,0,0,0.18),-7px_7px_0_0_#ffffff] transition-all duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-3px_0_rgba(0,0,0,0.18),-9px_9px_0_0_#ffffff] group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.18),-4px_4px_0_0_#ffffff] sm:w-auto"
            >
              Subscribe Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
