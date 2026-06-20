import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simulateur Crypto — S'investir",
  description:
    "Simulez vos investissements en cryptomonnaies avec la stratégie DCA ou en one-shot sur données historiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.className} ${lexend.variable} min-h-screen`}
        style={{ background: "#0B0F1A" }}
      >
        <Providers>
          <Sidebar />
          {/* Background SVG glow */}
          <svg
            className="pointer-events-none fixed z-0 top-0 right-0 w-[71%]"
            style={{ aspectRatio: "1310/1245" }}
            viewBox="0 0 1310 1245"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f)">
              <path
                d="M526.422 -75.537C780.156 -222.031 1112.89 -120.749 1269.6 150.682C1426.31 422.113 1347.66 760.908 1093.92 907.402C840.188 1053.9 507.456 952.614 350.746 681.182C194.035 409.751 272.688 70.9566 526.422 -75.537ZM997.578 740.528C1165.16 643.775 1217.11 420.015 1113.61 240.745C1010.1 61.4757 790.348 -5.41685 622.767 91.3364C455.185 188.09 403.238 411.85 506.739 591.12C610.24 770.389 829.996 837.282 997.578 740.528Z"
                fill="url(#paint0_linear)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f"
                x="0"
                y="-412"
                width="1620"
                height="1657"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="135" result="effect1_foregroundBlur" />
              </filter>
              <linearGradient
                id="paint0_linear"
                x1="350"
                y1="681"
                x2="1270"
                y2="151"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.3" stopColor="#2945A8" stopOpacity="0" />
                <stop offset="1" stopColor="#2945A8" stopOpacity="0.66" />
              </linearGradient>
            </defs>
          </svg>

          <div id="main-content">
            {/* Sticky header */}
            <header className="flex h-20 shrink-0 items-center border-b border-white/10 gap-x-6 pl-6 lg:pl-8 mr-6">
              {/* Mobile hamburger — handled inside Sidebar */}
              <div className="flex justify-between w-full">
                <div className="flex items-start justify-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://sinvestir.fr/wp-content/uploads/2020/11/Logo-Sinvestir-Gold-Crop.svg"
                    alt="S'investir"
                    className="h-8 w-auto"
                  />
                  <span
                    className="text-white font-bold text-2xl tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-lexend)" }}
                  >
                    Simulateurs
                  </span>
                </div>
                <div className="hidden sm:flex items-end gap-x-6 lg:gap-x-8 font-light">
                  <a
                    href="https://sinvestir.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-white/70"
                  >
                    Découvrir S&apos;investir
                  </a>
                </div>
              </div>
            </header>

            <main className="pt-0 pb-10 sm:py-10 relative z-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>

            <footer className="space-y-10 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
              <hr className="border-[#7899ce33] h-[1px] w-full max-w-xl mx-auto" />
              <p className="text-[#7899ce99] text-xs font-light text-center text-balance">
                Les simulateurs proposés sont mis à disposition gratuitement, à des fins exclusivement pédagogiques et informatives. Ils ont pour but d&apos;aider les utilisateurs à mieux comprendre certaines notions ou à estimer des situations selon les informations saisies. Ils ne constituent en aucun cas un conseil en investissement, en fiscalité ou une recommandation personnalisée. Investir comporte des risques, y compris de perte en capital. Les performances passées ne préjugent en rien des performances futures. Les résultats obtenus ne doivent pas être interprétés comme des recommandations personnalisées ou des garanties de performance. Ils sont purement indicatifs et peuvent varier en fonction des données saisies. Chaque utilisateur demeure seul responsable de l&apos;usage qu&apos;il fait des résultats obtenus par le biais des simulateurs. L&apos;utilisation de ces outils ne saurait engager la responsabilité de l&apos;éditeur ou de son représentant légal, aux décisions prises sur leur base.
              </p>
              <p className="text-white text-sm font-light text-center text-balance">
                Copyright © 2026 |{" "}
                <a href="https://sinvestir.fr/conditions-generales-de-vente-et-d-utilisation/" rel="noopener noreferrer" target="_blank" className="hover:underline">CGVU</a>
                {" "}|{" "}
                <a href="https://sinvestir.fr/mentions_legales/" rel="noopener noreferrer" target="_blank" className="hover:underline">Mentions légales</a>
                {" "}|{" "}
                <a href="https://sinvestir.fr/politique-de-confidentialite/" rel="noopener noreferrer" target="_blank" className="hover:underline">Politique de confidentialité</a>
                {" "}|{" "}
                <a href="/notice" rel="noopener noreferrer" target="_blank" className="hover:underline">Notice simulateur</a>
                {" "}|{" "}
                <a href="https://github.com/vitokuko" rel="noopener noreferrer" target="_blank" className="hover:underline">Création Souaibou Mbouille Ndiaye</a>
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
