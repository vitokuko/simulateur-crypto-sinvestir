import { ReactNode } from "react";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: "success" | "danger";
}

export function KpiCard({ icon, label, value, sub, highlight }: KpiCardProps) {
  const valueColor =
    highlight === "success"
      ? "var(--color-success)"
      : highlight === "danger"
        ? "var(--color-danger)"
        : "var(--color-text-primary)";

  return (
    <div
      className="flex items-start gap-4 py-4 border-b last:border-b-0"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mt-0.5 shrink-0" style={{ color: "var(--color-text-muted)" }}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {label}
        </p>
        <p className="text-lg font-bold tabular-nums truncate" style={{ color: valueColor }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
