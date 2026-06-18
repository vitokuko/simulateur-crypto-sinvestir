"use client";

import { useState, useMemo, useRef } from "react";
import { FlaskConical, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { searchCryptos } from "@/lib/api/coingecko";
import { simulatorSchema, type SimulatorFormInput } from "@/lib/validators/simulator";
import type { CryptoAsset, Frequency } from "@/types/simulator";

const FREQUENCY_OPTIONS = [
  { value: "one-shot", label: "Investissement unique" },
  { value: "monthly", label: "Par mois" },
  { value: "weekly", label: "Par semaine" },
  { value: "daily", label: "Par jour" },
];

const DEFAULT_END = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
const DEFAULT_START = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const DEFAULT_CRYPTO: CryptoAsset = { id: "bitcoin", symbol: "BTC", name: "Bitcoin" };

interface SimulatorFormProps {
  onSubmit: (values: SimulatorFormInput) => void;
  isLoading: boolean;
}

export function SimulatorForm({ onSubmit, isLoading }: SimulatorFormProps) {
  const [cryptoQuery, setCryptoQuery] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(DEFAULT_CRYPTO);
  const [showDropdown, setShowDropdown] = useState(false);
  const [amount, setAmount] = useState("100");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const cryptoResults = useMemo(() => searchCryptos(cryptoQuery), [cryptoQuery]);

  function handleSelectCrypto(crypto: CryptoAsset) {
    setSelectedCrypto(crypto);
    setCryptoQuery("");
    setShowDropdown(false);
  }

  function handleCryptoInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCryptoQuery(e.target.value);
    setShowDropdown(true);
  }

  function handleCryptoBlur() {
    setTimeout(() => setShowDropdown(false), 150);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = simulatorSchema.safeParse({
      cryptoId: selectedCrypto.id,
      cryptoName: selectedCrypto.name,
      cryptoSymbol: selectedCrypto.symbol,
      amount: parseFloat(amount),
      frequency,
      startDate,
      endDate,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-lg"
        style={{ backgroundColor: "#d97706" }}
      >
        <FlaskConical size={18} className="text-white" />
        <span className="text-white font-semibold text-sm">Simulation</span>
      </div>

      {/* Crypto search */}
      <div className="flex flex-col gap-1.5 relative">
        <label className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
          Actif numérique
        </label>

        {/* Selected crypto display or search input */}
        {!showDropdown && !cryptoQuery ? (
          <button
            type="button"
            onClick={() => {
              setShowDropdown(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm border text-left"
            style={{
              backgroundColor: "var(--color-bg-input)",
              color: "var(--color-text-primary)",
              borderColor: errors.cryptoId ? "var(--color-danger)" : "var(--color-border)",
            }}
          >
            <span className="flex items-center gap-2">
              <Search size={14} style={{ color: "var(--color-text-muted)" }} />
              {selectedCrypto.name}
              <span style={{ color: "var(--color-text-muted)" }}>({selectedCrypto.symbol})</span>
            </span>
            <ChevronDown size={14} style={{ color: "var(--color-text-muted)" }} />
          </button>
        ) : (
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              ref={inputRef}
              type="text"
              value={cryptoQuery}
              onChange={handleCryptoInputChange}
              onBlur={handleCryptoBlur}
              placeholder="Rechercher une crypto..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none border"
              style={{
                backgroundColor: "var(--color-bg-input)",
                color: "var(--color-text-primary)",
                borderColor: errors.cryptoId ? "var(--color-danger)" : "var(--color-border)",
              }}
            />
          </div>
        )}

        {showDropdown && (
          <ul
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border overflow-y-auto max-h-48"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            {cryptoResults.map((crypto) => (
              <li key={crypto.id}>
                <button
                  type="button"
                  onMouseDown={() => handleSelectCrypto(crypto)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:opacity-80 transition-opacity"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span>{crypto.name}</span>
                  <span style={{ color: "var(--color-text-muted)" }}>{crypto.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {errors.cryptoId && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {errors.cryptoId}
          </p>
        )}
      </div>

      {/* Amount */}
      <Input
        label="Montant (€)"
        type="number"
        min="1"
        step="any"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
        placeholder="100"
      />

      {/* Frequency */}
      <Select
        label="Fréquence"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as Frequency)}
        options={FREQUENCY_OPTIONS}
        error={errors.frequency}
      />

      {/* Dates */}
      <Input
        label="Depuis"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        error={errors.startDate}
        max={endDate}
      />

      <Input
        label="Jusqu'au"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        error={errors.endDate}
        min={startDate}
        max={DEFAULT_END}
      />

      <Button type="submit" loading={isLoading}>
        Simuler
      </Button>
    </form>
  );
}
