export const BINANCE_MIN_DATE = "2020-01-03";
export const DEBOUNCE_DELAY = 600;
export const TOAST_DURATION = 3000;
export const COPY_RESET_DELAY = 2000;
export const CHART_MAX_POINTS = 300;

export const COLORS = {
  blue: "#1098F7",
  blueMuted: "#7899ce",
  purple: "#7c3aed",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  red: "#ef4444",
  blueSky: "#93c5fd",
  background: "#0b1120",
  backgroundDeep: "#0d1525",
} as const;

export const CHART_PERIODS = [
  { key: "3M" as const, label: "3M", months: 3 },
  { key: "6M" as const, label: "6M", months: 6 },
  { key: "1A" as const, label: "1A", months: 12 },
  { key: "3A" as const, label: "3A", months: 36 },
  { key: "Max" as const, label: "Max", months: null },
] as const;

export type PeriodKey = (typeof CHART_PERIODS)[number]["key"];
