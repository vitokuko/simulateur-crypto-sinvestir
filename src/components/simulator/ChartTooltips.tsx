"use client";

import { formatEur } from "@/lib/utils/formatters";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TooltipHistorique({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const dateLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const order = ["acquis", "prix", "valeur", "investi"];
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
          <span className="font-medium">
            {entry.dataKey === "acquis"
              ? entry.value.toFixed(8)
              : formatEur(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TooltipGainsPertres({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const dateLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const order = ["valeur", "prix", "gainsPos", "gainsNeg", "investi"];
  const deduped = payload.filter(
    (e: { dataKey: string }, i: number, arr: { dataKey: string }[]) =>
      arr.findIndex((x) => x.dataKey === e.dataKey) === i
  );
  const sorted = [...deduped].sort((a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey));

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
      {sorted.map((entry: { name: string; value: number; color: string; dataKey: string }) => {
        const entryLabel =
          entry.dataKey === "gainsPos" || entry.dataKey === "gainsNeg"
            ? "Gains / Pertes"
            : entry.name;
        const color =
          entry.dataKey === "gainsPos"
            ? "#22c55e"
            : entry.dataKey === "gainsNeg"
              ? "#ef4444"
              : entry.color;
        return (
          <div key={entry.dataKey} className="flex justify-between gap-6 mb-1">
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm inline-block shrink-0"
                style={{ backgroundColor: color }}
              />
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{entryLabel} :</span>
            </span>
            <span className="font-medium">{formatEur(entry.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
