"use client";

import { Wallet, PiggyBank, Coins, CircleDollarSign, DollarSign, Percent } from "lucide-react";
import type { SimulationResult } from "@/types/simulator";
import type { Frequency } from "@/types/simulator";

interface ResultsPanelProps {
  result: SimulationResult | null;
  symbol: string;
  frequency?: Frequency;
  amount?: number;
  isLoading: boolean;
  error: string | null;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTokens(value: number): string {
  if (value < 0.0001) return value.toExponential(4);
  return value.toFixed(8);
}

function frequencyLabel(freq: Frequency): string {
  switch (freq) {
    case "one-shot":
      return "en 1 fois";
    case "daily":
      return "/ jour";
    case "weekly":
      return "/ semaine";
    case "monthly":
      return "/ mois";
  }
}

export function ResultsPanel({
  result,
  symbol,
  frequency,
  amount,
  isLoading,
  error,
}: ResultsPanelProps) {
  const isPositive = result ? result.gainLoss >= 0 : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-light" style={{ color: "#7899ce" }}>
          Calcul en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{ backgroundColor: "#1a1010", color: "#ef4444", border: "1px solid #7f1d1d" }}
      >
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

  const performanceColor = isPositive ? "#22c55e" : "#ef4444";

  const rows = [
    {
      icon: <PiggyBank size={28} strokeWidth={1.5} style={{ color: "#7899ce" }} />,
      label: "Investi",
      value: (
        <span className="tabular-nums break-all">
          {formatEur(amount ?? result.totalInvested)}{" "}
          {frequency && (
            <span className="font-light" style={{ color: "#7899ce" }}>
              {frequencyLabel(frequency)}
            </span>
          )}
        </span>
      ),
    },
    {
      icon: <Coins size={28} strokeWidth={1.5} style={{ color: "#7899ce" }} />,
      label: "Acquis",
      value: (
        <span className="tabular-nums break-all">
          {formatTokens(result.tokensAcquired)}{" "}
          <span className="font-light" style={{ color: "#7899ce" }}>
            {symbol}
          </span>
        </span>
      ),
    },
    {
      icon: <CircleDollarSign size={28} strokeWidth={1.5} style={{ color: "#7899ce" }} />,
      label: "Prix moyen d'acquisition",
      value: <span className="tabular-nums break-all">{formatEur(result.averageBuyPrice)}</span>,
    },
    {
      icon: <DollarSign size={28} strokeWidth={1.5} style={{ color: "#7899ce" }} />,
      label: "Capital final",
      value: <span className="tabular-nums break-all">{formatEur(result.finalValue)}</span>,
    },
    {
      icon: <Percent size={28} strokeWidth={1.5} style={{ color: "#7899ce" }} />,
      label: "Performance",
      value: (
        <span className="tabular-nums break-all" style={{ color: performanceColor }}>
          {isPositive ? "+" : ""}
          {result.gainLossPercent.toFixed(2)} %
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-t-2xl"
        style={{ backgroundColor: "#1098F7" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-white font-normal text-base">Chiffres clés</h3>
      </div>

      {/* Rows */}
      <div
        className="rounded-b-2xl divide-y"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "none",
        }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-5 py-5"
            style={{
              borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div className="shrink-0">{row.icon}</div>
            <div className="flex flex-col items-end text-right min-w-0">
              <span className="text-sm font-light mb-0.5" style={{ color: "#7899ce" }}>
                {row.label}
              </span>
              <span className="text-white font-bold text-lg leading-tight">{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
