"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ChartDataPoint } from "@/types/simulator";
import { formatEurAxis, formatDateAxis, formatDateShort } from "@/lib/utils/formatters";
import { CHART_PERIODS, type PeriodKey } from "@/lib/constants";
import { TooltipHistorique, TooltipGainsPertres } from "./ChartTooltips";
import { RangeSlider } from "./RangeSlider";

interface PriceChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

type TabType = "historique" | "gains";

const TABS: { id: TabType; label: string }[] = [
  { id: "historique", label: "Historique" },
  { id: "gains", label: "Gains / Pertes" },
];

const LEGEND_HISTORIQUE = [
  { key: "acquis", label: "Acquis", color: "#eab308" },
  { key: "investi", label: "Investi", color: "#7c3aed" },
  { key: "prix", label: "Prix", color: "#f97316" },
  { key: "valeur", label: "Valeur", color: "#93c5fd" },
];

const LEGEND_GAINS = [
  { key: "valeur", label: "Valeur", color: "#eab308" },
  { key: "investi", label: "Investi", color: "#7c3aed" },
  { key: "prix", label: "Prix", color: "#f97316" },
  { key: "gains", label: "Gains / Pertes", color: "#22c55e" },
];

export function PriceChart({ data, symbol: _symbol }: PriceChartProps) {
  const [tab, setTab] = useState<TabType>("historique");
  const [period, setPeriod] = useState<PeriodKey>("Max");
  const [hiddenH, setHiddenH] = useState<Set<string>>(new Set());
  const [hiddenG, setHiddenG] = useState<Set<string>>(new Set());

  const hidden = tab === "historique" ? hiddenH : hiddenG;
  const toggleSeries = (key: string) => {
    const setter = tab === "historique" ? setHiddenH : setHiddenG;
    setter((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const isHidden = (key: string) => hidden.has(key);

  // Slider indices over the full dataset (already sampled to ≤300 pts for perf)
  const allSampled = data.length > 300
    ? data.filter((_, i) => i % Math.ceil(data.length / 300) === 0)
    : data;

  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(allSampled.length - 1);

  // Sync period buttons → slider
  const applyPeriod = (key: PeriodKey) => {
    setPeriod(key);
    const months = CHART_PERIODS.find((p) => p.key === key)?.months ?? null;
    if (!months || allSampled.length === 0) {
      setSliderStart(0);
      setSliderEnd(allSampled.length - 1);
      return;
    }
    const last = new Date(allSampled[allSampled.length - 1].date);
    const cutoff = new Date(last);
    cutoff.setMonth(cutoff.getMonth() - months);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const idx = allSampled.findIndex((d) => d.date >= cutoffStr);
    setSliderStart(idx >= 0 ? idx : 0);
    setSliderEnd(allSampled.length - 1);
  };

  // Sync slider → period (detect which preset matches, otherwise deselect)
  const onSliderChange = useCallback((start: number, end: number) => {
    setSliderStart(start);
    setSliderEnd(end);
    // If user drags, unpin from any period preset
    setPeriod("Max");
  }, []);

  // Reset slider when data changes
  useEffect(() => {
    setSliderStart(0);
    setSliderEnd(allSampled.length - 1);
    setPeriod("Max");
  // Intentional: reset slider only when the dataset itself changes, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);

  const safeEnd = Math.min(sliderEnd, allSampled.length - 1);
  const safeStart = Math.min(sliderStart, safeEnd);
  const sampled = allSampled.slice(safeStart, safeEnd + 1);

  const tickIndices =
    sampled.length <= 8
      ? sampled.map((_, i) => i)
      : Array.from({ length: 8 }, (_, i) => Math.round((i / 7) * (sampled.length - 1)));
  const xTicks = tickIndices.map((i) => sampled[i]?.date).filter(Boolean);

  const sampledWithGains = sampled.map((d) => ({
    ...d,
    gainsPos: d.valeur >= d.investi ? d.valeur - d.investi : null,
    gainsNeg: d.valeur < d.investi ? d.valeur - d.investi : null,
  }));

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
    yAxisId: "eur" as const,
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

  // Sparkline data: valeur over the full dataset
  const sparklineData = allSampled.map((d) => d.valeur);

  const startLabel = allSampled[safeStart] ? formatDateShort(allSampled[safeStart].date) : "";
  const endLabel = allSampled[safeEnd] ? formatDateShort(allSampled[safeEnd].date) : "";

  const isAvailable = (months: number | null) => {
    if (!months) return true;
    if (allSampled.length === 0) return false;
    const last = new Date(allSampled[allSampled.length - 1].date);
    const cutoff = new Date(last);
    cutoff.setMonth(cutoff.getMonth() - months);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return allSampled.filter((d) => d.date >= cutoffStr).length > 1;
  };

  return (
    <div>
      {/* Tabs + période */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-full text-sm font-light transition-all duration-200"
              style={{
                backgroundColor:
                  tab === t.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                color: tab === t.id ? "#ffffff" : "rgba(255,255,255,0.4)",
                border: `1px solid ${tab === t.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtres de période */}
        <div className="flex items-center gap-1">
          {CHART_PERIODS.map((p) => {
            const available = isAvailable(p.months);
            return (
              <button
                key={p.key}
                onClick={() => available && applyPeriod(p.key)}
                className="px-3 py-1 rounded-md text-xs font-light transition-all duration-150"
                style={{
                  backgroundColor:
                    period === p.key ? "rgba(255,255,255,0.12)" : "transparent",
                  color:
                    !available
                      ? "rgba(255,255,255,0.15)"
                      : period === p.key
                        ? "#ffffff"
                        : "rgba(255,255,255,0.4)",
                  cursor: available ? "pointer" : "default",
                  border: `1px solid ${period === p.key ? "rgba(255,255,255,0.2)" : "transparent"}`,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: "420px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {tab === "historique" ? (
            <AreaChart data={sampled} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradValeurH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} yAxisId="eur" />
              <YAxis
                yAxisId="tokens"
                orientation="right"
                tickFormatter={(v: number) => v.toFixed(2)}
                tick={{ fill: "#6b8bb5", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<TooltipHistorique />} />
              <Area
                yAxisId="tokens"
                type="monotone"
                dataKey="acquis"
                name="Acquis"
                stroke="#eab308"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{ r: 5, fill: "#eab308", strokeWidth: 0 }}
                hide={isHidden("acquis")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="prix"
                name="Prix"
                stroke="#f97316"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                hide={isHidden("prix")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="valeur"
                name="Valeur"
                stroke="#93c5fd"
                strokeWidth={1.5}
                fill="url(#gradValeurH)"
                dot={false}
                activeDot={{ r: 4, fill: "#93c5fd", strokeWidth: 0 }}
                hide={isHidden("valeur")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="investi"
                name="Investi"
                stroke="#7c3aed"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                hide={isHidden("investi")}
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
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="gainsPos"
                name="Gains / Pertes"
                stroke="#22c55e"
                strokeWidth={0}
                fill="url(#gradGainsPos)"
                dot={false}
                connectNulls={false}
                legendType="none"
                hide={isHidden("gains")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="gainsNeg"
                name="Gains / Pertes"
                stroke="#ef4444"
                strokeWidth={0}
                fill="url(#gradGainsNeg)"
                dot={false}
                connectNulls={false}
                legendType="none"
                hide={isHidden("gains")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="valeur"
                name="Valeur"
                stroke="#eab308"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{ r: 5, fill: "#eab308", strokeWidth: 0 }}
                hide={isHidden("valeur")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="investi"
                name="Investi"
                stroke="#7c3aed"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                hide={isHidden("investi")}
              />
              <Area
                yAxisId="eur"
                type="monotone"
                dataKey="prix"
                name="Prix"
                stroke="#f97316"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                hide={isHidden("prix")}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Range slider */}
      {allSampled.length > 1 && (
        <RangeSlider
          total={allSampled.length}
          startIndex={safeStart}
          endIndex={safeEnd}
          onChange={onSliderChange}
          sparklineData={sparklineData}
          startLabel={startLabel}
          endLabel={endLabel}
        />
      )}

      {/* Legend — cliquable pour masquer/afficher */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-5">
        {(tab === "historique" ? LEGEND_HISTORIQUE : LEGEND_GAINS).map((item) => {
          const off = isHidden(item.key);
          return (
            <button
              key={item.key}
              onClick={() => toggleSeries(item.key)}
              className="flex items-center gap-2 transition-opacity duration-150"
              style={{ opacity: off ? 0.35 : 1, cursor: "pointer" }}
              title={off ? `Afficher ${item.label}` : `Masquer ${item.label}`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 transition-all duration-150"
                style={{
                  backgroundColor: off ? "rgba(255,255,255,0.15)" : item.color,
                  boxShadow: off ? "none" : `0 0 6px ${item.color}88`,
                }}
              />
              <span
                className="text-xs font-light transition-all duration-150"
                style={{
                  color: off ? "rgba(255,255,255,0.25)" : "#6b8bb5",
                  textDecoration: off ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
