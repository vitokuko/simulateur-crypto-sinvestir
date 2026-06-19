"use client";

import { useState, useMemo, useCallback, useRef, Suspense } from "react";
import { toPng } from "html-to-image";
import { Info, BarChart2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import { ResultsPanel } from "@/components/simulator/ResultsPanel";
import { PriceChart } from "@/components/simulator/PriceChart";
import { useHistoricalPrices } from "@/hooks/useHistoricalPrices";
import { useUrlSync } from "@/hooks/useUrlSync";
import { calculateSimulation } from "@/lib/calculations/simulator";
import type { SimulatorFormInput } from "@/lib/validators/simulator";

const API_ERRORS: Record<string, string> = {
  NOT_FOUND: "Aucune donnée disponible pour cette cryptomonnaie.",
  NO_DATA: "Aucune donnée disponible pour cette période. Essayez une date de début ultérieure.",
  API_ERROR: "Une erreur est survenue lors de la récupération des données. Réessayez.",
};

function formatEur(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function SimulateurCryptoContent() {
  const { pushToUrl, readFromUrl } = useUrlSync();
  const { showToast } = useToast();
  const initialValues = readFromUrl();
  const [formValues, setFormValues] = useState<SimulatorFormInput | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"chart" | "calendar">("chart");
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
    showToast("Lien copié dans le presse-papiers !");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleExport() {
    if (!resultsRef.current) return;
    try {
      const png = await toPng(resultsRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `simulation-${formValues?.cryptoSymbol ?? "crypto"}.png`;
      link.href = png;
      link.click();
    } catch {
      showToast("Impossible d'exporter la simulation");
    }
  }

  return (
    <div className="space-y-16" ref={resultsRef}>
      {/* Title block */}
      <div className="w-full px-2 text-center space-y-3 sm:space-y-4 mt-10">
        <h1 className="flex justify-center items-center gap-x-4">
          <svg className="hidden md:block" width="50" height="2" viewBox="0 0 50 2" fill="none">
            <line y1="1" x2="50" y2="1" stroke="url(#gl1)" strokeWidth="2" />
            <defs>
              <linearGradient id="gl1" x1="0" y1="2" x2="50" y2="2" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1098F7" stopOpacity="0" />
                <stop offset="1" stopColor="#1098F7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl sm:text-3xl font-normal sm:font-medium uppercase text-white text-balance">
            SIMULATEUR CRYPTO DCA
          </span>
          <svg className="hidden md:block" width="50" height="2" viewBox="0 0 50 2" fill="none">
            <line y1="1" x2="50" y2="1" stroke="url(#gl2)" strokeWidth="2" />
            <defs>
              <linearGradient id="gl2" x1="0" y1="2" x2="50" y2="2" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1098F7" />
                <stop offset="1" stopColor="#1098F7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </h1>
        <h2
          className="text-sm sm:text-lg font-light text-balance lg:max-w-[80%] mx-auto"
          style={{ color: "#1098F7" }}
        >
          Simulez vos gains crypto en DCA ou en investissement unique
        </h2>
        <p className="text-white leading-relaxed text-xs sm:text-sm font-light max-w-3xl mx-auto text-balance">
          Combien peut vous rapporter un investissement en crypto en fonction du montant investi, de
          la fréquence des achats et de la période choisie ? Grâce au simulateur S&apos;investir,
          visualisez la puissance du DCA sur vos actifs numériques préférés, à partir de données
          historiques réelles.
        </p>
        <div
          className="flex justify-center items-center gap-x-4 rounded-2xl p-4 backdrop-blur max-w-3xl mx-auto"
          style={{
            backgroundColor: "rgba(16,152,247,0.05)",
            border: "1px solid rgba(16,152,247,0.1)",
          }}
        >
          <div className="shrink-0">
            <Info
              size={24}
              className="rounded-full p-0.5"
              style={{ color: "#1098F7", backgroundColor: "rgba(16,152,247,0.1)" }}
            />
          </div>
          <p className="text-xs sm:text-sm font-light text-left" style={{ color: "#7899ce" }}>
            Cet outil a uniquement une vocation pédagogique et illustrative. Il permet de visualiser
            l&apos;effet des achats réguliers dans le temps à partir de données historiques réelles,
            sans constituer un conseil en investissement ni une promesse de performance.
          </p>
        </div>
      </div>

      {/* Grid: form (2/5) + KPIs (3/5) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Form + buttons */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <SimulatorForm onChange={handleChange} initialValues={initialValues} />

          <div className="grid w-full gap-2 sm:grid-cols-2 mt-6">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 px-4 sm:px-10 py-4 text-sm text-white w-full max-w-[350px] mx-auto border border-transparent"
              style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
            >
              Enregistrer la simulation
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 px-4 sm:px-10 py-4 text-sm w-full max-w-[350px] mx-auto border"
              style={{
                backgroundColor: copied ? "transparent" : "#fff",
                color: copied ? "#fff" : "#0b0f1a",
                borderColor: "#fff",
              }}
            >
              {copied ? "Lien copié !" : "Partager mes résultats"}
            </button>
          </div>
        </div>

        {/* KPI cards only */}
        <div className="md:col-span-3">
          <ResultsPanel
            result={result}
            symbol={formValues?.cryptoSymbol ?? ""}
            frequency={formValues?.frequency}
            amount={formValues?.amount}
            isLoading={isLoading}
            error={errorMessage}
          />
        </div>
      </div>

      {/* Chart section — full width, below the grid */}
      {result && (
        <div className="space-y-12">
          {/* Tab switcher centered */}
          <div className="text-center">
            <div
              role="tablist"
              className="inline-flex flex-row items-center rounded-full relative p-2.5 gap-2.5 border border-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <button
                role="tab"
                onClick={() => setTab("chart")}
                aria-selected={tab === "chart"}
                className="relative flex items-center rounded-full focus:outline-none transition-colors z-10 cursor-pointer py-3 px-6 gap-3"
                style={{
                  backgroundColor: tab === "chart" ? "rgba(255,255,255,0.05)" : "transparent",
                  color: tab === "chart" ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              >
                <BarChart2 size={18} />
                <span className="font-light text-sm">Graphiques</span>
              </button>
              <button
                role="tab"
                onClick={() => setTab("calendar")}
                aria-selected={tab === "calendar"}
                className="relative flex items-center rounded-full focus:outline-none transition-colors z-10 cursor-pointer py-3 px-6 gap-3"
                style={{
                  backgroundColor: tab === "calendar" ? "rgba(255,255,255,0.05)" : "transparent",
                  color: tab === "calendar" ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              >
                <Calendar size={18} />
                <span className="font-light text-sm">Calendrier</span>
              </button>
            </div>
          </div>

          {tab === "chart" && (
            <div className="space-y-10">
              {/* Mini KPIs row */}
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
                    <p className="text-white font-normal text-3xl mt-2 tabular-nums">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <PriceChart data={result.chartData} symbol={formValues?.cryptoSymbol ?? ""} />
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

      {/* Footer */}
      <div className="space-y-10">
        <hr style={{ borderColor: "rgba(120,153,206,0.2)" }} />
        <p
          className="text-xs font-light text-center text-balance"
          style={{ color: "rgba(120,153,206,0.6)" }}
        >
          Les simulateurs proposés sont mis à disposition gratuitement, à des fins exclusivement
          pédagogiques et informatives. Ils ne constituent en aucun cas un conseil en
          investissement, en fiscalité ou une recommandation personnalisée. Investir comporte des
          risques, y compris de perte en capital. Les performances passées ne préjugent en rien des
          performances futures.
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
