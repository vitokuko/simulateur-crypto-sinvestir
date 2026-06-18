import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors border"
          style={{
            backgroundColor: "var(--color-bg-input)",
            color: "var(--color-text-primary)",
            borderColor: error ? "var(--color-danger)" : "var(--color-border)",
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
