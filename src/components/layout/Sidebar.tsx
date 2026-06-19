"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

/* ── SVG icons ─────────────────────────────────────────────────────────── */

const IconDashboard = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M3 17.9C3 16.5 3 15.8 3.31 15.3C3.49 15.03 3.73 14.8 4.01 14.62C4.52 14.31 5.21 14.31 6.6 14.31C7.99 14.31 8.68 14.31 9.19 14.62C9.47 14.8 9.71 15.03 9.89 15.3C10.2 15.8 10.2 16.5 10.2 17.91C10.2 19.3 10.2 19.99 9.89 20.5C9.71 20.78 9.47 21.02 9.19 21.2C8.68 21.51 7.99 21.51 6.6 21.51C5.21 21.51 4.52 21.51 4.01 21.2C3.73 21.02 3.49 20.78 3.31 20.5C3 19.99 3 19.3 3 17.91Z"
      strokeWidth="1.5"
    />
    <path
      d="M13.8 17.9C13.8 16.5 13.8 15.8 14.11 15.3C14.29 15.03 14.53 14.8 14.81 14.62C15.32 14.31 16.01 14.31 17.4 14.31C18.79 14.31 19.48 14.31 19.99 14.62C20.27 14.8 20.51 15.03 20.69 15.3C21 15.8 21 16.5 21 17.91C21 19.3 21 19.99 20.69 20.5C20.51 20.78 20.27 21.02 19.99 21.2C19.48 21.51 18.79 21.51 17.4 21.51C16.01 21.51 15.32 21.51 14.81 21.2C14.53 21.02 14.29 20.78 14.11 20.5C13.8 19.99 13.8 19.3 13.8 17.91Z"
      strokeWidth="1.5"
    />
    <path
      d="M3 7.1C3 5.72 3 5.03 3.31 4.52C3.49 4.23 3.73 3.99 4.01 3.82C4.52 3.51 5.21 3.51 6.6 3.51C7.99 3.51 8.68 3.51 9.19 3.82C9.47 3.99 9.71 4.23 9.89 4.52C10.2 5.03 10.2 5.72 10.2 7.11C10.2 8.49 10.2 9.19 9.89 9.7C9.71 9.98 9.47 10.22 9.19 10.4C8.68 10.71 7.99 10.71 6.6 10.71C5.21 10.71 4.52 10.71 4.01 10.4C3.73 10.22 3.49 9.98 3.31 9.7C3 9.19 3 8.49 3 7.11Z"
      strokeWidth="1.5"
    />
    <path
      d="M13.8 7.1C13.8 5.72 13.8 5.03 14.11 4.52C14.29 4.23 14.53 3.99 14.81 3.82C15.32 3.51 16.01 3.51 17.4 3.51C18.79 3.51 19.48 3.51 19.99 3.82C20.27 3.99 20.51 4.23 20.69 4.52C21 5.03 21 5.72 21 7.11C21 8.49 21 9.19 20.69 9.7C20.51 9.98 20.27 10.22 19.99 10.4C19.48 10.71 18.79 10.71 17.4 10.71C16.01 10.71 15.32 10.71 14.81 10.4C14.53 10.22 14.29 9.98 14.11 9.7C13.8 9.19 13.8 8.49 13.8 7.11Z"
      strokeWidth="1.5"
    />
  </svg>
);

