"use client";

import { useState, useMemo, useCallback, useRef, Suspense } from "react";
import { toPng } from "html-to-image";
import { Share2, Download } from "lucide-react";
import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import { ResultsPanel } from "@/components/simulator/ResultsPanel";
import { useHistoricalPrices } from "@/hooks/useHistoricalPrices";
import { useUrlSync } from "@/hooks/useUrlSync";
import { calculateSimulation } from "@/lib/calculations/simulator";
import type { SimulatorFormInput } from "@/lib/validators/simulator";

const API_ERRORS: Record<string, string> = {
  NOT_FOUND: "Aucune donnée disponible pour cette cryptomonnaie.",
  NO_DATA: "Aucune donnée disponible pour cette période. Essayez une date de début ultérieure.",
  API_ERROR: "Une erreur est survenue lors de la récupération des données. Réessayez.",
};

function SimulateurCryptoContent() {
  const { pushToUrl, readFromUrl } = useUrlSync();
  const initialValues = readFromUrl();
  const [formValues, setFormValues] = useState<SimulatorFormInput | null>(null);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (values: SimulatorFormInput | null) => {
      setFormValues(values);
      if (values) pushToUrl(values);
    },
    [pushToUrl]
  );

  const {
    data: prices,
    isLoading,
    error,
  } = useHistoricalPrices(
    formValues?.cryptoId ?? "",
    formValues?.startDate ?? "",
    formValues?.endDate ?? "",
    !!formValues
  );

  const result = useMemo(() => {
    if (!prices || !formValues) return null;
    return calculateSimulation(
      prices,
      formValues.amount,
      formValues.frequency,
      formValues.startDate,
      formValues.endDate
    );
  }, [prices, formValues]);

  const errorMessage = error
    ? (API_ERRORS[(error as Error).message] ?? API_ERRORS.API_ERROR)
    : null;

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleExport() {
    if (!resultsRef.current) return;
    const png = await toPng(resultsRef.current, { cacheBust: true });
    const link = document.createElement("a");
    link.download = `simulation-${formValues?.cryptoSymbol ?? "crypto"}.png`;
    link.href = png;
    link.click();
  }

  return (
    <div className="min-h-full p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Simulateur Crypto
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Analysez vos investissements sur données historiques — DCA ou investissement unique.
            </p>
          </div>

          {/* Action buttons */}
          {result && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  color: copied ? "var(--color-success)" : "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Share2 size={14} />
                {copied ? "Copié !" : "Partager"}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Download size={14} />
                Exporter
              </button>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div
            className="rounded-xl p-4 md:p-6"
            style={{ backgroundColor: "var(--color-bg-card)" }}
          >
            <SimulatorForm onChange={handleChange} initialValues={initialValues} />
          </div>

          <div
            ref={resultsRef}
            className="rounded-xl p-4 md:p-6"
            style={{ backgroundColor: "var(--color-bg-card)" }}
          >
            <ResultsPanel
              result={result}
              symbol={formValues?.cryptoSymbol ?? ""}
              isLoading={isLoading}
              error={errorMessage}
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          Les résultats présentés sont des simulations rétrospectives basées sur des données
          historiques. Ils ne constituent pas un conseil en investissement.
        </p>
      </div>
    </div>
  );
}

export default function SimulateurCryptoPage() {
  return (
    <Suspense>
      <SimulateurCryptoContent />
    </Suspense>
  );
}
