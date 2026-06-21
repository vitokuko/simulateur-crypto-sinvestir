"use client";

import { useState } from "react";
import { Wallet, X } from "lucide-react";
import type { SimulationResult } from "@/types/simulator";
import type { Frequency } from "@/types/simulator";
import { formatEur, formatTokens } from "@/lib/utils/formatters";

const YOUTUBE_VIDEO_ID = "6StPxejOdCc";
const YOUTUBE_PLAYLIST = "PLu3RiIsD-GLtP6ti39E4jhjPChHtqSNnG";

function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-colors"
          style={{ color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(0,0,0,0.4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <X size={18} />
        </button>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&list=${YOUTUBE_PLAYLIST}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

interface ResultsPanelProps {
  result: SimulationResult | null;
  symbol: string;
  frequency?: Frequency;
  amount?: number;
  isLoading: boolean;
  isFetching?: boolean;
  error: string | null;
}

function formatTokensLocal(value: number): string {
  if (value < 0.0001) return value.toExponential(4);
  return formatTokens(value);
}

function frequencyLabel(freq: Frequency): string {
  switch (freq) {
    case "one-shot": return "en une seule fois";
    case "daily": return "par jour";
    case "weekly": return "par semaine";
    case "monthly": return "par mois";
  }
}

export function ResultsPanel({ result, symbol, frequency, amount, isLoading, isFetching, error }: ResultsPanelProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  // First load with no data yet — show spinner
  if (isLoading && !result) {
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
  const investedPct = Math.min(100, Math.max(0, Math.round((result.totalInvested / result.finalValue) * 100)));
  const gainPct = 100 - investedPct;
  const investedAmt = amount ?? result.totalInvested;

  return (
    <div>
    {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    <div className="flex flex-col gap-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div style={{ width: 4, height: 28, backgroundColor: "#1098F7", borderRadius: 2 }} />
          <h2 className="text-xl font-light text-white">Vos résultats</h2>
        </div>
        <button
          onClick={() => setVideoOpen(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-light text-white transition-all duration-[400ms]"
          style={{ background: "linear-gradient(to right, #0049C6, #04265F)", border: "1px solid transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3d5af1")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.2917 8.32395C11.157 8.83558 10.5206 9.19711 9.2479 9.92018C8.01754 10.6192 7.40236 10.9687 6.9066 10.8282C6.70164 10.7701 6.51489 10.6598 6.36428 10.5078C6 10.1403 6 9.42743 6 8.00167C6 6.57592 6 5.86304 6.36428 5.49551C6.51489 5.34356 6.70164 5.23325 6.9066 5.17517C7.40236 5.03468 8.01754 5.38418 9.2479 6.08317C10.5206 6.80623 11.157 7.16777 11.2917 7.6794C11.3472 7.89058 11.3472 8.11276 11.2917 8.32395Z" stroke="currentColor" strokeLinejoin="round" />
            <path d="M14.6668 8.0013C14.6668 4.3194 11.6821 1.33464 8.00016 1.33464C4.31826 1.33464 1.3335 4.3194 1.3335 8.0013C1.3335 11.6832 4.31826 14.668 8.00016 14.668C11.6821 14.668 14.6668 11.6832 14.6668 8.0013Z" stroke="currentColor" />
          </svg>
          Voir notre vidéo tuto
        </button>
      </div>

      {/* Subtle refetch indicator — top border pulse, no content replacement */}
      {isFetching && (
        <div
          className="absolute inset-x-0 top-0 h-0.5 rounded-full overflow-hidden"
          style={{ zIndex: 10 }}
        >
          <div
            className="h-full w-1/3 rounded-full animate-pulse"
            style={{ backgroundColor: "#1098F7", animation: "slide-x 1.2s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Ligne 1 : Capital final (large) + Part des gains (narrow) */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr auto" }}>

        {/* Capital final */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-sm font-light mb-3 flex items-center gap-1.5" style={{ color: "#7899ce" }}>
            Capital final
          </p>
          <p className="font-light mb-3 tabular-nums" style={{ fontSize: 28, letterSpacing: -0.5 }}>
            {result.finalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-base ml-2" style={{ color: "#7899ce" }}>EUR</span>
          </p>
          <div className="flex gap-4 mb-3 flex-wrap">
            <span className="text-xs">
              <span style={{ color: "#1098F7" }}>Somme investie </span>
              <span className="font-semibold" style={{ color: "#1098F7" }}>{formatEur(result.totalInvested)}</span>
            </span>
            <span className="text-xs">
              <span style={{ color: "#eab308" }}>{isGain ? "Intérêts gagnés " : "Pertes "}</span>
              <span className="font-semibold" style={{ color: "#eab308" }}>{formatEur(result.gainLoss)}</span>
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#1a2744" }}>
            <div className="flex h-full rounded-full overflow-hidden">
              <div style={{ width: `${investedPct}%`, backgroundColor: "#1098F7", borderRadius: "999px 0 0 999px" }} />
              <div style={{ width: `${gainPct}%`, backgroundColor: isGain ? "#eab308" : "#ef4444", borderRadius: "0 999px 999px 0" }} />
            </div>
          </div>
        </div>

        {/* Part des gains */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)", minWidth: 140 }}
        >
          <p className="text-sm font-light leading-tight" style={{ color: "#7899ce" }}>
            Part des {isGain ? "intérêts gagnés" : "pertes"}
          </p>
          <p className="font-light tabular-nums mt-4" style={{ fontSize: 34, color: isGain ? "#ffffff" : gainColor }}>
            {gainPct}<span className="text-xl"> %</span>
          </p>
        </div>
      </div>

      {/* Ligne 2 : Part du capital (narrow) + résumé textuel (large) */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>

        {/* Part du capital */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)", minWidth: 140 }}
        >
          <p className="text-sm font-light leading-tight" style={{ color: "#7899ce" }}>
            Part du capital investi
          </p>
          <p className="font-light tabular-nums mt-4" style={{ fontSize: 34, color: "#ffffff" }}>
            {investedPct}<span className="text-xl"> %</span>
          </p>
        </div>

        {/* Résumé textuel */}
        <div
          className="rounded-2xl p-5 flex items-center"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {frequency ? (
              <>
                Votre investissement de{" "}
                <strong className="text-white">{formatEur(investedAmt)}</strong>
                {frequency !== "one-shot" && (
                  <> <strong className="text-white">{frequencyLabel(frequency)}</strong></>
                )}{" "}
                sur{" "}
                <strong className="text-white">{symbol}</strong> vaut aujourd&apos;hui{" "}
                <strong style={{ color: isGain ? "#eab308" : gainColor }}>{formatEur(result.finalValue)}</strong>.{" "}
                Vous avez acquis{" "}
                <strong className="text-white">{formatTokensLocal(result.tokensAcquired)} {symbol}</strong>{" "}
                à un prix moyen de{" "}
                <strong style={{ color: "#1098F7" }}>{formatEur(result.averageBuyPrice)}</strong>.
              </>
            ) : (
              <>
                Capital final de{" "}
                <strong style={{ color: isGain ? "#eab308" : gainColor }}>{formatEur(result.finalValue)}</strong>{" "}
                pour{" "}
                <strong style={{ color: "#1098F7" }}>{formatEur(result.totalInvested)}</strong> investis.{" "}
                Performance :{" "}
                <strong style={{ color: gainColor }}>
                  {isGain ? "+" : ""}{result.gainLossPercent.toFixed(2)} %
                </strong>.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Ligne 3 : Tokens + Prix moyen + Performance */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-2" style={{ color: "#7899ce" }}>Tokens acquis</p>
          <p className="text-xl font-light tabular-nums text-white break-all">
            {formatTokensLocal(result.tokensAcquired)}
            <span className="text-xs ml-1" style={{ color: "#7899ce" }}>{symbol}</span>
          </p>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-2" style={{ color: "#7899ce" }}>Prix moyen d&apos;achat</p>
          <p className="text-xl font-light tabular-nums text-white break-all">
            {formatEur(result.averageBuyPrice)}
          </p>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-light mb-2" style={{ color: "#7899ce" }}>Performance</p>
          <p className="text-2xl font-light tabular-nums" style={{ color: gainColor }}>
            {isGain ? "+" : ""}{result.gainLossPercent.toFixed(1)}<span className="text-base">%</span>
          </p>
        </div>
      </div>

    </div>
    </div>
  );
}