const IconSimulateurs = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M21 22.26C21.41 22.26 21.75 21.92 21.75 21.51C21.75 21.09 21.41 20.76 21 20.76V22.26ZM3.75 3.51C3.75 3.09 3.41 2.76 3 2.76C2.59 2.76 2.25 3.09 2.25 3.51H3.75ZM3 14.51H3.75V3.51H3H2.25V14.51H3ZM21 21.51V20.76H10V21.51V22.26H21V21.51ZM10 21.51V20.76C8.33 20.76 7.15 20.76 6.26 20.64C5.39 20.52 4.91 20.3 4.56 19.95L4.03 20.48L3.49 21.01C4.17 21.69 5.02 21.98 6.06 22.12C7.07 22.26 8.37 22.26 10 22.26V21.51ZM3 14.51H2.25C2.25 16.14 2.25 17.43 2.38 18.45C2.52 19.49 2.82 20.34 3.49 21.01L4.03 20.48L4.56 19.95C4.21 19.6 3.99 19.12 3.87 18.25C3.75 17.36 3.75 16.18 3.75 14.51H3ZM5 20.51L5.66 20.87C5.94 20.35 6.25 19.62 6.58 18.9C6.9 18.16 7.26 17.37 7.66 16.66C8.07 15.93 8.5 15.32 8.96 14.9C9.42 14.48 9.86 14.28 10.31 14.28V13.53V12.78C9.36 12.78 8.58 13.21 7.94 13.79C7.32 14.37 6.8 15.14 6.36 15.92C5.92 16.71 5.53 17.55 5.2 18.29C4.86 19.06 4.59 19.7 4.34 20.15L5 20.51ZM10.31 13.53V14.28C10.91 14.28 11.31 14.63 11.94 15.28C12.5 15.85 13.31 16.73 14.61 16.73V15.98V15.23C14.03 15.23 13.65 14.88 13.01 14.23C12.44 13.65 11.63 12.78 10.31 12.78V13.53ZM14.61 15.98V16.73C15.68 16.73 16.45 16.26 17.03 15.63C17.57 15.03 17.97 14.25 18.33 13.6C19.1 12.17 19.69 11.26 21 11.26V10.51V9.76C18.69 9.76 17.72 11.58 17.01 12.89C16.62 13.6 16.31 14.19 15.92 14.62C15.56 15.01 15.17 15.23 14.61 15.23V15.98ZM7 4.51V5.26H8V4.51V3.76H7V4.51ZM7 7.51V8.26H11V7.51V6.76H7V7.51ZM4.34 20.15C4.14 20.51 4.28 20.97 4.64 21.17C5 21.37 5.46 21.23 5.66 20.87L4.34 20.15ZM21 11.26C21.41 11.26 21.75 10.92 21.75 10.51C21.75 10.09 21.41 9.76 21 9.76V11.26Z"
      fill="currentColor"
    />
  </svg>
);

const IconComparateurs = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M8.25 3.75L13.5 3.75"
      stroke="currentColor"
      strokeWidth="1.13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.5L10.875 10.875"
      stroke="currentColor"
      strokeWidth="1.13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 8.25L3.75 13.5"
      stroke="currentColor"
      strokeWidth="1.13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="4.83" cy="4.83" r="3.33" stroke="currentColor" strokeWidth="1.13" />
    <circle cx="3.75" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.13" />
    <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.13" />
    <circle cx="15" cy="3.75" r="1.5" stroke="currentColor" strokeWidth="1.13" />
  </svg>
);

const IconSimulations = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M9 2.51H11C15.71 2.51 18.07 2.51 19.54 3.97C21 5.44 21 7.79 21 12.51V18.51M3 13.22V18.49C3 20.8 3 21.95 3.72 22.36C5.13 23.16 7.76 20.49 9.01 19.69C9.73 19.23 10.1 18.99 10.5 18.99C10.9 18.99 11.27 19.23 11.99 19.69C13.24 20.49 15.87 23.16 17.28 22.36C18 21.95 18 20.8 18 18.49V13.22C18 9.58 18 7.77 16.9 6.64C15.8 5.51 14.04 5.51 10.5 5.51C6.96 5.51 5.2 5.51 4.1 6.64C3 7.77 3 9.58 3 13.22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFormation = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 512 512"
    fill="none"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M256 104v56h56a56 56 0 1 0-56-56Zm0 0v56h-56a56 56 0 1 1 56-56Z"
    />
    <rect
      width="384"
      height="112"
      x="64"
      y="160"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      rx="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M416 272v144a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V272m160-112v304"
    />
  </svg>
);

