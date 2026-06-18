"use client";

export function Header() {
  return (
    <header
      className="hidden md:flex items-center justify-between px-8 py-4 border-b shrink-0"
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg font-bold text-base shrink-0"
          style={{ backgroundColor: "#c9a227", color: "#0d1117" }}
        >
          S&apos;
        </div>
        <span
          className="font-bold text-lg tracking-widest uppercase"
          style={{ color: "var(--color-text-primary)" }}
        >
          SIMULATEURS
        </span>
      </div>

      {/* CTA */}
      <a
        href="https://sinvestir.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Découvrir S&apos;investir
      </a>
    </header>
  );
}
