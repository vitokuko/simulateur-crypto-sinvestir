"use client";

import { Wallet } from "lucide-react";
import { PriceChart } from "./PriceChart";
import type { SimulationResult } from "@/types/simulator";

interface ResultsPanelProps {
  result: SimulationResult | null;
  symbol: string;
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
  return value.toFixed(6);
}

function KpiBig({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold tabular-nums"
        style={{ color: color ?? "var(--color-text-primary)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function ResultsPanel({ result, symbol, isLoading, error }: ResultsPanelProps) {
  const isPositive = result ? result.gainLoss >= 0 : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Calcul en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          backgroundColor: "#1a1010",
          color: "var(--color-danger)",
          border: "1px solid #7f1d1d",
        }}
      >
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
        <Wallet size={40} style={{ color: "var(--color-text-muted)" }} />
        <p className="text-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
          Modifiez les paramètres pour voir vos résultats
        </p>
      </div>
    );
  }

  const investedPct =
    result.finalValue > 0 ? Math.min((result.totalInvested / result.finalValue) * 100, 100) : 100;
  const gainPct = Math.max(100 - investedPct, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
        Vos résultats
      </h2>

      {/* Main KPI card */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
        <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>
          Valeur finale
        </p>
        <p
          className="text-3xl font-bold tabular-nums mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {formatEur(result.finalValue)}
        </p>
        <div className="flex flex-wrap gap-4 text-xs mb-4">
          <span style={{ color: "var(--color-accent)" }}>
            Investi {formatEur(result.totalInvested)}
          </span>
          <span style={{ color: isPositive ? "var(--color-success)" : "var(--color-danger)" }}>
            {isPositive ? "+" : ""}
            {formatEur(result.gainLoss)} ({isPositive ? "+" : ""}
            {result.gainLossPercent.toFixed(2)}%)
          </span>
        </div>
        {/* Progress bar */}
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-input)" }}
        >
          <div className="flex h-full">
            <div
              className="h-full"
              style={{ width: `${investedPct}%`, backgroundColor: "var(--color-accent)" }}
            />
            <div
              className="h-full"
              style={{
                width: `${gainPct}%`,
                backgroundColor: isPositive ? "#c9a227" : "var(--color-danger)",
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <KpiBig label="Montant investi" value={formatEur(result.totalInvested)} />
        <KpiBig
          label="Plus/Moins-value"
          value={`${isPositive ? "+" : ""}${result.gainLossPercent.toFixed(2)} %`}
          sub={`${isPositive ? "+" : ""}${formatEur(result.gainLoss)}`}
          color={isPositive ? "var(--color-success)" : "var(--color-danger)"}
        />
        <KpiBig label={`Tokens (${symbol})`} value={formatTokens(result.tokensAcquired)} />
        <KpiBig label="Prix moyen d'achat" value={formatEur(result.averageBuyPrice)} />
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
        <PriceChart data={result.chartData} symbol={symbol} />
      </div>
    </div>
  );
}
