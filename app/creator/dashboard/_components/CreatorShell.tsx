"use client";

import { useState } from "react";
import Link from "next/link";
import NavItem from "./NavItem";
import { BellIcon, CoinsIcon, SearchIcon } from "./Icons";

type CreatorShellProps = {
  activeNav: "dashboard" | "analytics" | "wallet";
  children: React.ReactNode;
};

const CreatorShell = ({ activeNav, children }: CreatorShellProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#050b12] text-[#f5f7fb] flex justify-center px-3 py-5">
      <div
        className="grid w-full max-w-[1440px] gap-5"
        style={{ gridTemplateColumns: collapsed ? "90px 1fr" : "260px 1fr" }}
      >
        <aside
          className={`bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 flex flex-col gap-6 transition-all duration-200 w-full ${
            collapsed ? "items-center" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-[#0f1b28] grid place-items-center text-lg">
              ✒️
            </span>
            {!collapsed && (
              <div className="flex-1">
                <div className="font-bold text-[17px] leading-tight">
                  ToonCentral
                </div>
                <div className="text-[#2ad177] text-[13px]">Creator Pro</div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-[22px] h-[22px] rounded-full bg-[#f33a3a] grid place-items-center text-[12px] font-bold">
                1
              </div>
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="w-9 h-9 rounded-xl border border-[#122034] bg-[#0f1b28] text-[#7f8ca0] grid place-items-center text-sm"
                aria-label="Toggle sidebar"
                title="Toggle sidebar"
              >
                {collapsed ? "»" : "«"}
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link href="/creator/dashboard">
              <NavItem
                active={activeNav === "dashboard"}
                icon="home"
                label="Dashboard"
                collapsed={collapsed}
              />
            </Link>
            <Link href="/creator/dashboard/analytics">
              <NavItem
                active={activeNav === "analytics"}
                icon="chart"
                label="Analytics"
                badge="New"
                collapsed={collapsed}
              />
            </Link>
            <Link href="/creator/dashboard/wallet">
              <NavItem
                active={activeNav === "wallet"}
                icon="wallet"
                label="Wallet"
                collapsed={collapsed}
              />
            </Link>
          </nav>

          <div
            className={`mt-auto relative grid gap-3 rounded-[14px] bg-[#082816] p-4 ${
              collapsed
                ? "grid-cols-1 justify-items-center text-center"
                : "grid-cols-[44px_1fr]"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-[#1ec069] text-[#062013] grid place-items-center font-bold">
              CR
            </div>
            {!collapsed && (
              <div className="flex flex-col gap-1">
                <div className="font-bold">Creator Name</div>
                <div className="text-[#85f0b3] text-[13px]">Pro Member</div>
                <div className="text-[#7f8ca0] text-[12px]">
                  Level 5 Creator
                </div>
              </div>
            )}
            {!collapsed && (
              <div className="absolute right-4 bottom-3 flex items-center gap-2 text-[#7f8ca0] text-[13px]">
                <span className="w-2 h-2 rounded-full bg-[#1ec069]" />
                Online
              </div>
            )}
          </div>
        </aside>

        <main className="flex flex-col gap-4">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 bg-[#0f1b28] border border-[#122034] rounded-xl px-3 py-2 text-[#7f8ca0]">
              <SearchIcon />
              <input
                placeholder="Search your comics..."
                className="bg-transparent outline-none text-[#f5f7fb] w-full placeholder:text-[#7f8ca0]"
              />
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="inline-flex items-center gap-2 bg-[#0f1b28] border border-[#122034] rounded-full px-3 py-2 text-[#1ec069] font-bold">
                <CoinsIcon />
                <span>2,847</span>
                <span className="text-[#7f8ca0] font-semibold">Credits</span>
              </div>
              <button
                className="w-10 h-10 rounded-xl border border-[#122034] bg-[#0f1b28] text-[#f5f7fb] grid place-items-center"
                aria-label="Notifications"
              >
                <BellIcon />
              </button>
              <button className="w-10 h-10 rounded-xl border border-[#122034] bg-[#1ec069] text-[#062013] font-bold">
                CR
              </button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
};

export default CreatorShell;

