import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors border appearance-none cursor-pointer"
          style={{
            backgroundColor: "var(--color-bg-input)",
            color: "var(--color-text-primary)",
            borderColor: error ? "var(--color-danger)" : "var(--color-border)",
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
