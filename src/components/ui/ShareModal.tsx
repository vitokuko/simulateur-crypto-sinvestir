"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Link, Check, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { SimulationResult } from "@/types/simulator";
import type { Frequency } from "@/types/simulator";
import { SimulationShareCard } from "@/components/simulator/SimulationShareCard";
import { SINVESTIR_LOGO_DATA_URL } from "@/lib/logoDataUrl";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  result: SimulationResult;
  symbol: string;
  frequency: Frequency | undefined;
  startDate: string;
  endDate: string;
  url: string;
}

const FREQUENCY_LABELS: Record<Frequency, string> = {
  "one-shot": "investissement unique",
  daily: "DCA quotidien",
  weekly: "DCA hebdo",
  monthly: "DCA mensuel",
};

const SOCIAL_BUTTONS = [
  {
    id: "twitter",
    label: "Twitter / X",
    color: "#fff",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
    getUrl: (text: string, _url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    bg: "rgba(10,102,194,0.08)",
    border: "rgba(10,102,194,0.3)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (text: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    bg: "rgba(37,211,102,0.08)",
    border: "rgba(37,211,102,0.25)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (text: string, _url: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
];

export function ShareModal({ open, onClose, result, symbol, frequency, startDate, endDate, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const freq = frequency ? FREQUENCY_LABELS[frequency] : "DCA";
  const gain = result.gainLossPercent >= 0
    ? `+${result.gainLossPercent.toFixed(1)}%`
    : `${result.gainLossPercent.toFixed(1)}%`;
  const shareText = `J'ai simulé un ${freq} sur ${symbol} avec le simulateur S'investir 📈\n\n💰 Capital final : ${result.finalValue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}\n📊 Performance : ${gain}\n\nSimule tes gains crypto 👇\n${url}`;

  // Generate image when modal opens
  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      setImageDataUrl(dataUrl);
    } catch {
      // silently fail — download button will try again
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (!open) { setImageDataUrl(null); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(generateImage, 300);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, onClose, generateImage]);

  if (!open) return null;

  async function handleDownload() {
    if (imageDataUrl) {
      const link = document.createElement("a");
      link.download = `simulation-${symbol}-${new Date().toISOString().split("T")[0]}.png`;
      link.href = imageDataUrl;
      link.click();
      return;
    }
    // Fallback: regenerate
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `simulation-${symbol}-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setGenerating(false);
    }
  }

  function handleSocialShare(getUrl: (text: string, url: string) => string) {
    // Download image first, then open social
    if (imageDataUrl) {
      const link = document.createElement("a");
      link.download = `simulation-${symbol}.png`;
      link.href = imageDataUrl;
      link.click();
    }
    setTimeout(() => {
      window.open(getUrl(shareText, url), "_blank", "noopener,noreferrer");
    }, 400);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Hidden card for capture — off screen */}
      <div
        style={{ position: "fixed", top: -9999, left: -9999, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div ref={cardRef}>
          <SimulationShareCard
            result={result}
            symbol={symbol}
            frequency={frequency}
            startDate={startDate}
            endDate={endDate}
            logoDataUrl={SINVESTIR_LOGO_DATA_URL}
          />
        </div>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#0b1120",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <h2 id="share-modal-title" className="text-white font-medium text-base">
              Partager mes résultats
            </h2>
            <p className="text-xs font-light mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Télécharge ton image ou partage sur les réseaux
            </p>
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

        <div className="px-6 py-5 space-y-4">
          {/* Image preview — cropped to top (header + KPIs only) */}
          <div
            className="rounded-xl overflow-hidden relative"
            style={{
              backgroundColor: "#0d1a2d",
              border: "1px solid rgba(255,255,255,0.08)",
              height: 160,
            }}
          >
            {generating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "#1098F7" }} />
              </div>
            )}
            {imageDataUrl && !generating && (
              <>
                <img
                  src={imageDataUrl}
                  alt="Aperçu de ta simulation"
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                  }}
                />
                {/* fade bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-10"
                  style={{ background: "linear-gradient(to bottom, transparent, #0d1a2d)" }}
                />
                <p
                  className="absolute bottom-2 right-3 text-xs font-light"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Aperçu partiel · image complète au téléchargement
                </p>
              </>
            )}
          </div>

          {/* Download button — primary */}
          <button
            onClick={handleDownload}
            disabled={generating}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3.5 font-light text-sm transition-all duration-200"
            style={{
              background: generating ? "rgba(16,152,247,0.2)" : "linear-gradient(to right, #1098F7, #0049C6)",
              color: "#fff",
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating
              ? <><Loader2 size={16} className="animate-spin" /> Génération en cours…</>
              : <><Download size={16} /> Télécharger l&apos;image</>
            }
          </button>

          {/* Social buttons */}
          <div>
            <p className="text-xs font-light mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              Partager sur les réseaux — l&apos;image sera téléchargée automatiquement
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL_BUTTONS.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleSocialShare(btn.getUrl)}
                  className="flex flex-col items-center gap-2 rounded-xl py-3.5 px-2 transition-all duration-200"
                  style={{
                    backgroundColor: btn.bg,
                    border: `1px solid ${btn.border}`,
                    color: btn.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {btn.icon}
                  <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all duration-200"
            style={{
              backgroundColor: copied ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)" }}
              >
                {copied
                  ? <Check size={15} style={{ color: "#22c55e" }} />
                  : <Link size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
                }
              </div>
              <div className="text-left">
                <p className="text-sm font-light" style={{ color: copied ? "#22c55e" : "rgba(255,255,255,0.7)" }}>
                  {copied ? "Lien copié !" : "Copier le lien"}
                </p>
                <p className="text-xs font-light truncate max-w-[220px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {url}
                </p>
              </div>
            </div>
            <span className="text-xs font-light shrink-0" style={{ color: copied ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
              {copied ? "✓" : "Copier"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
