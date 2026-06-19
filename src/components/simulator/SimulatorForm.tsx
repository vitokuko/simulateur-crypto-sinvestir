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

const DEFAULT_CRYPTO: CryptoAsset = { id: "BTCEUR", symbol: "BTC", name: "Bitcoin" };

function getDefaultDates() {
  const now = Date.now();
  return {
    end: new Date(now - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    start: new Date(now - 366 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
}

interface SimulatorFormProps {
  onChange: (values: SimulatorFormInput | null) => void;
  initialValues?: Partial<SimulatorFormInput> | null;
}

const labelStyle = { color: "#7899ce" };
const inputStyle: React.CSSProperties = {
  background: "transparent",
  color: "#ffffff",
  outline: "none",
  width: "100%",
  fontSize: "1.25rem",
  fontWeight: "300",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid rgba(120,153,206,0.3)",
  paddingRight: "2.5rem",
};

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
    <div className="space-y-2">
      <label className="font-light text-xs flex items-center gap-2" style={labelStyle}>
        {label}
      </label>
      <div className="relative">
        {children}
        {unit && (
          <div
            className="absolute text-right right-0 top-1/2 -translate-y-1/2 text-sm font-light pointer-events-none"
            style={{ color: "#7899ce" }}
          >
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

export function SimulatorForm({ onChange, initialValues }: SimulatorFormProps) {
  const defaults = useMemo(() => getDefaultDates(), []);

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
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? defaults.start);
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? defaults.end);
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

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Crypto selector */}
      <div className="space-y-2">
        <label className="font-light text-xs flex items-center gap-2" style={labelStyle}>
          Actif numérique
        </label>
        <div className="relative">
          {!showDropdown ? (
            <button
              type="button"
              onClick={() => {
                setShowDropdown(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="w-full flex items-center justify-between pb-2 border-b"
              style={{ borderColor: "rgba(120,153,206,0.3)" }}
            >
              <span className="text-white text-xl font-light">
                {selectedCrypto.name}{" "}
                <span className="text-sm" style={{ color: "#7899ce" }}>
                  ({selectedCrypto.symbol})
                </span>
              </span>
              <ChevronDown size={16} style={{ color: "#7899ce" }} className="shrink-0" />
            </button>
          ) : (
            <div className="relative">
              <Search
                size={14}
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={{ color: "#7899ce" }}
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
              style={{ backgroundColor: "#141b2d", borderColor: "rgba(255,255,255,0.1)" }}
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
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    style={{ color: "#ffffff" }}
                  >
                    <span>{crypto.name}</span>
                    <span style={{ color: "#7899ce" }}>{crypto.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
          style={{ ...inputStyle, cursor: "pointer", paddingRight: "0" }}
        >
          {FREQUENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ backgroundColor: "#141b2d" }}>
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
          className="date-input"
          style={inputStyle}
        />
      </FieldRow>

      {/* End date */}
      <FieldRow label="Date de fin">
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={defaults.end}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
          style={inputStyle}
        />
      </FieldRow>
    </div>
  );
}
