"use client";

import { useState, useMemo, useCallback } from "react";
import { Info, BarChart2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { HelpModal } from "@/components/ui/HelpModal";
import { ShareModal } from "@/components/ui/ShareModal";
import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import { ResultsPanel } from "@/components/simulator/ResultsPanel";
import { PriceChart } from "@/components/simulator/PriceChart";
import { useHistoricalPrices } from "@/hooks/useHistoricalPrices";
import { useUrlSync } from "@/hooks/useUrlSync";
import { calculateSimulation } from "@/lib/calculations/simulator";
import type { SimulatorFormInput } from "@/lib/validators/simulator";
import type { Frequency } from "@/types/simulator";
import { formatEur } from "@/lib/utils/formatters";

export interface CryptoSimulatorProps {
  /** Pre-select a crypto by symbol (e.g. "BTC", "ETH"). Defaults to empty (user picks). */
  defaultCrypto?: string;
  /** Default investment amount in EUR. */
  defaultAmount?: number;
  /** Default investment frequency. */
  defaultFrequency?: Frequency;
  /** Sync form state to URL query params. Disable when embedding in an iframe or external page. */
  syncUrl?: boolean;
  /** Called whenever the simulation result changes. Useful for parent-level analytics or callbacks. */
  onResult?: (result: { finalValue: number; gainLoss: number; gainLossPercent: number } | null) => void;
}

const API_ERRORS: Record<string, string> = {
  NOT_FOUND: "Aucune donnée disponible pour cette cryptomonnaie.",
  NO_DATA: "Aucune donnée disponible pour cette période. Essayez une date de début ultérieure.",
  API_ERROR: "Une erreur est survenue lors de la récupération des données. Réessayez.",
};

export function CryptoSimulator({
  defaultCrypto,
  defaultAmount,
  defaultFrequency,
  syncUrl = true,
  onResult,
}: CryptoSimulatorProps) {
  const { pushToUrl, readFromUrl } = useUrlSync();
  const { showToast } = useToast();

  const urlValues = syncUrl ? readFromUrl() : null;
  const initialValues = urlValues ?? {
    ...(defaultCrypto ? { cryptoSymbol: defaultCrypto } : {}),
    ...(defaultAmount ? { amount: defaultAmount } : {}),
    ...(defaultFrequency ? { frequency: defaultFrequency } : {}),
  };

  const [formValues, setFormValues] = useState<SimulatorFormInput | null>(null);
  const [tab, setTab] = useState<"chart" | "calendar">("chart");
  const [helpOpen, setHelpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleChange = useCallback(
    (values: SimulatorFormInput | null) => {
      setFormValues(values);
      if (syncUrl && values) pushToUrl(values);
    },
    [syncUrl, pushToUrl]
  );

  const { data: prices, isLoading, isFetching, error } = useHistoricalPrices(
    formValues?.cryptoId ?? "",
    formValues?.startDate ?? "",
    formValues?.endDate ?? "",
    !!formValues
  );

  const result = useMemo(() => {
    if (!prices || !formValues) {
      onResult?.(null);
      return null;
    }
    const r = calculateSimulation(
      prices,
      formValues.amount,
      formValues.frequency,
      formValues.startDate,
      formValues.endDate
    );
    onResult?.({ finalValue: r.finalValue, gainLoss: r.gainLoss, gainLossPercent: r.gainLossPercent });
    return r;
  }, [prices, formValues, onResult]);

  const errorMessage = error
    ? (API_ERRORS[error.message] ?? API_ERRORS.API_ERROR)
    : null;

  return (
    <>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      {result && formValues && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          result={result}
          symbol={formValues.cryptoSymbol}
          frequency={formValues.frequency}
          startDate={formValues.startDate}
          endDate={formValues.endDate}
          url={typeof window !== "undefined" ? window.location.href : ""}
        />
      )}

      {/* Floating help button */}
      <button
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: "#1098F7", boxShadow: "0 4px 20px rgba(16,152,247,0.4)" }}
        title="Guide d'utilisation"
        aria-label="Ouvrir le guide d'utilisation"
      >
        <span className="text-white font-semibold text-base leading-none">?</span>
      </button>

      <div className="space-y-16">
        {/* Grid: form + KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2 flex flex-col justify-between">
            <SimulatorForm
              onChange={handleChange}
              initialValues={initialValues}
            />

            <div className="grid w-full gap-2 sm:grid-cols-2 mt-6">
              <button
                type="button"
                onClick={() => showToast("Fonctionnalité bientôt disponible !")}
                className="inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 px-4 sm:px-10 py-4 text-sm text-white w-full max-w-[350px] mx-auto border border-transparent"
                style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
              >
                Enregistrer la simulation
              </button>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 px-4 sm:px-10 py-4 text-sm w-full max-w-[350px] mx-auto border"
                style={{ backgroundColor: "#fff", color: "#0b0f1a", borderColor: "#fff" }}
              >
                Partager mes résultats
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <ResultsPanel
              result={result}
              symbol={formValues?.cryptoSymbol ?? ""}
              frequency={formValues?.frequency}
              amount={formValues?.amount}
              isLoading={isLoading}
              isFetching={isFetching}
              error={errorMessage}
            />
          </div>
        </div>

        {/* Charts */}
        {result && (
          <div className="space-y-12">
            <div className="text-center">
              <div
                role="tablist"
                className="inline-flex flex-row items-center rounded-full relative p-2.5 gap-2.5 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                {[
                  { id: "chart" as const, icon: <BarChart2 size={18} />, label: "Graphiques" },
                  { id: "calendar" as const, icon: <Calendar size={18} />, label: "Calendrier" },
                ].map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    onClick={() => setTab(t.id)}
                    aria-selected={tab === t.id}
                    className="relative flex items-center rounded-full focus:outline-none transition-colors z-10 cursor-pointer py-3 px-6 gap-3"
                    style={{
                      backgroundColor: tab === t.id ? "rgba(255,255,255,0.05)" : "transparent",
                      color: tab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {t.icon}
                    <span className="font-light text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {tab === "chart" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
                  {[
                    { label: "Capital final", value: formatEur(result.finalValue) },
                    { label: "Intérêts gagnés", value: formatEur(result.gainLoss) },
                    { label: "Somme investie", value: formatEur(result.totalInvested) },
                  ].map((item) => (
                    <div key={item.label} className="mx-auto w-full min-w-0 text-center sm:text-left">
                      <p
                        className="font-light text-sm flex items-center justify-center sm:justify-start gap-1.5"
                        style={{ color: "#7899ce" }}
                      >
                        {item.label}
                        <Info size={13} style={{ color: "#7899ce" }} className="shrink-0" />
                      </p>
                      <p className="text-white font-normal text-3xl mt-2 tabular-nums">{item.value}</p>
                    </div>
                  ))}
                </div>
                <PriceChart data={result.chartData} />
              </div>
            )}

            {tab === "calendar" && (
              <div
                className="rounded-2xl p-6 flex items-center justify-center min-h-40 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <p className="text-sm font-light" style={{ color: "#7899ce" }}>
                  Vue calendrier — prochainement
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
