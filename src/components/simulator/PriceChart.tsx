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
  ReferenceLine,
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
function TooltipHistorique({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const dateLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const order = ["prix", "valeur", "investi"];
  const sorted = [...payload].sort((a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey));

  return (
    <div
      className="rounded-xl px-4 py-3 text-xs shadow-xl border"
      style={{
        backgroundColor: "#0d1525",
        borderColor: "rgba(255,255,255,0.15)",
        color: "#fff",
        minWidth: 200,
      }}
    >
      <p className="font-semibold mb-2 text-sm capitalize">{dateLabel}</p>
      {sorted.map((entry: { name: string; value: number; color: string; dataKey: string }) => (
        <div key={entry.dataKey} className="flex justify-between gap-6 mb-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{entry.name} :</span>
          </span>
          <span className="font-medium">{formatEurFull(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TooltipGainsPertres({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const dateLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const order = ["valeur", "gainsNet", "investi", "prix"];
  const sorted = [...payload].sort((a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey));

  return (
    <div
      className="rounded-xl px-4 py-3 text-xs shadow-xl border"
      style={{
        backgroundColor: "#0d1525",
        borderColor: "rgba(255,255,255,0.15)",
        color: "#fff",
        minWidth: 200,
      }}
    >
      <p className="font-semibold mb-2 text-sm capitalize">{dateLabel}</p>
      {sorted.map((entry: { name: string; value: number; color: string; dataKey: string }) => (
        <div key={entry.dataKey} className="flex justify-between gap-6 mb-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{entry.name} :</span>
          </span>
          <span className="font-medium">{formatEurFull(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

type TabType = "historique" | "gains";

const TABS: { id: TabType; label: string }[] = [
  { id: "historique", label: "Historique" },
  { id: "gains", label: "Gains / Pertes" },
];

const LEGEND_HISTORIQUE = [
  { key: "prix", label: "Prix du token", color: "#f97316" },
  { key: "valeur", label: "Valeur du portefeuille", color: "#2563eb" },
  { key: "investi", label: "Somme investie", color: "#7c3aed" },
];

const LEGEND_GAINS = [
  { key: "valeur", label: "Valeur", color: "#eab308" },
  { key: "gains-pos", label: "Gains", color: "#22c55e" },
  { key: "gains-neg", label: "Pertes", color: "#ef4444" },
  { key: "investi", label: "Investi", color: "#7c3aed" },
];

export function PriceChart({ data, symbol: _symbol }: PriceChartProps) {
  const [tab, setTab] = useState<TabType>("historique");

  const sampled =
    data.length > 120 ? data.filter((_, i) => i % Math.ceil(data.length / 120) === 0) : data;

  const tickIndices =
    sampled.length <= 8
      ? sampled.map((_, i) => i)
      : Array.from({ length: 8 }, (_, i) => Math.round((i / 7) * (sampled.length - 1)));
  const xTicks = tickIndices.map((i) => sampled[i]?.date).filter(Boolean);

  // For gains/pertes chart: gainsNet = valeur - investi (can be negative)
  const sampledWithGains = sampled.map((d) => ({
    ...d,
    gainsNet: d.valeur - d.investi,
    gainsPos: d.valeur >= d.investi ? d.valeur - d.investi : null,
    gainsNeg: d.valeur < d.investi ? d.valeur - d.investi : null,
  }));

  const lastPoint = sampled[sampled.length - 1];
  const investiRef = lastPoint?.investi ?? 0;

  const commonAxisProps = {
    tick: { fill: "#6b8bb5", fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  };

  const xAxisProps = {
    dataKey: "date",
    ticks: xTicks,
    tickFormatter: (v: string) => formatDateAxis(v, sampled),
    ...commonAxisProps,
    label: {
      value: "Années",
      position: "insideBottom" as const,
      offset: -10,
      fill: "#6b8bb5",
      fontSize: 11,
    },
  };

  const yAxisProps = {
    tickFormatter: formatEurAxis,
    ...commonAxisProps,
    width: 80,
    label: {
      value: "Montant €",
      angle: -90,
      position: "insideLeft" as const,
      offset: 16,
      fill: "#6b8bb5",
      fontSize: 11,
    },
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-1.5 rounded-full text-sm font-light transition-all duration-200"
            style={{
              backgroundColor: tab === t.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: `1px solid ${tab === t.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: "440px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {tab === "historique" ? (
            <AreaChart data={sampled} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradValeurH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip content={<TooltipHistorique />} />
              {/* Valeur — blue area */}
              <Area
                type="monotone"
                dataKey="valeur"
                name="Valeur portefeuille"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#gradValeurH)"
                dot={false}
                activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
              />
              {/* Investi — purple line, no fill */}
              <Area
                type="monotone"
                dataKey="investi"
                name="Somme investie"
                stroke="#7c3aed"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
              />
              {/* Prix — orange line, no fill */}
              <Area
                type="monotone"
                dataKey="prix"
                name="Prix du token"
                stroke="#f97316"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
              />
            </AreaChart>
          ) : (
            <AreaChart data={sampledWithGains} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradGainsPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="gradGainsNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.03} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip content={<TooltipGainsPertres />} />
              {/* Gains positifs — green area above 0 */}
              <Area
                type="monotone"
                dataKey="gainsPos"
                name="Gains"
                stroke="#22c55e"
                strokeWidth={0}
                fill="url(#gradGainsPos)"
                dot={false}
                connectNulls={false}
                legendType="none"
              />
              {/* Gains négatifs — red area below 0 */}
              <Area
                type="monotone"
                dataKey="gainsNeg"
                name="Pertes"
                stroke="#ef4444"
                strokeWidth={0}
                fill="url(#gradGainsNeg)"
                dot={false}
                connectNulls={false}
                legendType="none"
              />
              {/* Valeur — yellow line */}
              <Area
                type="monotone"
                dataKey="gainsNet"
                name="Gains / Pertes nets"
                stroke="#eab308"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{ r: 5, fill: "#eab308", strokeWidth: 0 }}
              />
              {/* Investi — horizontal reference line at 0 after removing investi from axis */}
              <ReferenceLine y={0} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 3" />
              {/* Prix — secondary reference, shown as faint line */}
              <Area
                type="monotone"
                dataKey="prix"
                name="Prix du token"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                fill="none"
                dot={false}
                activeDot={{ r: 3, fill: "rgba(255,255,255,0.4)", strokeWidth: 0 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4">
        {(tab === "historique" ? LEGEND_HISTORIQUE : LEGEND_GAINS).map((item) => (
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
