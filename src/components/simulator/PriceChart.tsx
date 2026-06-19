"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import type { ChartDataPoint } from "@/types/simulator";

interface PriceChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

function formatEurAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} k€`;
  return `${value.toFixed(0)} €`;
}

function formatEurFull(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateAxis(dateStr: string, data: { date: string }[]): string {
  const first = new Date(data[0]?.date ?? dateStr);
  const last = new Date(data[data.length - 1]?.date ?? dateStr);
  const spanMonths =
    (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth());
  const d = new Date(dateStr);
  if (spanMonths <= 18) {
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  }
  return d.getFullYear().toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const dateLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return (
    <div
      className="rounded-xl px-4 py-3 text-xs shadow-xl border"
      style={{
        backgroundColor: "#0d1525",
        borderColor: "rgba(255,255,255,0.15)",
        color: "#fff",
        minWidth: 220,
      }}
    >
      <p className="font-semibold mb-2 text-sm capitalize">{dateLabel}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <div key={entry.name} className="flex justify-between gap-6 mb-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{entry.name}:</span>
          </span>
          <span className="font-medium">{formatEurFull(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

const LEGEND = [
  { key: "valeur", label: "Capital final", color: "#2563eb" },
  { key: "gains", label: "Intérêts gagnés", color: "#eab308" },
  { key: "investi", label: "Somme investie", color: "#6b8bb5" },
];

type ChartType = "area" | "bar" | "pie";

const CHART_ICONS: { type: ChartType }[] = [{ type: "area" }, { type: "bar" }, { type: "pie" }];

function AreaIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: active ? "#fff" : "rgba(255,255,255,0.25)" }}
    >
      <path
        d="M3 12.5C3 8.27 3 6.14 4.32 4.83C5.64 3.51 7.76 3.51 12 3.51C16.24 3.51 18.36 3.51 19.68 4.83C21 6.14 21 8.27 21 12.51C21 16.75 21 18.87 19.68 20.19C18.36 21.51 16.24 21.51 12 21.51C7.76 21.51 5.64 21.51 4.32 20.19C3 18.87 3 16.75 3 12.51Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.44 7.51L17.19 7.51C17.19 8.39 17.11 9.46 16.95 10.48C16.79 11.49 16.54 12.51 16.15 13.29C15.79 14.01 15.14 14.85 14.08 14.75C13.6 14.7 13.16 14.45 12.76 14.1C12.36 13.74 11.96 13.24 11.55 12.59L12.18 12.19L12.81 11.79C13.18 12.37 13.49 12.74 13.75 12.97C14.01 13.21 14.17 13.25 14.23 13.26C14.27 13.26 14.49 13.26 14.8 12.62C15.09 12.04 15.32 11.19 15.47 10.24C15.62 9.3 15.69 8.32 15.69 7.51L16.44 7.51ZM12.18 12.19L11.55 12.59C11.18 12.01 10.9 11.74 10.73 11.62C10.64 11.57 10.61 11.56 10.6 11.56C10.6 11.56 10.6 11.56 10.61 11.56C10.31 11.58 10.19 11.67 10 11.96C9.82 12.24 9.65 12.6 9.46 13.04C9.1 13.88 8.7 15.03 8.25 15.89C8.01 16.34 7.74 16.78 7.4 17.11C7.05 17.45 6.58 17.73 6 17.73L6 16.98L6 16.23C6.07 16.23 6.17 16.21 6.34 16.04C6.52 15.87 6.71 15.59 6.92 15.2C7.33 14.4 7.66 13.44 8.08 12.46C8.27 12 8.49 11.53 8.73 11.15C8.97 10.78 9.29 10.39 9.75 10.19C10.27 9.96 10.82 10.05 11.3 10.37C11.74 10.66 12.15 11.15 12.56 11.79L12.18 12.19Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: active ? "#fff" : "rgba(255,255,255,0.25)" }}
    >
      <path
        d="M7.26 17.25L7.26 13.46M12 17.25L12 7.77M16.74 17.25L16.74 11.56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3 12.51C3 8.27 3 6.14 4.32 4.83C5.64 3.51 7.76 3.51 12 3.51C16.24 3.51 18.36 3.51 19.68 4.83C21 6.14 21 8.27 21 12.51C21 16.75 21 18.87 19.68 20.19C18.36 21.51 16.24 21.51 12 21.51C7.76 21.51 5.64 21.51 4.32 20.19C3 18.87 3 16.75 3 12.51Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PieIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: active ? "#fff" : "rgba(255,255,255,0.25)" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function PriceChart({ data, symbol: _symbol }: PriceChartProps) {
  const [chartType, setChartType] = useState<ChartType>("area");

  const sampled =
    data.length > 120 ? data.filter((_, i) => i % Math.ceil(data.length / 120) === 0) : data;

  // Pick ~8 evenly-spaced tick indices
  const tickIndices =
    sampled.length <= 8
      ? sampled.map((_, i) => i)
      : Array.from({ length: 8 }, (_, i) => Math.round((i / 7) * (sampled.length - 1)));
  const xTicks = tickIndices.map((i) => sampled[i]?.date).filter(Boolean);

  const commonAxisProps = {
    tick: { fill: "#6b8bb5", fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  };

  return (
    <div>
      {/* Type de graphique */}
      <div className="flex items-center justify-center gap-x-3 mb-6">
        <p className="font-light text-sm pr-1" style={{ color: "#7899ce" }}>
          Type de graphique
        </p>
        {CHART_ICONS.map(({ type }) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200"
            style={{
              borderColor: chartType === type ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)",
              backgroundColor:
                chartType === type ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
            }}
          >
            {type === "area" && <AreaIcon active={chartType === "area"} />}
            {type === "bar" && <BarIcon active={chartType === "bar"} />}
            {type === "pie" && <PieIcon active={chartType === "pie"} />}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: "520px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={[
                  { name: "Somme investie", value: data[data.length - 1]?.investi ?? 0 },
                  {
                    name: "Intérêts gagnés",
                    value: Math.max(data[data.length - 1]?.gains ?? 0, 0),
                  },
                ]}
                cx="50%"
                cy="50%"
                innerRadius="38%"
                outerRadius="62%"
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#2563eb" fillOpacity={0.9} />
                <Cell fill="#eab308" fillOpacity={0.9} />
                <Label
                  value={formatEurFull(data[data.length - 1]?.valeur ?? 0)}
                  position="center"
                  fill="#ffffff"
                  fontSize={18}
                  fontWeight={400}
                />
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  typeof value === "number" ? formatEurFull(value) : value,
                ]}
                contentStyle={{
                  backgroundColor: "#0d1525",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 12,
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          ) : chartType === "area" ? (
            <AreaChart data={sampled} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradValeur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradGains" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradInvesti" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b8bb5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6b8bb5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={(v) => formatDateAxis(v, sampled)}
                {...commonAxisProps}
                label={{
                  value: "Années",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#6b8bb5",
                  fontSize: 11,
                }}
              />
              <YAxis
                tickFormatter={formatEurAxis}
                {...commonAxisProps}
                width={80}
                label={{
                  value: "Montant €",
                  angle: -90,
                  position: "insideLeft",
                  offset: 16,
                  fill: "#6b8bb5",
                  fontSize: 11,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="valeur"
                name="Capital final"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#gradValeur)"
                dot={false}
                activeDot={{ r: 6, fill: "#2563eb", strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="gains"
                name="Intérêts gagnés"
                stroke="#eab308"
                strokeWidth={1.5}
                fill="url(#gradGains)"
                dot={false}
                activeDot={{ r: 5, fill: "#eab308", strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="investi"
                name="Somme investie"
                stroke="#6b8bb5"
                strokeWidth={1.5}
                fill="url(#gradInvesti)"
                dot={false}
                activeDot={{ r: 5, fill: "#6b8bb5", strokeWidth: 0 }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={sampled}
              margin={{ top: 8, right: 8, left: 0, bottom: 20 }}
              barSize={sampled.length > 60 ? 6 : sampled.length > 30 ? 10 : 16}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={(v) => formatDateAxis(v, sampled)}
                {...commonAxisProps}
                label={{
                  value: "Années",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#6b8bb5",
                  fontSize: 11,
                }}
              />
              <YAxis
                tickFormatter={formatEurAxis}
                {...commonAxisProps}
                width={80}
                label={{
                  value: "Montant €",
                  angle: -90,
                  position: "insideLeft",
                  offset: 16,
                  fill: "#6b8bb5",
                  fontSize: 11,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="investi"
                name="Somme investie"
                stackId="a"
                fill="#2563eb"
                fillOpacity={0.9}
              />
              <Bar
                dataKey="gains"
                name="Intérêts gagnés"
                stackId="a"
                fill="#eab308"
                fillOpacity={0.9}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-x-6 mt-4">
        {(chartType === "pie" ? LEGEND.filter((i) => i.key !== "valeur") : LEGEND).map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-light" style={{ color: "#6b8bb5" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
