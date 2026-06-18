import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  loading,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      disabled={disabled || loading}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
      style={{
        backgroundColor: isPrimary ? "var(--color-accent)" : "var(--color-bg-card)",
        color: "#ffffff",
      }}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
