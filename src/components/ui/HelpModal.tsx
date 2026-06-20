"use client";

import { useEffect, useRef } from "react";
import { X, TrendingUp, RefreshCcw, BarChart2, Lightbulb, AlertTriangle } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = { num: string; text: string };
type Chart = { name: string; color: string; desc: string };
type Kpi = { label: string; desc: string };

type Section =
  | { icon: React.ElementType; color: string; title: string; content: string; warning?: boolean }
  | { icon: React.ElementType; color: string; title: string; steps: Step[] }
  | { icon: React.ElementType; color: string; title: string; charts: Chart[] }
  | { icon: React.ElementType; color: string; title: string; kpis: Kpi[] };

const SECTIONS: Section[] = [
  {
    icon: TrendingUp,
    color: "#1098F7",
    title: "C'est quoi le DCA ?",
    content:
      "Le Dollar Cost Averaging (DCA) consiste à investir un montant fixe à intervalles réguliers — chaque semaine, mois, etc. — quelle que soit le prix du marché. Cette stratégie lisse votre prix d'achat moyen dans le temps et réduit l'impact de la volatilité.",
  },
  {
    icon: RefreshCcw,
    color: "#22c55e",
    title: "Comment utiliser le simulateur ?",
    steps: [
      { num: "1", text: "Choisissez une cryptomonnaie (Bitcoin, Ethereum…)" },
      { num: "2", text: "Définissez le montant à investir et la fréquence (mensuel, hebdo, unique)" },
      { num: "3", text: "Sélectionnez la période de début et de fin" },
      { num: "4", text: "Les résultats s'affichent instantanément" },
    ],
  },
  {
    icon: BarChart2,
    color: "#eab308",
    title: "Lire les graphiques",
    charts: [
      {
        name: "Historique",
        color: "#93c5fd",
        desc: "Montre l'évolution de la valeur de votre portefeuille (bleu), du prix du token (orange), de la somme investie (violet) et des tokens accumulés (jaune) au fil du temps.",
      },
      {
        name: "Gains / Pertes",
        color: "#22c55e",
        desc: "Visualise si vous êtes en profit (zone verte) ou en perte (zone rouge) à chaque instant. La ligne jaune représente la valeur totale de votre portefeuille.",
      },
    ],
  },
  {
    icon: Lightbulb,
    color: "#f97316",
    title: "Chiffres clés expliqués",
    kpis: [
      { label: "Capital final", desc: "Valeur de vos tokens au prix du marché à la date de fin" },
      { label: "Plus-value", desc: "Différence entre le capital final et ce que vous avez investi" },
      { label: "Tokens acquis", desc: "Nombre total de tokens achetés pendant la période" },
      { label: "Prix moyen", desc: "Prix moyen auquel vous avez acheté vos tokens (DCA)" },
      { label: "Performance", desc: "Rendement total en % par rapport à la mise initiale" },
    ],
  },
  {
    icon: AlertTriangle,
    color: "#ef4444",
    title: "À retenir",
    warning: true,
    content:
      "Ce simulateur utilise des données historiques réelles (Binance, paires EUR depuis janv. 2020). Les performances passées ne garantissent pas les résultats futurs. Cet outil est pédagogique — il ne constitue pas un conseil en investissement.",
  },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#0b1120",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(16,152,247,0.15)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "#1098F7" }}>?</span>
            </div>
            <div>
              <h2 id="help-modal-title" className="text-white font-medium text-base">Guide du simulateur</h2>
              <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.35)" }}>
                Tout comprendre en 2 minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${section.color}18` }}
                  >
                    <Icon size={14} style={{ color: section.color }} />
                  </div>
                  <h3 className="text-white font-medium text-sm">{section.title}</h3>
                </div>

                {/* Content variants */}
                {"content" in section && (
                  <p
                    className="text-xs font-light leading-relaxed"
                    style={{ color: section.warning ? "#fca5a5" : "rgba(255,255,255,0.55)" }}
                  >
                    {section.content}
                  </p>
                )}

                {"steps" in section && (
                  <ol className="space-y-2">
                    {section.steps.map((s) => (
                      <li key={s.num} className="flex items-start gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                          style={{ backgroundColor: `${section.color}20`, color: section.color }}
                        >
                          {s.num}
                        </span>
                        <span className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {s.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                {"charts" in section && (
                  <div className="space-y-3">
                    {section.charts.map((c) => (
                      <div key={c.name} className="flex items-start gap-3">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <div>
                          <span className="text-xs font-medium" style={{ color: c.color }}>{c.name} — </span>
                          <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.5)" }}>{c.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {"kpis" in section && (
                  <dl className="space-y-2">
                    {section.kpis.map((k) => (
                      <div key={k.label} className="flex items-baseline gap-2">
                        <dt
                          className="text-xs font-medium shrink-0"
                          style={{ color: section.color, minWidth: 100 }}
                        >
                          {k.label}
                        </dt>
                        <dd className="text-xs font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {k.desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 shrink-0 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.25)" }}>
            Données Binance · Paires EUR · Depuis janv. 2020
          </p>
          <button
            onClick={onClose}
            className="text-xs font-light px-4 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: "rgba(16,152,247,0.12)",
              color: "#1098F7",
              border: "1px solid rgba(16,152,247,0.25)",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
