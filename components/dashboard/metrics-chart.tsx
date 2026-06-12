"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact } from "@/lib/utils";

type MetricPoint = {
  date: string | Date;
  impressions: number;
  clicks: number;
  views: number;
  spend: number;
};

export function MetricsChart({ metrics }: { metrics: MetricPoint[] }) {
  const data = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    Impressions: m.impressions,
    Clicks: m.clicks,
    Views: m.views,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="imp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.62 0.25 295)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="oklch(0.62 0.25 295)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="clk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.7 0.15 195)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="oklch(0.7 0.15 195)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.025 285)" vertical={false} />
        <XAxis dataKey="date" stroke="oklch(0.68 0.02 285)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="oklch(0.68 0.02 285)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.17 0.02 285)",
            border: "1px solid oklch(0.27 0.025 285)",
            borderRadius: "0.75rem",
            fontSize: "0.8rem",
          }}
          labelStyle={{ color: "oklch(0.97 0.005 285)" }}
        />
        <Area type="monotone" dataKey="Impressions" stroke="oklch(0.62 0.25 295)" strokeWidth={2} fill="url(#imp)" />
        <Area type="monotone" dataKey="Clicks" stroke="oklch(0.7 0.15 195)" strokeWidth={2} fill="url(#clk)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
