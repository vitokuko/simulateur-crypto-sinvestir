"use client";

import type { SimulationResult, ChartDataPoint } from "@/types/simulator";
import type { Frequency } from "@/types/simulator";
import { formatEur } from "@/lib/utils/formatters";

interface SimulationShareCardProps {
  result: SimulationResult;
  symbol: string;
  frequency: Frequency | undefined;
  startDate: string;
  endDate: string;
  logoDataUrl?: string;
}

const FREQUENCY_LABELS: Record<Frequency, string> = {
  "one-shot": "Investissement unique",
  daily: "DCA quotidien",
  weekly: "DCA hebdomadaire",
  monthly: "DCA mensuel",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateAxis(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

function sampleData(data: ChartDataPoint[], max = 60) {
  const step = Math.max(1, Math.ceil(data.length / max));
  return data.filter((_, i) => i % step === 0);
}

interface SvgChartHistoriqueProps {
  data: ChartDataPoint[];
  width: number;
  height: number;
}

function SvgChartHistorique({ data, width, height }: SvgChartHistoriqueProps) {
  const sampled = sampleData(data);
  if (sampled.length < 2) return null;

  const padL = 52;
  const padR = 52; // right axis for tokens
  const padT = 8;
  const padB = 28;
  const w = width - padL - padR;
  const h = height - padT - padB;

  // Left axis: EUR values (valeur, investi, prix)
  const eurVals = sampled.flatMap((d) => [d.valeur, d.investi, d.prix]);
  const minE = Math.min(...eurVals);
  const maxE = Math.max(...eurVals);
  const rangeE = maxE - minE || 1;

  // Right axis: tokens (acquis) — normalized to same pixel space
  const tokenVals = sampled.map((d) => d.acquis);
  const minT = Math.min(...tokenVals);
  const maxT = Math.max(...tokenVals);
  const rangeT = maxT - minT || 1;

  const xOf = (i: number) => padL + (i / (sampled.length - 1)) * w;
  const yEur = (v: number) => padT + h - ((v - minE) / rangeE) * h;
  const yTok = (v: number) => padT + h - ((v - minT) / rangeT) * h;

  function lineEur(key: keyof ChartDataPoint) {
    return sampled.map((d, i) => `${xOf(i).toFixed(1)},${yEur(d[key] as number).toFixed(1)}`).join(" ");
  }
  function lineTok() {
    return sampled.map((d, i) => `${xOf(i).toFixed(1)},${yTok(d.acquis).toFixed(1)}`).join(" ");
  }
  function areaEur(key: keyof ChartDataPoint) {
    const top = sampled.map((d, i) => `${xOf(i).toFixed(1)},${yEur(d[key] as number).toFixed(1)}`).join(" ");
    return `${top} ${xOf(sampled.length - 1).toFixed(1)},${(padT + h).toFixed(1)} ${xOf(0).toFixed(1)},${(padT + h).toFixed(1)}`;
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minE + rangeE * t);
  const yTicksR = [0, 0.25, 0.5, 0.75, 1].map((t) => minT + rangeT * t);
  const xTickIdxs = Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * (sampled.length - 1)));

  function fmtEur(v: number) {
    return Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k€` : `${Math.round(v)}€`;
  }
  function fmtTok(v: number) {
    return v < 0.01 ? v.toExponential(1) : v.toFixed(v < 1 ? 3 : 2);
  }

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="hgV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {yTicks.map((v, i) => (
        <line key={i} x1={padL} y1={yEur(v)} x2={padL + w} y2={yEur(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Areas */}
      <polygon points={areaEur("valeur")} fill="url(#hgV)" />
      {/* Lines */}
      <polyline points={lineEur("investi")} fill="none" stroke="#7c3aed" strokeWidth="1.5" />
      <polyline points={lineEur("prix")} fill="none" stroke="#f97316" strokeWidth="1.5" />
      <polyline points={lineEur("valeur")} fill="none" stroke="#93c5fd" strokeWidth="2" />
      <polyline points={lineTok()} fill="none" stroke="#eab308" strokeWidth="1.5" />
      {/* Left Y axis labels (EUR) */}
      {yTicks.map((v, i) => (
        <text key={i} x={padL - 4} y={yEur(v) + 4} textAnchor="end" fontSize="9" fill="#6b8bb5">
          {fmtEur(v)}
        </text>
      ))}
      {/* Right Y axis labels (tokens) */}
      {yTicksR.map((v, i) => (
        <text key={i} x={padL + w + 4} y={yTok(v) + 4} textAnchor="start" fontSize="9" fill="#eab308" fillOpacity="0.7">
          {fmtTok(v)}
        </text>
      ))}
      {/* X axis labels */}
      {xTickIdxs.map((idx, i) => {
        const d = sampled[idx];
        return d ? (
          <text key={i} x={xOf(idx)} y={padT + h + 18} textAnchor="middle" fontSize="9" fill="#6b8bb5">
            {formatDateAxis(d.date)}
          </text>
        ) : null;
      })}
    </svg>
  );
}

interface SvgChartGainsPertesProps {
  data: ChartDataPoint[];
  width: number;
  height: number;
}

function SvgChartGainsPertes({ data, width, height }: SvgChartGainsPertesProps) {
  const sampled = sampleData(data);
  if (sampled.length < 2) return null;

  const padL = 52;
  const padR = 8;
  const padT = 8;
  const padB = 28;
  const w = width - padL - padR;
  const h = height - padT - padB;

  // All EUR values: valeur, investi, prix, gains (valeur - investi)
  const gainVals = sampled.map((d) => d.valeur - d.investi);
  const allVals = [...sampled.flatMap((d) => [d.valeur, d.investi, d.prix]), ...gainVals];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  const xOf = (i: number) => padL + (i / (sampled.length - 1)) * w;
  const yOf = (v: number) => padT + h - ((v - minV) / range) * h;
  const y0 = yOf(0);

  function lineEur(key: keyof ChartDataPoint) {
    return sampled.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d[key] as number).toFixed(1)}`).join(" ");
  }

  // Gain/loss filled zones (above/below 0)
  const posPoints = sampled.map((d, i) => {
    const g = d.valeur - d.investi;
    return `${xOf(i).toFixed(1)},${(g >= 0 ? yOf(g) : y0).toFixed(1)}`;
  });
  const negPoints = sampled.map((d, i) => {
    const g = d.valeur - d.investi;
    return `${xOf(i).toFixed(1)},${(g < 0 ? yOf(g) : y0).toFixed(1)}`;
  });
  const posArea = `${posPoints.join(" ")} ${xOf(sampled.length - 1).toFixed(1)},${y0.toFixed(1)} ${xOf(0).toFixed(1)},${y0.toFixed(1)}`;
  const negArea = `${negPoints.join(" ")} ${xOf(sampled.length - 1).toFixed(1)},${y0.toFixed(1)} ${xOf(0).toFixed(1)},${y0.toFixed(1)}`;
  const gainLine = sampled.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.valeur - d.investi).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minV + range * t);
  const xTickIdxs = Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * (sampled.length - 1)));

  function fmtEur(v: number) {
    return Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k€` : `${Math.round(v)}€`;
  }

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="gpPos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="gpNeg" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {yTicks.map((v, i) => (
        <line key={i} x1={padL} y1={yOf(v)} x2={padL + w} y2={yOf(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Zero line */}
      <line x1={padL} y1={y0} x2={padL + w} y2={y0} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
      {/* Gain/loss zones */}
      <polygon points={posArea} fill="url(#gpPos)" />
      <polygon points={negArea} fill="url(#gpNeg)" />
      <polyline points={gainLine} fill="none" stroke="#22c55e" strokeWidth="1.5" />
      {/* EUR lines: investi, prix, valeur */}
      <polyline points={lineEur("investi")} fill="none" stroke="#7c3aed" strokeWidth="1.5" />
      <polyline points={lineEur("prix")} fill="none" stroke="#f97316" strokeWidth="1.5" />
      <polyline points={lineEur("valeur")} fill="none" stroke="#eab308" strokeWidth="2" />
      {/* Y axis */}
      {yTicks.map((v, i) => (
        <text key={i} x={padL - 4} y={yOf(v) + 4} textAnchor="end" fontSize="9" fill="#6b8bb5">
          {fmtEur(v)}
        </text>
      ))}
      {/* X axis */}
      {xTickIdxs.map((idx, i) => {
        const d = sampled[idx];
        return d ? (
          <text key={i} x={xOf(idx)} y={padT + h + 18} textAnchor="middle" fontSize="9" fill="#6b8bb5">
            {formatDateAxis(d.date)}
          </text>
        ) : null;
      })}
    </svg>
  );
}

export function SimulationShareCard({
  result,
  symbol,
  frequency,
  startDate,
  endDate,
  logoDataUrl,
}: SimulationShareCardProps) {
  const investedPct = Math.round((result.totalInvested / result.finalValue) * 100);
  const gainPct = 100 - investedPct;
  const isGain = result.gainLoss >= 0;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const CHART_WIDTH = 704;

  return (
    <div
      style={{
        width: 800,
        backgroundColor: "#0b1120",
        padding: "48px 48px 36px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 4, height: 32, backgroundColor: "#1098F7", borderRadius: 2, marginRight: 12 }} />
          <span style={{ fontSize: 26, fontWeight: 300, color: "#ffffff" }}>Vos résultats</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 13, color: "#7899ce", margin: 0 }}>simulateurs.sinvestir.fr</p>
          <p style={{ fontSize: 13, color: "#7899ce", margin: "2px 0 0" }}>Le {today}</p>
        </div>
      </div>

      {/* Top KPI cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {/* Capital final */}
        <div style={{
          flex: 1,
          backgroundColor: "#111827",
          borderRadius: 16,
          padding: "24px 24px 20px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <p style={{ fontSize: 12, color: "#7899ce", margin: "0 0 8px", fontWeight: 400 }}>Capital final</p>
          <p style={{ fontSize: 32, fontWeight: 300, margin: "0 0 8px", letterSpacing: -1 }}>
            {result.finalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span style={{ fontSize: 16, color: "#7899ce" }}>EUR</span>
          </p>
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <span style={{ fontSize: 12 }}>
              <span style={{ color: "#1098F7" }}>Somme investie</span>{" "}
              <span style={{ color: "#ffffff", fontWeight: 500 }}>{formatEur(result.totalInvested)}</span>
            </span>
            <span style={{ fontSize: 12 }}>
              <span style={{ color: isGain ? "#22c55e" : "#ef4444" }}>
                {isGain ? "Gains" : "Pertes"}
              </span>{" "}
              <span style={{ color: "#ffffff", fontWeight: 500 }}>{formatEur(result.gainLoss)}</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 4, backgroundColor: "#1a2744", overflow: "hidden" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ width: `${investedPct}%`, backgroundColor: "#1098F7" }} />
              <div style={{ width: `${gainPct}%`, backgroundColor: isGain ? "#22c55e" : "#ef4444" }} />
            </div>
          </div>
        </div>

        {/* Performance */}
        <div style={{
          width: 180,
          backgroundColor: "#111827",
          borderRadius: 16,
          padding: "24px 24px 20px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <p style={{ fontSize: 12, color: "#7899ce", margin: "0 0 8px", fontWeight: 400 }}>Performance</p>
          <p style={{
            fontSize: 34,
            fontWeight: 300,
            margin: "20px 0 0",
            color: isGain ? "#22c55e" : "#ef4444",
          }}>
            {isGain ? "+" : ""}{result.gainLossPercent.toFixed(1)}<span style={{ fontSize: 20 }}>%</span>
          </p>
        </div>
      </div>

      {/* Résumé textuel */}
      <div style={{
        backgroundColor: "#111827",
        borderRadius: 16,
        padding: "20px 28px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 28,
      }}>
        <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0, textAlign: "center" }}>
          {frequency ? FREQUENCY_LABELS[frequency] : "Simulation"} sur{" "}
          <strong style={{ color: "#ffffff", fontWeight: 600 }}>{symbol}</strong> du{" "}
          <strong style={{ color: "#ffffff", fontWeight: 600 }}>{formatDate(startDate)}</strong> au{" "}
          <strong style={{ color: "#ffffff", fontWeight: 600 }}>{formatDate(endDate)}</strong>.{" "}
          Somme investie :{" "}
          <strong style={{ color: "#1098F7", fontWeight: 600 }}>{formatEur(result.totalInvested)}</strong>.{" "}
          Capital final :{" "}
          <strong style={{ color: isGain ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{formatEur(result.finalValue)}</strong>.
        </p>
      </div>

      {/* Chart Historique */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 11, color: "#7899ce", margin: "0 0 8px", fontWeight: 400 }}>Historique</p>
        <SvgChartHistorique data={result.chartData} width={CHART_WIDTH} height={180} />
        <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
          {[
            { label: "Valeur", color: "#93c5fd" },
            { label: "Investi", color: "#7c3aed" },
            { label: "Prix", color: "#f97316" },
            { label: "Acquis (tokens)", color: "#eab308" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: l.color }} />
              <span style={{ fontSize: 11, color: "#6b8bb5" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Gains / Pertes */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 11, color: "#7899ce", margin: "16px 0 8px", fontWeight: 400 }}>Gains / Pertes</p>
        <SvgChartGainsPertes data={result.chartData} width={CHART_WIDTH} height={160} />
        <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
          {[
            { label: "Valeur", color: "#eab308" },
            { label: "Investi", color: "#7c3aed" },
            { label: "Prix", color: "#f97316" },
            { label: "Gains / Pertes", color: "#22c55e" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: l.color }} />
              <span style={{ fontSize: 11, color: "#6b8bb5" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoDataUrl} alt="S'investir" style={{ height: 36, width: "auto" }} />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              backgroundColor: "#c9a227",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#0d1117",
            }}>
              S&apos;
            </div>
          )}
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff" }}>
            SIMULATEURS
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#7899ce" }}>
          Copyright © {new Date().getFullYear()} | sinvestir.fr
        </span>
      </div>
    </div>
  );
}
