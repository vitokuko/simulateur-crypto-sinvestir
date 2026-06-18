"use client";

import { useState, useMemo } from "react";
import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import { ResultsPanel } from "@/components/simulator/ResultsPanel";
import { useHistoricalPrices } from "@/hooks/useHistoricalPrices";
import { calculateSimulation } from "@/lib/calculations/simulator";
import type { SimulatorFormInput } from "@/lib/validators/simulator";

const API_ERRORS: Record<string, string> = {
  RATE_LIMIT: "Les données sont temporairement indisponibles. Réessayez dans quelques instants.",
  NOT_FOUND: "Aucune donnée disponible pour cette cryptomonnaie.",
  NO_DATA: "Aucune donnée disponible pour cette période. Essayez une date de début ultérieure.",
  API_ERROR: "Une erreur est survenue lors de la récupération des données. Réessayez.",
};

export default function SimulateurCryptoPage() {
  const [formValues, setFormValues] = useState<SimulatorFormInput | null>(null);

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

  return (
    <div className="min-h-full p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Simulateur Crypto
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Analysez vos investissements sur données historiques — DCA ou investissement unique.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <SimulatorForm onSubmit={setFormValues} isLoading={isLoading} />
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <ResultsPanel
              result={result}
              symbol={formValues?.cryptoSymbol ?? ""}
              isLoading={isLoading}
              error={errorMessage}
            />
          </div>
        </div>

        <p className="mt-8 text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          Les résultats présentés sont des simulations rétrospectives basées sur des données
          historiques. Ils ne constituent pas un conseil en investissement.
        </p>
      </div>
    </div>
  );
}