const IconSettings = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M15.5 12.51a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M21.01 14.61c.52-.14.78-.21.9-.35.1-.13.1-.35.1-.78v-1.93c0-.43 0-.65-.1-.79-.1-.13-.38-.2-.9-.35-1.95-.52-3.17-2.56-2.67-4.5.14-.53.21-.8.15-.95-.07-.16-.26-.27-.64-.48l-1.72-.98c-.37-.21-.56-.32-.72-.29-.17.02-.35.2-.73.57-1.46 1.46-3.87 1.46-5.33-.02-.38-.37-.56-.56-.73-.58-.17-.02-.35.09-.72.3L6.15 4.47c-.38.22-.57.33-.63.49-.07.16 0 .42.14.95.5 1.94-.73 3.98-2.68 4.5-.52.14-.78.21-.9.35-.1.14-.1.35-.1.79v1.93c0 .43 0 .65.1.78.1.14.38.21.9.35 1.95.53 3.16 2.57 2.66 4.5-.14.53-.21.8-.15.95.07.16.26.27.63.49l1.72.98c.38.21.56.32.73.3.17-.03.35-.21.72-.58 1.46-1.46 3.87-1.46 5.33-.02.38.38.56.56.73.58.17.02.35-.09.72-.3l1.73-.98c.38-.22.57-.33.63-.49.07-.16 0-.42-.14-.95-.5-1.94.72-3.98 2.67-4.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconLightbulb = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M12 2a7 7 0 0 1 4 12.8V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.2A7 7 0 0 1 12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 21h6M10 18v3M14 18v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconLogout = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M14 3.6c-.46-.06-.93-.09-1.4-.09C7.3 3.51 3 7.54 3 12.51S7.3 21.51 12.6 21.51c.47 0 .94-.03 1.4-.1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M21 12.51H11M21 12.51c0-.7-2-2.01-2.5-2.5M21 12.51c0 .7-2 2.01-2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChevron = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    className="h-5 w-5 transform transition-transform duration-300 relative -left-0.5"
  >
    <path
      d="M15 6.51s-6 4.42-6 6c0 1.58 6 6 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Nav items ──────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: "/", label: "Tableau de bord", icon: <IconDashboard /> },
  { href: "/simulateur-crypto", label: "Les simulateurs", icon: <IconSimulateurs /> },
  { href: "/comparateurs", label: "Les comparateurs", icon: <IconComparateurs /> },
  { href: "/mes-simulations", label: "Mes simulations", icon: <IconSimulations /> },
  { href: "/formation", label: "Formation offerte", icon: <IconFormation /> },
];

/* ── NavContent ─────────────────────────────────────────────────────────── */

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const { showToast } = useToast();

  return (
    <div
      className="py-6 px-0 flex grow flex-col gap-y-10 overflow-y-auto border border-white/10 rounded-2xl"
      style={{
        background:
          "radial-gradient(228.26% 65.64% at 100% 2.53%, rgba(255,255,255,0.1) 0%, rgba(16,27,68,0.1) 100%)",
      }}
    >
      {/* User card */}
      <div className="flex items-center gap-3 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-lg font-medium text-white shrink-0">
          SM
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-normal text-white truncate">souaibou mbouille ndiaye</p>
          <p className="text-xs font-light truncate" style={{ color: "#7899ce" }}>
            souaibouesp@gmail.com
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto shrink-0 text-white/40">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col justify-between gap-y-7">
          {/* Main nav */}
          <li>
            <ul role="list" className="space-y-3">
              {NAV_ITEMS.map(({ href, label, icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="border-l-2 flex items-center gap-x-3 px-6 py-3 text-sm font-normal transition-all duration-300 whitespace-nowrap overflow-hidden"
                      style={{
                        color: isActive ? "#fff" : "rgba(255,255,255,0.3)",
                        borderColor: isActive ? "#1098F7" : "transparent",
                        backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                      }}
                    >
                      {icon}
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Bottom actions */}
          <li>
            <div className="space-y-1">
              <button
                onClick={() => showToast("Gérer mon compte — bientôt disponible")}
                className="w-full flex items-center justify-center gap-x-2 px-6 py-3 text-sm font-light transition-all duration-300 hover:text-white"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <IconSettings />
                <span className="truncate">Gérer mon compte</span>
              </button>

              <button
                onClick={() => showToast("Faire une suggestion — bientôt disponible")}
                className="w-full flex items-center justify-center gap-x-2 px-6 py-3 text-sm font-light transition-all duration-300 hover:text-white"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <IconLightbulb />
                <span className="truncate">Faire une suggestion</span>
              </button>

              <div className="px-6 pt-2">
                <button
                  type="button"
                  onClick={() => showToast("Déconnexion — bientôt disponible")}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 px-6 py-3 text-sm text-white w-full"
                  style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
                >
                  <IconLogout />
                  <span className="truncate">Déconnexion</span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col p-6 transition-all duration-300 lg:w-[300px]">
        <button className="absolute top-1/2 -translate-y-1/2 -right-0 w-6 h-16 flex items-center justify-center bg-white/5 rounded-r-2xl hover:bg-white/10 transition-all duration-[400ms]">
          <IconChevron />
        </button>
        <NavContent pathname={pathname} />
      </div>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "#0b0f1a", borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://sinvestir.fr/wp-content/uploads/2020/11/Logo-Sinvestir-Gold-Crop.svg"
          alt="S'investir"
          className="h-7 w-auto"
        />
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white/60"
          aria-label="Ouvrir le menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative flex flex-col w-[300px] min-h-full p-6"
            style={{ backgroundColor: "#0b0f1a" }}
          >
            <NavContent pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
