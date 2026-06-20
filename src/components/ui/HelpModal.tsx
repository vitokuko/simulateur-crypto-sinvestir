"use client";

import { useEffect, useRef } from "react";
import { X, TrendingUp, RefreshCcw, BarChart2, Lightbulb, AlertTriangle, HelpCircle, Target, BookOpen } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

type BulletItem = { text: string };

type Section =
  | { icon: React.ElementType; color: string; title: string; content: string; warning?: boolean }
  | { icon: React.ElementType; color: string; title: string; paras: string[] }
  | { icon: React.ElementType; color: string; title: string; paras: string[]; bullets: BulletItem[] }
  | { icon: React.ElementType; color: string; title: string; steps: { num: string; text: string }[] }
  | { icon: React.ElementType; color: string; title: string; charts: { name: string; color: string; desc: string }[] }
  | { icon: React.ElementType; color: string; title: string; kpis: { label: string; desc: string }[] };

const SECTIONS: Section[] = [
  {
    icon: BookOpen,
    color: "#1098F7",
    title: "Qu'est-ce que ce simulateur ?",
    paras: [
      "Grâce au simulateur de calcul de plus-value crypto, vous pouvez analyser plusieurs scénarios d'investissement à partir de données de marché historiques. L'outil permet d'étudier l'évolution passée d'un scénario défini, sur plus de 7 000 cryptomonnaies disponibles, dont le Bitcoin et l'Ethereum.",
      "Vous pouvez paramétrer différents modes d'investissement, qu'il s'agisse d'un investissement réalisé en une seule fois ou d'investissements réguliers à fréquence quotidienne, hebdomadaire ou mensuelle. Le simulateur vous permet également de sélectionner une date de début et une date de fin afin de cadrer précisément votre analyse.",
      "Cet outil a pour objectif de faciliter la simulation et la comparaison de scénarios, notamment dans le cadre d'une approche d'investissement progressif de type DCA, toujours sur la base de données passées.",
    ],
  },
  {
    icon: HelpCircle,
    color: "#22c55e",
    title: "À quoi sert un simulateur de plus-value crypto ?",
    paras: [
      "Un simulateur de plus-value crypto est avant tout un outil d'analyse et de compréhension. Il permet de mettre en perspective différents scénarios d'investissement à partir de données historiques, sans chercher à anticiper ou à prédire l'évolution future des marchés.",
      "Concrètement, le simulateur peut être utilisé pour :",
    ],
    bullets: [
      { text: "Estimer une plus-value ou une moins-value potentielle sur une période donnée, à partir d'un montant investi, d'une date de début et d'une date de fin, en s'appuyant exclusivement sur des données historiques." },
      { text: "Comparer différentes modalités d'investissement — investissement unique vs DCA — afin d'observer les écarts de résultats selon la méthode retenue." },
      { text: "Mesurer l'impact du timing, en testant plusieurs dates d'entrée et de sortie sur une même cryptomonnaie." },
      { text: "Comparer plusieurs cryptomonnaies sur une même période et avec des paramètres identiques." },
    ],
  },
  {
    icon: RefreshCcw,
    color: "#a78bfa",
    title: "Comment fonctionne le simulateur ?",
    paras: [
      "Le simulateur repose sur un principe simple : vous définissez un scénario précis, et l'outil calcule automatiquement le résultat correspondant à partir de données de marché historiques.",
    ],
    steps: [
      { num: "1", text: "Sélectionnez la cryptomonnaie parmi plus de 7 000 actifs numériques disponibles." },
      { num: "2", text: "Indiquez le montant à allouer à votre scénario de simulation." },
      { num: "3", text: "Choisissez la fréquence : investissement unique, quotidien, hebdomadaire ou mensuel." },
      { num: "4", text: "Définissez la date de début et la date de fin de votre période d'analyse." },
      { num: "5", text: "Les résultats s'affichent automatiquement — performance, capital final, gains ou pertes." },
    ],
  },
  {
    icon: TrendingUp,
    color: "#1098F7",
    title: "C'est quoi le DCA ?",
    content:
      "Le Dollar Cost Averaging (DCA) consiste à investir un montant fixe à intervalles réguliers — chaque semaine, mois, etc. — quelle que soit le prix du marché. Cette stratégie lisse votre prix d'achat moyen dans le temps et réduit l'impact de la volatilité.",
  },
  {
    icon: Target,
    color: "#f97316",
    title: "Quelles stratégies peut-on simuler ?",
    paras: [
      "Le simulateur permet d'analyser plusieurs approches d'investissement distinctes, toujours dans une logique de simulation rétrospective.",
    ],
    bullets: [
      { text: "Investissement en une seule fois — observer comment la valeur aurait évolué à partir d'un point d'entrée unique." },
      { text: "Investissement progressif (DCA) — apports réguliers quotidiens, hebdomadaires ou mensuels, avec calcul de chaque achat successif." },
      { text: "Comparaison de scénarios — faire varier la fréquence, les dates, les montants ou les cryptomonnaies pour mesurer l'influence de chaque paramètre." },
      { text: "Backtesting historique — analyser a posteriori des scénarios appliqués à des périodes de marché spécifiques." },
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
        desc: "Montre l'évolution de la valeur du portefeuille (bleu), du prix du token (orange), de la somme investie (violet) et des tokens accumulés (jaune) au fil du temps.",
      },
      {
        name: "Gains / Pertes",
        color: "#22c55e",
        desc: "Visualise si vous êtes en profit (zone verte) ou en perte (zone rouge) à chaque instant. La ligne jaune représente la valeur totale, le violet la somme investie, l'orange le prix.",
      },
    ],
  },
  {
    icon: Lightbulb,
    color: "#eab308",
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
    title: "Limites et précautions",
    warning: true,
    content:
      "Les cryptomonnaies sont des actifs caractérisés par une forte volatilité. Leur valeur peut évoluer de manière significative sur de courtes périodes. Les résultats affichés correspondent à des simulations rétrospectives basées sur des données historiques — ils ne constituent ni une prévision ni un conseil en investissement. Les performances passées ne préjugent en rien des performances futures. Les résultats ne tiennent pas compte de la situation personnelle, financière ou fiscale de chaque utilisateur, ni des frais liés à l'investissement.",
  },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // Reset scroll on open
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
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
                Tout comprendre en quelques minutes
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
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${section.color}18` }}
                  >
                    <Icon size={14} style={{ color: section.color }} />
                  </div>
                  <h3 className="text-white font-medium text-sm">{section.title}</h3>
                </div>

                {/* Plain content */}
                {"content" in section && (
                  <p
                    className="text-xs font-light leading-relaxed"
                    style={{ color: section.warning ? "#fca5a5" : "rgba(255,255,255,0.55)" }}
                  >
                    {section.content}
                  </p>
                )}

                {/* Paragraphs only */}
                {"paras" in section && !("bullets" in section) && !("steps" in section) && (
                  <div className="space-y-2">
                    {(section as { paras: string[] }).paras.map((p, j) => (
                      <p key={j} className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {/* Paragraphs + bullets */}
                {"paras" in section && "bullets" in section && !("steps" in section) && (
                  <div className="space-y-3">
                    {(section as { paras: string[]; bullets: BulletItem[] }).paras.map((p, j) => (
                      <p key={j} className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {p}
                      </p>
                    ))}
                    <ul className="space-y-2 mt-1">
                      {(section as { paras: string[]; bullets: BulletItem[] }).bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                          <span className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                            {b.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Paragraphs + steps */}
                {"paras" in section && "steps" in section && (
                  <div className="space-y-3">
                    {(section as { paras: string[]; steps: { num: string; text: string }[] }).paras.map((p, j) => (
                      <p key={j} className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {p}
                      </p>
                    ))}
                    <ol className="space-y-2 mt-1">
                      {(section as { paras: string[]; steps: { num: string; text: string }[] }).steps.map((s) => (
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
                  </div>
                )}

                {/* Steps only */}
                {"steps" in section && !("paras" in section) && (
                  <ol className="space-y-2">
                    {(section as { steps: { num: string; text: string }[] }).steps.map((s) => (
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

                {/* Charts */}
                {"charts" in section && (
                  <div className="space-y-3">
                    {(section as { charts: { name: string; color: string; desc: string }[] }).charts.map((c) => (
                      <div key={c.name} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: c.color }} />
                        <div>
                          <span className="text-xs font-medium" style={{ color: c.color }}>{c.name} — </span>
                          <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.5)" }}>{c.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* KPIs */}
                {"kpis" in section && (
                  <dl className="space-y-2">
                    {(section as { kpis: { label: string; desc: string }[] }).kpis.map((k) => (
                      <div key={k.label} className="flex items-baseline gap-2">
                        <dt className="text-xs font-medium shrink-0" style={{ color: section.color, minWidth: 110 }}>
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
