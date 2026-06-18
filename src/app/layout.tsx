import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} h-full flex`}>
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
