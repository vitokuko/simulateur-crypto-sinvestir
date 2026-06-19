// Centralise TOUTES les fonctions de formatage utilisées dans le projet

export function formatEur(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatEurAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} k€`;
  return `${value.toFixed(0)} €`;
}

export function formatTokens(value: number): string {
  return value.toFixed(8);
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

export function formatDateAxis(dateStr: string, data: { date: string }[]): string {
  const first = new Date(data[0]?.date ?? dateStr);
  const last = new Date(data[data.length - 1]?.date ?? dateStr);
  const spanMonths =
    (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth());
  const d = new Date(dateStr);
  if (spanMonths <= 18) {
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  }
  return d.getFullYear().toString();
}
