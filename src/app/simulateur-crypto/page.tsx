"use client";

import { useState, useMemo, useCallback, useRef, Suspense } from "react";
import { toPng } from "html-to-image";
import { Share2, Download, Info } from "lucide-react";
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
      <div className="max-w-5xl mx-auto">
        {/* Title block */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div
              className="h-px flex-1 max-w-12"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <h1
              className="text-2xl font-bold tracking-widest uppercase"
              style={{ color: "var(--color-text-primary)" }}
            >
              SIMULATEUR CRYPTO
            </h1>
            <div
              className="h-px flex-1 max-w-12"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          </div>
          <p className="text-base font-medium mb-4" style={{ color: "var(--color-accent)" }}>
            Simulez vos gains crypto en DCA ou en investissement unique
          </p>
          <p
            className="text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Combien peut vous rapporter un investissement en crypto en fonction du montant investi,
            de la fréquence des achats et de la période choisie ? Grâce au simulateur
            S&apos;investir, visualisez la puissance du DCA sur vos actifs numériques préférés.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="flex gap-3 rounded-xl px-4 py-3 mb-8 text-sm"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderLeft: "3px solid var(--color-accent)",
          }}
        >
          <Info size={16} className="shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }} />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Cet outil a uniquement une vocation pédagogique et illustrative. Il permet de visualiser
            l&apos;effet des achats réguliers dans le temps à partir de données historiques réelles,
            sans constituer un conseil en investissement ni une promesse de performance.
          </p>
        </div>

        {/* Main layout: form left, results right */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form — fixed width on desktop */}
          <div className="lg:w-80 shrink-0">
            <SimulatorForm onChange={handleChange} initialValues={initialValues} />
          </div>

          {/* Results — takes remaining space */}
          <div className="flex-1 min-w-0">
            {/* Action buttons */}
            {result && (
              <div className="flex gap-2 mb-4 justify-end">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    color: copied ? "var(--color-success)" : "var(--color-text-secondary)",
                    backgroundColor: "var(--color-bg-card)",
                  }}
                >
                  <Share2 size={13} />
                  {copied ? "Lien copié !" : "Partager"}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-secondary)",
                    backgroundColor: "var(--color-bg-card)",
                  }}
                >
                  <Download size={13} />
                  Exporter PNG
                </button>
              </div>
            )}

            <div ref={resultsRef}>
              <ResultsPanel
                result={result}
                symbol={formValues?.cryptoSymbol ?? ""}
                isLoading={isLoading}
                error={errorMessage}
              />
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <p
          className="mt-10 text-xs text-center leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Les résultats présentés sont des simulations rétrospectives basées sur des données
          historiques. Ils ne constituent pas un conseil en investissement, en fiscalité ou une
          recommandation personnalisée.
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
