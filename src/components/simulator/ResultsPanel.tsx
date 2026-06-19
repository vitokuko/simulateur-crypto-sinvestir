"use client";

import { Wallet } from "lucide-react";
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

  const gainPct =
    result.finalValue > 0 ? Math.max((result.gainLoss / result.finalValue) * 100, 0) : 0;
  const investedPct = Math.min(100 - gainPct, 100);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center items-start lg:justify-between">
        <h3
          className="text-2xl font-normal text-white py-0.5 px-4 border-l-2"
          style={{ borderColor: "#1098F7" }}
        >
          Vos résultats
        </h3>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Capital final — col-span-2 */}
        <div
          className="col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between gap-y-3"
          style={{ minHeight: 160 }}
        >
          <p className="text-white font-normal text-sm">Capital final</p>
          <p className="flex items-baseline gap-2">
            <span className="text-white font-normal text-3xl tabular-nums">
              {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
                result.finalValue
              )}
            </span>
            <span className="text-white font-normal text-sm">EUR</span>
          </p>
          <p className="grid grid-cols-2 gap-2">
            <span
              className="flex flex-col xl:flex-row items-start xl:items-center gap-1 sm:gap-2"
              style={{ color: "#1098F7" }}
            >
              <span className="text-xs font-light">Somme investie</span>
              <strong className="text-sm font-bold">{formatEur(result.totalInvested)}</strong>
            </span>
            <span
              className="flex flex-col xl:flex-row items-end xl:items-center gap-1 sm:gap-2"
              style={{ color: isPositive ? "#eab308" : "#ef4444" }}
            >
              <span className="text-xs font-light">
                {isPositive ? "Intérêts gagnés" : "Moins-value"}
              </span>
              <strong className="text-sm font-bold">{formatEur(result.gainLoss)}</strong>
            </span>
          </p>
          {/* Progress bar: yellow bg, blue for invested portion */}
          <div
            className="w-full h-[30px] rounded-full overflow-hidden relative"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: isPositive ? "#eab308" : "#ef4444" }}
            />
            <div
              className="absolute left-0 top-0 h-full rounded-r-full transition-all duration-700"
              style={{ width: `${investedPct}%`, backgroundColor: "#1098F7" }}
            />
          </div>
        </div>

        {/* Part des intérêts gagnés — col-span-1 */}
        <div className="col-span-1 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <p className="text-white font-normal text-sm">
            {isPositive ? "Part des intérêts gagnés" : "Perte"}
          </p>
          <p className="text-white font-normal text-3xl xl:text-[2.60rem] mt-4 tabular-nums">
            {gainPct.toFixed(2)} <span className="text-white font-normal text-sm">%</span>
          </p>
        </div>

        {/* Part du capital investi — col-span-1 */}
        <div className="col-span-1 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <p className="text-white font-normal text-sm">Part du capital investi</p>
          <p className="text-white font-normal text-3xl xl:text-[2.60rem] mt-4 tabular-nums">
            {investedPct.toFixed(2)} <span className="text-white font-normal text-sm">%</span>
          </p>
        </div>

        {/* Tokens acquis — col-span-1 */}
        <div className="col-span-1 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <p className="text-white font-normal text-sm">Tokens acquis ({symbol})</p>
          <p className="text-white font-normal text-2xl mt-4 tabular-nums">
            {formatTokens(result.tokensAcquired)}
          </p>
        </div>

        {/* Summary text — col-span-2 */}
        <div className="col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
          <p className="text-white font-light text-base text-balance max-w-sm mx-auto">
            Votre investissement de{" "}
            <strong className="font-bold">{formatEur(result.totalInvested)}</strong> en{" "}
            <strong className="font-bold">{symbol}</strong> à un prix moyen d&apos;achat de{" "}
            <strong className="font-bold">{formatEur(result.averageBuyPrice)}</strong> vaut
            désormais <strong className="font-bold">{formatEur(result.finalValue)}</strong>, soit{" "}
            <strong className="font-bold" style={{ color: isPositive ? "#eab308" : "#ef4444" }}>
              {isPositive ? "+" : ""}
              {result.gainLossPercent.toFixed(2)} %
            </strong>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
