"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { ChartDataPoint } from "@/types/simulator";

interface PriceChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

function formatEur(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k€`;
  return `${value.toFixed(2)}€`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "short",
    year: "2-digit",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg border"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      <p className="font-semibold mb-1" style={{ color: "var(--color-text-secondary)" }}>
        {new Date(label).toLocaleDateString("fr-FR")}
      </p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name} : {formatEur(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function PriceChart({ data, symbol }: PriceChartProps) {
  // Sample data for performance (max 200 points)
  const sampled =
    data.length > 200 ? data.filter((_, i) => i % Math.ceil(data.length / 200) === 0) : data;

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampled} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradValeur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradInvesti" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b8bb5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6b8bb5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3b" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "#6b8bb5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatEur}
            tick={{ fill: "#6b8bb5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#6b8bb5", paddingTop: 8 }}
            formatter={(value: string) => <span style={{ color: "#6b8bb5" }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="valeur"
            name={`Valeur ${symbol} (€)`}
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#gradValeur)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="investi"
            name="Investi (€)"
            stroke="#6b8bb5"
            strokeWidth={2}
            fill="url(#gradInvesti)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
