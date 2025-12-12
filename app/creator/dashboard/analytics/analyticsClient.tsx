"use client";

import CreatorShell from "../_components/CreatorShell";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Rectangle,
} from "recharts";

const AnalyticsClient = () => {
  const adsRevenueData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 49 },
    { month: "Apr", value: 60 },
    { month: "May", value: 55 },
    { month: "Jun", value: 58 },
  ];

  const creditsRevenueData = [
    { month: "Jan", value: 32 },
    { month: "Feb", value: 36 },
    { month: "Mar", value: 34 },
    { month: "Apr", value: 30 },
    { month: "May", value: 42 },
    { month: "Jun", value: 38 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f1b28] border border-[#122034] rounded-lg px-3 py-2 text-sm">
          <div className="text-[#f5f7fb]">{label}</div>
          <div className="text-[#1ec069]">
            {payload[0].name === "adsRevenue"
              ? `Ads Revenue: $${payload[0].value}`
              : `Credits Revenue: $${payload[0].value}`}
          </div>
        </div>
      );
    }
    return null;
  };

  const OutlinedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const radius = 6;
    return (
      <path
        d={`M ${x} ${y + height} L ${x} ${y + radius} Q ${x} ${y} ${
          x + radius
        } ${y} L ${x + width - radius} ${y} Q ${x + width} ${y} ${x + width} ${
          y + radius
        } L ${x + width} ${y + height} Z`}
        fill="transparent"
        stroke="#1ec069"
        strokeWidth={2}
      />
    );
  };

  return (
    <CreatorShell activeNav="analytics">
      <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight">Analytics</h1>
          <p className="text-[#7f8ca0] mt-1">
            Track your ToonC_NG comic performance and audience engagement
          </p>
        </div>
        <button className="bg-[#0f1b28] border border-[#122034] text-[#f5f7fb] rounded-[10px] px-4 py-3 font-semibold flex items-center gap-2">
          Last 28 days
          <span className="text-[#7f8ca0]">▼</span>
        </button>
      </section>

      <section className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[15px] font-semibold">
          <span className="text-[#1ec069]">▣</span>
          Select Comic Series
        </div>
        <p className="text-[#7f8ca0] text-sm">
          Choose a comic to view detailed analytics
        </p>
        <button className="bg-[#0f1b28] border border-[#122034] text-[#f5f7fb] rounded-[10px] px-4 py-3 flex items-center justify-between">
          Shadow Realm Chronicles
          <span className="text-[#7f8ca0]">⌄</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="bg-[#0f1b28] text-[#cdd6e2] border border-[#122034] rounded-[8px] px-3 py-2 text-sm">
            Overview
          </button>
          <button className="bg-[#1ec069] text-[#03150b] rounded-[8px] px-3 py-2 text-sm font-semibold">
            Earnings
          </button>
        </div>
      </section>

      <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <MetricCard title="Total Earnings" value="₦124,850" delta="+12.5%" />
        <MetricCard title="Ads Revenue" value="₦78,450" delta="+2.1%" />
        <MetricCard title="Credits Revenue" value="₦46,400" delta="+2.1%" />
      </section>

      <section className="grid gap-4">
        <div className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <h3 className="font-semibold">Ads Revenue</h3>
          <p className="text-[#7f8ca0] text-sm mb-4">Monthly trend</p>
          <div className="h-[440px] rounded-[12px] bg-gradient-to-b from-[#0f1622] to-[#050b12] border border-[#122034] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={adsRevenueData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1ec069" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1ec069" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#122034"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#7f8ca0", fontSize: 12 }}
                  axisLine={{ stroke: "#122034" }}
                  tickLine={{ stroke: "#122034" }}
                />
                <YAxis
                  tick={{ fill: "#7f8ca0", fontSize: 12 }}
                  axisLine={{ stroke: "#122034" }}
                  tickLine={{ stroke: "#122034" }}
                  domain={[0, "dataMax + 10"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="adsRevenue"
                  stroke="#1ec069"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  dot={{ fill: "#1ec069", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#1ec069", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <h3 className="font-semibold">Credits Revenue</h3>
          <p className="text-[#7f8ca0] text-sm mb-4">Monthly trend</p>
          <div className="h-[440px] rounded-[12px] bg-gradient-to-b from-[#0f1622] to-[#050b12] border border-[#122034] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={creditsRevenueData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#122034"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#7f8ca0", fontSize: 12 }}
                  axisLine={{ stroke: "#122034" }}
                  tickLine={{ stroke: "#122034" }}
                />
                <YAxis
                  tick={{ fill: "#7f8ca0", fontSize: 12 }}
                  axisLine={{ stroke: "#122034" }}
                  tickLine={{ stroke: "#122034" }}
                  domain={[0, "dataMax + 10"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name="creditsRevenue"
                  fill="#3AE478"
                  barSize={30}
                  radius={[3, 3, 0, 0]}
                  activeBar={<Rectangle fill="#082816" />}
                >
                  {creditsRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </CreatorShell>
  );
};

const MetricCard = ({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: string;
}) => (
  <div className="bg-[#080B13] border border-[#0f1b28] rounded-[14px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] flex flex-col gap-1">
    <div className="flex items-center gap-2 text-sm text-[#a7b4c7]">
      <span className="text-[#7f8ca0]">⧖</span>
      {title}
    </div>
    <div className="text-[26px] font-bold leading-tight">{value}</div>
    <div className="text-[#1ec069] text-[13px] font-semibold">
      {delta} from last month
    </div>
    <p className="text-[#7f8ca0] text-[12px]">
      Monthly earnings from your content
    </p>
  </div>
);

export default AnalyticsClient;
