"use client";

import { Wallet } from "lucide-react";
import type { SimulationResult } from "@/types/simulator";
import type { Frequency } from "@/types/simulator";
import { formatEur, formatTokens } from "@/lib/utils/formatters";

interface ResultsPanelProps {
  result: SimulationResult | null;
  symbol: string;
  frequency?: Frequency;
  amount?: number;
  isLoading: boolean;
  error: string | null;
}

function formatTokensLocal(value: number): string {
  if (value < 0.0001) return value.toExponential(4);
  return formatTokens(value);
}

function frequencyLabel(freq: Frequency): string {
  switch (freq) {
    case "one-shot": return "en 1 fois";
    case "daily": return "/ jour";
    case "weekly": return "/ semaine";
    case "monthly": return "/ mois";
  }
}

export function ResultsPanel({ result, symbol, frequency, amount, isLoading, error }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-light" style={{ color: "#7899ce" }}>Calcul en cours…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#1a1010", color: "#ef4444", border: "1px solid #7f1d1d" }}>
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
        <Wallet size={40} style={{ color: "#7899ce" }} />
        <p className="text-sm text-center" style={{ color: "#7899ce" }}>
          Modifiez les paramètres pour voir vos résultats
        </p>
      </div>
    );
  }

  const isGain = result.gainLoss >= 0;
  const gainColor = isGain ? "#22c55e" : "#ef4444";
  const investedPct = Math.round((result.totalInvested / result.finalValue) * 100);
  const gainPct = 100 - investedPct;

  return (
    <div className="flex flex-col gap-3">

      {/* Capital final — card principale */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs font-light mb-2" style={{ color: "#7899ce" }}>Capital final</p>
        <p className="text-3xl font-light mb-3 tabular-nums" style={{ letterSpacing: -1 }}>
          {result.finalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-base ml-2" style={{ color: "#7899ce" }}>EUR</span>
        </p>
        <div className="flex gap-4 mb-3 flex-wrap">
          <span className="text-xs">
            <span style={{ color: "#1098F7" }}>Somme investie </span>
            <span className="font-medium text-white">
              {formatEur(amount ?? result.totalInvested)}
              {frequency && frequency !== "one-shot" && (
                <span className="font-light" style={{ color: "#7899ce" }}> {frequencyLabel(frequency)}</span>
              )}
            </span>
          </span>
          <span className="text-xs">
            <span style={{ color: gainColor }}>{isGain ? "Gains " : "Pertes "}</span>
            <span className="font-medium text-white">{formatEur(result.gainLoss)}</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1a2744" }}>
          <div className="flex h-full">
            <div style={{ width: `${Math.max(0, Math.min(100, investedPct))}%`, backgroundColor: "#1098F7" }} />
            <div style={{ width: `${Math.max(0, Math.min(100, gainPct))}%`, backgroundColor: gainColor }} />
          </div>
        </div>
      </div>

      {/* Performance + Tokens — ligne */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-3" style={{ color: "#7899ce" }}>Performance</p>
          <p className="text-3xl font-light tabular-nums" style={{ color: gainColor }}>
            {isGain ? "+" : ""}{result.gainLossPercent.toFixed(1)}
            <span className="text-lg">%</span>
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-3" style={{ color: "#7899ce" }}>Tokens acquis</p>
          <p className="text-2xl font-light tabular-nums text-white break-all">
            {formatTokensLocal(result.tokensAcquired)}
            <span className="text-sm ml-1" style={{ color: "#7899ce" }}>{symbol}</span>
          </p>
        </div>
      </div>

      {/* Prix moyen + Part gains — ligne */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-3" style={{ color: "#7899ce" }}>Prix moyen d&apos;achat</p>
          <p className="text-xl font-light tabular-nums text-white break-all">
            {formatEur(result.averageBuyPrice)}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-3" style={{ color: "#7899ce" }}>Part {isGain ? "des gains" : "des pertes"}</p>
          <p className="text-3xl font-light tabular-nums" style={{ color: isGain ? "#ffffff" : gainColor }}>
            {Math.abs(gainPct)}<span className="text-lg">%</span>
          </p>
        </div>
      </div>

    </div>
  );
}
