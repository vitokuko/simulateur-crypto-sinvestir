"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  GitCompare,
  Bookmark,
  GraduationCap,
  Settings,
  Lightbulb,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/simulateur-crypto", label: "Les simulateurs", icon: TrendingUp },
  { href: "/comparateurs", label: "Les comparateurs", icon: GitCompare },
  { href: "/mes-simulations", label: "Mes simulations", icon: Bookmark },
  { href: "/formation", label: "Formation offerte", icon: GraduationCap },
];

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* User card */}
      <div className="p-4">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ backgroundColor: "var(--color-bg-card)" }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0"
            style={{ backgroundColor: "#1e3a5f", color: "var(--color-text-primary)" }}
          >
            SM
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              souaibou mbouille...
            </p>
            <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
              souaibouesp@gmail.co...
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto shrink-0"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm"
          style={{ backgroundColor: "#c9a227", color: "#0d1117" }}
        >
          S&apos;
        </div>
        <span
          className="font-bold text-base tracking-widest uppercase"
          style={{ color: "var(--color-text-primary)" }}
        >
          SIMULATEURS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              }}
            >
              <Icon size={17} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div
        className="px-3 pb-4 space-y-1 border-t pt-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Settings size={17} strokeWidth={1.5} />
          Gérer mon compte
        </button>
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Lightbulb size={17} strokeWidth={1.5} />
          Faire une suggestion
        </button>
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-sm font-semibold mt-2"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-full shrink-0 relative"
        style={{ backgroundColor: "var(--color-bg-sidebar)" }}
      >
        <NavContent pathname={pathname} />
        {/* Collapse arrow */}
        <button
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <ChevronLeft size={14} />
        </button>
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "var(--color-bg-sidebar)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs"
            style={{ backgroundColor: "#c9a227", color: "#0d1117" }}
          >
            S&apos;
          </div>
          <span
            className="font-bold text-sm tracking-widest uppercase"
            style={{ color: "var(--color-text-primary)" }}
          >
            SIMULATEURS
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative flex flex-col w-72 min-h-full"
            style={{ backgroundColor: "var(--color-bg-sidebar)" }}
          >
            <NavContent pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
