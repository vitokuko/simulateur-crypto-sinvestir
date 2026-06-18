import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-20">
      <div className="max-w-xl text-center space-y-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
          style={{ backgroundColor: "var(--color-bg-card)" }}
        >
          <TrendingUp size={32} style={{ color: "var(--color-accent)" }} />
        </div>

        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          Simulateur Crypto
        </h1>

        <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Analysez vos investissements en cryptomonnaies sur données historiques. Stratégie DCA ou
          investissement unique — visualisez ce que votre capital aurait généré.
        </p>

        <Link
          href="/simulateur-crypto"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          Lancer le simulateur
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
