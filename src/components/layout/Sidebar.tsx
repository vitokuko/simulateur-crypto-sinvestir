"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, TrendingUp, BookmarkCheck, Gift, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: BarChart2 },
  { href: "/simulateur-crypto", label: "Les simulateurs", icon: TrendingUp },
  { href: "/mes-simulations", label: "Mes simulations", icon: BookmarkCheck },
  { href: "/formation", label: "Formation offerte", icon: Gift },
];

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <div
        className="flex items-center gap-3 px-6 py-5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          S&apos;
        </div>
        <span
          className="font-bold text-base tracking-wide"
          style={{ color: "var(--color-text-primary)" }}
        >
          SIMULATEURS
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={20} />
          </button>
        )}
      </div>

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
                backgroundColor: isActive ? "var(--color-accent)" : "transparent",
                color: isActive ? "#fff" : "var(--color-text-secondary)",
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Découvrir S&apos;investir
        </p>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-full shrink-0"
        style={{ backgroundColor: "var(--color-bg-sidebar)" }}
      >
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "var(--color-bg-sidebar)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            S&apos;
          </div>
          <span className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
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

      {/* Mobile drawer overlay */}
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
