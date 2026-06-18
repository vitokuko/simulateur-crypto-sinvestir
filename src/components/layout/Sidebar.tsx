"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, TrendingUp, BookmarkCheck, Gift } from "lucide-react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: BarChart2 },
  { href: "/simulateur-crypto", label: "Les simulateurs", icon: TrendingUp },
  { href: "/mes-simulations", label: "Mes simulations", icon: BookmarkCheck },
  { href: "/formation", label: "Formation offerte", icon: Gift },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-64 min-h-full shrink-0"
      style={{ backgroundColor: "var(--color-bg-sidebar)" }}
    >
      {/* Logo */}
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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

      {/* Footer sidebar */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Découvrir S&apos;investir
        </p>
      </div>
    </aside>
  );
}
