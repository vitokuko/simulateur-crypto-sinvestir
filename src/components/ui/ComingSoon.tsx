import Link from "next/link";

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
        style={{
          backgroundColor: "rgba(16,152,247,0.08)",
          border: "1px solid rgba(16,152,247,0.15)",
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1Zm1-8h-2V7h2v2Z"
            fill="#1098F7"
            fillOpacity="0.3"
          />
          <path d="M12 8V7M12 17v-5" stroke="#1098F7" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="#1098F7" strokeWidth="1.5" />
        </svg>
      </div>

      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-light mb-6"
        style={{
          backgroundColor: "rgba(16,152,247,0.08)",
          border: "1px solid rgba(16,152,247,0.15)",
          color: "#1098F7",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#1098F7] animate-pulse inline-block" />
        En cours de développement
      </div>

      <h1 className="text-2xl sm:text-3xl font-normal text-white mb-4">{title}</h1>

      <p className="text-sm font-light max-w-sm mx-auto mb-10" style={{ color: "#7899ce" }}>
        Cette fonctionnalité sera bientôt disponible. Revenez prochainement pour découvrir les
        nouvelles fonctionnalités de S&apos;investir Simulateurs.
      </p>

      <Link
        href="/simulateur-crypto"
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-light text-white transition-all duration-300"
        style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Retour au simulateur
      </Link>
    </div>
  );
}
