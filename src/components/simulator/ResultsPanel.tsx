"use client";

import { PiggyBank, Coins, CircleDollarSign, Wallet, Percent, ListChecks } from "lucide-react";
import { KpiCard } from "./KpiCard";
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

export function ResultsPanel({ result, symbol, isLoading, error }: ResultsPanelProps) {
  const isPositive = result ? result.gainLoss >= 0 : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-lg"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <ListChecks size={18} className="text-white" />
        <span className="text-white font-semibold text-sm">Chiffres clés</span>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Chargement des données...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "#1a1010",
            color: "var(--color-danger)",
            border: "1px solid #7f1d1d",
          }}
        >
          {error}
        </div>
      )}

      {!result && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
          <Wallet size={40} style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
            Renseignez les paramètres et cliquez sur Simuler pour voir vos résultats
          </p>
        </div>
      )}

      {result && !isLoading && (
        <>
          {/* KPI Cards */}
          <div className="flex flex-col">
            <KpiCard
              icon={<PiggyBank size={20} />}
              label="Montant total investi"
              value={formatEur(result.totalInvested)}
            />
            <KpiCard
              icon={<Coins size={20} />}
              label={`Tokens acquis (${symbol})`}
              value={formatTokens(result.tokensAcquired)}
            />
            <KpiCard
              icon={<CircleDollarSign size={20} />}
              label="Prix moyen d'achat"
              value={formatEur(result.averageBuyPrice)}
            />
            <KpiCard
              icon={<Wallet size={20} />}
              label="Valeur finale"
              value={formatEur(result.finalValue)}
            />
            <KpiCard
              icon={<Percent size={20} />}
              label="Plus/Moins-value"
              value={`${isPositive ? "+" : ""}${formatEur(result.gainLoss)}`}
              sub={`${isPositive ? "+" : ""}${result.gainLossPercent.toFixed(2)}%`}
              highlight={isPositive ? "success" : "danger"}
            />
          </div>

          {/* Chart */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <PriceChart data={result.chartData} symbol={symbol} />
          </div>
        </>
      )}
    </div>
  );
}
