"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { searchCryptos, TOP_CRYPTOS } from "@/lib/api/binance";
import { simulatorSchema, type SimulatorFormInput } from "@/lib/validators/simulator";
import { useDebounce } from "@/hooks/useDebounce";
import type { CryptoAsset, Frequency } from "@/types/simulator";

const FREQUENCY_OPTIONS = [
  { value: "one-shot", label: "Investissement unique" },
  { value: "monthly", label: "Par mois" },
  { value: "weekly", label: "Par semaine" },
  { value: "daily", label: "Par jour" },
];

const DEFAULT_END = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
const DEFAULT_START = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
const DEFAULT_CRYPTO: CryptoAsset = { id: "BTCEUR", symbol: "BTC", name: "Bitcoin" };

interface SimulatorFormProps {
  onChange: (values: SimulatorFormInput | null) => void;
  initialValues?: Partial<SimulatorFormInput> | null;
}

function FieldRow({
  label,
  unit,
  children,
}: {
  label: string;
  unit?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">{children}</div>
        {unit && (
          <span
            className="text-sm font-medium shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function SimulatorForm({ onChange, initialValues }: SimulatorFormProps) {
  const initCrypto = initialValues?.cryptoId
    ? (TOP_CRYPTOS.find((c) => c.id === initialValues.cryptoId) ?? DEFAULT_CRYPTO)
    : DEFAULT_CRYPTO;

  const [cryptoQuery, setCryptoQuery] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(initCrypto);
  const [showDropdown, setShowDropdown] = useState(false);
  const [amount, setAmount] = useState(
    initialValues?.amount ? String(initialValues.amount) : "100"
  );
  const [frequency, setFrequency] = useState<Frequency>(
    (initialValues?.frequency as Frequency) ?? "monthly"
  );
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? DEFAULT_START);
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? DEFAULT_END);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedAmount = useDebounce(amount, 600);
  const cryptoResults = useMemo(() => searchCryptos(cryptoQuery), [cryptoQuery]);

  useEffect(() => {
    const parsed = simulatorSchema.safeParse({
      cryptoId: selectedCrypto.id,
      cryptoName: selectedCrypto.name,
      cryptoSymbol: selectedCrypto.symbol,
      amount: parseFloat(debouncedAmount),
      frequency,
      startDate,
      endDate,
    });
    onChange(parsed.success ? parsed.data : null);
  }, [selectedCrypto, debouncedAmount, frequency, startDate, endDate, onChange]);

  const inputStyle = {
    background: "transparent",
    color: "var(--color-text-primary)",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "600",
  };

  return (
    <div>
      {/* Crypto */}
      <div className="py-4 border-b relative" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Actif numérique
        </p>
        {!showDropdown ? (
          <button
            type="button"
            onClick={() => {
              setShowDropdown(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="w-full flex items-center justify-between"
          >
            <span
              className="text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {selectedCrypto.name}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({selectedCrypto.symbol})
              </span>
            </span>
            <ChevronDown size={16} style={{ color: "var(--color-text-muted)" }} />
          </button>
        ) : (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-0 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              ref={inputRef}
              type="text"
              value={cryptoQuery}
              onChange={(e) => {
                setCryptoQuery(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Rechercher..."
              style={{ ...inputStyle, paddingLeft: "1.5rem" }}
            />
          </div>
        )}

        {showDropdown && (
          <ul
            className="absolute left-0 right-0 z-50 mt-2 rounded-xl border overflow-y-auto max-h-52 shadow-xl"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
          >
            {cryptoResults.map((crypto) => (
              <li key={crypto.id}>
                <button
                  type="button"
                  onMouseDown={() => {
                    setSelectedCrypto(crypto);
                    setCryptoQuery("");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span>{crypto.name}</span>
                  <span style={{ color: "var(--color-text-muted)" }}>{crypto.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Amount */}
      <FieldRow label="Montant" unit="EUR">
        <input
          type="number"
          min="1"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
          placeholder="100"
        />
      </FieldRow>

      {/* Frequency */}
      <FieldRow label="Fréquence d'investissement">
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {FREQUENCY_OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              {o.label}
            </option>
          ))}
        </select>
      </FieldRow>

      {/* Start date */}
      <FieldRow label="Date de début">
        <input
          type="date"
          value={startDate}
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />
      </FieldRow>

      {/* End date */}
      <FieldRow label="Date de fin">
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={DEFAULT_END}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        />
      </FieldRow>
    </div>
  );
}
