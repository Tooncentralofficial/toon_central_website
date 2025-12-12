"use client";

import { useMemo } from "react";
import Link from "next/link";
import StatusPill from "./_components/StatusPill";
import Meta from "./_components/Meta";
import QuickAction from "./_components/QuickAction";
import { StatIcon } from "./_components/Icons";
import CreatorShell from "./_components/CreatorShell";

type Stat = {
  label: string;
  value: string;
  delta: string;
};

type PerformanceItem = {
  title: string;
  episode: string;
  status: "Published" | "Scheduled";
  views: number;
  likes: number;
  comments: number;
  time: string;
};

const DashboardClient = () => {
  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Total Views",
        value: "156,847",
        delta: "+12.5% from last month",
      },
      { label: "Subscribers", value: "8,429", delta: "+5.2% from last month" },
      { label: "Total Likes", value: "24,891", delta: "+8.1% from last month" },
      {
        label: "Total Earnings",
        value: "$2,847",
        delta: "+15.3% from last month",
      },
    ],
    []
  );

  const performance: PerformanceItem[] = useMemo(
    () => [
      {
        title: "Shadow ...",
        episode: "Episode 15",
        status: "Published",
        views: 12500,
        likes: 890,
        comments: 800,
        time: "2 days ago",
      },
      {
        title: "Cyber Ni...",
        episode: "Episode 8",
        status: "Published",
        views: 8200,
        likes: 654,
        comments: 700,
        time: "5 days ago",
      },
      {
        title: "Magic A...",
        episode: "Episode 22",
        status: "Scheduled",
        views: 15600,
        likes: 1200,
        comments: 1200,
        time: "Tomorrow",
      },
    ],
    []
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
            {performance.map((item) => (
              <div
                key={item.title}
                className="bg-[#05060C] border border-[#122034] rounded-[12px] p-3 grid grid-cols-[72px_1fr_auto] gap-3 items-center md:grid-cols-[60px_1fr_auto]"
              >
                <div className="w-[72px] h-[72px] md:w-[60px] md:h-[60px] rounded-[10px] bg-[#1a2434]" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-[#7f8ca0] text-sm">
                        {item.episode}
                      </div>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-[#a7b4c7]">
                    <Meta icon="eye">{item.views.toLocaleString()}</Meta>
                    <Meta icon="heart">{item.likes.toLocaleString()}</Meta>
                    <Meta icon="comment">{item.comments.toLocaleString()}</Meta>
                    <Meta icon="time">{item.time}</Meta>
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
              <span className="text-[22px] font-bold">$2,847</span>
            </div>
            <div className="text-[#1ec069] mt-2 text-sm">
              +15.3% from last month
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
