"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import StatusPill from "./_components/StatusPill";
import Meta from "./_components/Meta";
import QuickAction from "./_components/QuickAction";
import { StatIcon } from "./_components/Icons";
import CreatorShell from "./_components/CreatorShell";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { getRequestProtected } from "@/app/utils/queries/requests";
import {
  CreatorDashboardStats,
  RecentComicPerformance,
} from "@/app/utils/constants/typess";

type Stat = {
  label: string;
  value: string;
  delta: string;
};

const formatNumber = (value: number | undefined | null) =>
  typeof value === "number" ? value.toLocaleString() : "—";

const formatCurrency = (value: number | undefined | null) =>
  typeof value === "number" ? `$${value.toLocaleString()}` : "—";

const formatDelta = (change: number | null | undefined) => {
  if (typeof change !== "number") return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}% from last month`;
};


const DashboardClient = () => {
  const { user, token } = useSelector(selectAuthState);
  const pathname = usePathname();
  const isLoggedIn = Boolean(token && user);

  const { data: dashboardData } = useQuery({
    queryKey: ["creator_dashboard_stats"],
    queryFn: () => getRequestProtected("/creator/dashboard", token, pathname),
    enabled: isLoggedIn,
  });

  const dashboardStats: CreatorDashboardStats | undefined =
    dashboardData?.data;

  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Total Views",
        value: formatNumber(dashboardStats?.total_views),
        delta: formatDelta(dashboardStats?.total_views_change),
      },
      
      {
        label: "Subscribers",
        value: formatNumber(dashboardStats?.subscribers),
        delta: formatDelta(dashboardStats?.subscribers_change),
      },
      {
        label: "Total Likes",
        value: formatNumber(dashboardStats?.total_likes),
        delta: formatDelta(dashboardStats?.total_likes_change),
      },
      {
        label: "Total Earnings",
        value: formatCurrency(dashboardStats?.total_earnings),
        delta: formatDelta(dashboardStats?.total_earnings_change),
      },
    ],
    [dashboardStats]
  );

  const { data: recentPerformanceData } = useQuery({
    queryKey: ["creator_recent_performance", 5],
    queryFn: () =>
      getRequestProtected(
        "/creator/recent-performance?limit=5",
        token,
        pathname
      ),
    enabled: isLoggedIn || !!token || !!user,
  });
  console.log("@@recentPerformanceData",recentPerformanceData);
  const performance: RecentComicPerformance[] = useMemo(
    () => recentPerformanceData?.data || [],
    [recentPerformanceData]
  );

  return (
    <CreatorShell activeNav="dashboard">
      <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight">
            Creator Dashboard
          </h1>
          <p className="text-[#7f8ca0] mt-1">
            Welcome to ToonC_NG! Here&apos;s what&apos;s happening with your
            comics.
          </p>
        </div>
        <button className="bg-[#1ec069] text-[#03150b] rounded-[10px] px-4 py-3 font-bold shadow-[0_12px_30px_rgba(30,192,105,0.3)]">
          Withdraw Earnings
        </button>
      </section>

      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 grid grid-cols-[44px_1fr] gap-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0f1b28] grid place-items-center text-[#1ec069]">
              <StatIcon />
            </div>
            <div>
              <div className="text-[#a7b4c7] text-sm">{stat.label}</div>
              <div className="text-[26px] font-bold leading-tight">
                {stat.value}
              </div>
              <div className="text-[#1ec069] text-[13px] mt-1">
                {stat.delta}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[2fr_0.9fr]">
        <div className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3">
            <h2 className="text-[20px] font-semibold">
              Recent Comic Performance
            </h2>
            <p className="text-[#7f8ca0] mt-1">
              Your latest episodes and their performance
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {performance.map((item, index) => (
              <div
                key={index}
                className="bg-[#05060C] border border-[#122034] rounded-[12px] p-3 grid grid-cols-[72px_1fr_auto] gap-3 items-center md:grid-cols-[60px_1fr_auto]"
              >
                <div className="w-[72px] h-[72px] md:w-[60px] md:h-[60px] rounded-[10px] bg-[#1a2434]" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{item.comic_title}</div>
                      <div className="text-[#7f8ca0] text-sm">
                        {item.episode_title}
                      </div>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-[#a7b4c7]">
                    <Meta icon="eye">{item.views.toLocaleString()}</Meta>
                    <Meta icon="heart">{item.likes.toLocaleString()}</Meta>
                    <Meta icon="time">{item.created_at}</Meta>
                  </div>
                </div>
                <Link
                  href="/creator/dashboard/analytics"
                  className="text-[#1ec069] px-3 py-2 border border-[#1ec069] rounded-[10px] font-semibold whitespace-nowrap"
                >
                  View Analytics
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Total Earnings</h3>
              <span className="text-[22px] font-bold">
                {formatCurrency(dashboardStats?.total_earnings)}
              </span>
            </div>
            <div className="text-[#1ec069] mt-2 text-sm">
              {formatDelta(dashboardStats?.total_earnings_change)}
            </div>
            <div className="mt-4 flex flex-col gap-2 bg-[#080B13] border border-[#122034] rounded-[10px] p-3 text-[14px] text-[#cdd6e2]">
              <div className="flex justify-between">
                <span>Ads Revenue</span>
                <span>$20</span>
              </div>
              <div className="flex justify-between">
                <span>Credits</span>
                <span>$200</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus</span>
                <span>$10</span>
              </div>
            </div>
          </div>

          <div className="bg-[#080B13] border border-[#122034] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <QuickAction icon="chart" label="View Analytics" />
              <QuickAction icon="book" label="Manage Comics" />
            </div>
          </div>
        </div>
      </section>
    </CreatorShell>
  );
};

export default DashboardClient;
