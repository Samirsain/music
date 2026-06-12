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
            <stop offset="5%" stopColor="oklch(0.5 0.23 293)" stopOpacity={0.18} />
            <stop offset="95%" stopColor="oklch(0.5 0.23 293)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="clk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.55 0.13 220)" stopOpacity={0.18} />
            <stop offset="95%" stopColor="oklch(0.55 0.13 220)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 285)" vertical={false} />
        <XAxis dataKey="date" stroke="oklch(0.55 0.012 285)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="oklch(0.55 0.012 285)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid oklch(0.92 0.004 285)",
            borderRadius: "0.625rem",
            fontSize: "0.8rem",
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.06)",
          }}
          labelStyle={{ color: "oklch(0.175 0.01 285)", fontWeight: 500 }}
        />
        <Area type="monotone" dataKey="Impressions" stroke="oklch(0.5 0.23 293)" strokeWidth={2} fill="url(#imp)" />
        <Area type="monotone" dataKey="Clicks" stroke="oklch(0.55 0.13 220)" strokeWidth={2} fill="url(#clk)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
