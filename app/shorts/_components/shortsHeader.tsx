"use client";
import React from "react";
import Link from "next/link";
import { ToonCentralIcon } from "../../_shared/icons/icons";
import { BellIcon, SearchIcon } from "../../_shared/icons/icons";

export default function ShortsHeader() {
  return (
    <header className="bg-[var(--bg-menu-cont)] border-b border-[var(--border-color)] px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ToonCentralIcon />
          <span className="text-xl font-bold text-[var(--text-primary)]">
            Shorts
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[var(--hover-bg)] transition-colors">
            <SearchIcon />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--hover-bg)] transition-colors">
            <BellIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
