"use client";

import { Suspense } from "react";
import { Info } from "lucide-react";
import { CryptoSimulator } from "@/components/simulator/CryptoSimulator";

function SimulateurCryptoContent() {
  return (
    <div className="space-y-16">
      {/* Hero */}
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

      {/* Simulator — self-contained, embeddable */}
      <CryptoSimulator syncUrl />
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
