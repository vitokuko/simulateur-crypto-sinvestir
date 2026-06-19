import Link from "next/link";

function ArrowIcon() {
  return (
    <div className="w-12 h-12 bg-white cursor-pointer rounded-full flex items-center justify-center shrink-0">
      <svg
        className="w-6 h-6 text-[#0b0f1a] transform rotate-45 group-hover:rotate-90 transition-transform duration-[400ms]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </div>
  );
}

const CARDS = [
  {
    href: "/simulateurs",
    title: "Tous les simulateurs",
    description:
      'Retrouvez tous les simulateurs dans la rubrique "Les simulateurs". Créez, simulez, investissez !',
    dark: false,
  },
  {
    href: "/mes-simulations",
    title: "Mes simulations",
    description:
      'Retrouvez toutes vos simulations sauvegardées dans la rubrique "Mes simulations".',
    dark: true,
  },
];

const BOTTOM_CARDS = [
  {
    href: "/formation",
    title: "Accédez à notre formation offerte",
    description:
      "Apprenez à faire fructifier intelligemment votre argent et investissez en toute confiance.",
  },
  {
    href: "/",
    title: "Découvrez S'investir Conseil",
    description: "Le cabinet qui réinvente la gestion privée",
  },
];

const BROKERS = [
  {
    name: "Trade Republic",
    description:
      "Trade Republic est un courtier innovant offrant une plateforme mobile intuitive pour investir facilement et passivement.",
    bg: "#1a1a2e",
    logo: "TR",
    logoColor: "#000",
    logoBg: "#fff",
  },
  {
    name: "Linxea",
    description:
      "Linxea est le meilleur courtier en assurance-vie ou PER selon S'investir pour investir à frais réduits et accédez à un large choix d'ETF, SCPI et fonds euros.",
    bg: "#f97316",
    logo: "L",
    logoColor: "#fff",
    logoBg: "#f97316",
  },
];

export default function Home() {
  return (
    <div className="space-y-10 w-full">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal text-white">Bonjour souaibou !</h1>
          <p className="text-sm font-light mt-1" style={{ color: "#7899ce" }}>
            Nous sommes ravis de vous revoir aujourd&apos;hui
          </p>
        </div>
        <Link
          href="/simulateur-crypto"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-light text-white shrink-0"
          style={{ background: "linear-gradient(to right, #1a52e8, #0a3080)" }}
        >
          <span className="text-lg leading-none">+</span>
          Nouvelle simulation
        </Link>
      </div>

      {/* Top 2 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white/5 rounded-2xl p-8 border border-white/10 relative transition-all duration-[400ms] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            style={{ backgroundColor: card.dark ? "#0f2055" : undefined }}
          >
            <div className="absolute top-6 right-6">
              <ArrowIcon />
            </div>
            <h2 className="text-2xl font-normal text-white mb-4 mt-12">{card.title}</h2>
            <p className="text-sm font-light leading-relaxed max-w-lg text-balance" style={{ color: "#7899ce" }}>
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brokers card */}
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-normal text-white">Prêt à investir ?</h2>
            </div>
            <a
              href="https://sinvestir.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-white/60 hover:text-white flex items-center gap-1 shrink-0"
            >
              Découvrez en plus →
            </a>
          </div>
          <p className="text-xs font-light" style={{ color: "#7899ce" }}>
            Collaboration commerciale : sinvestir.fr perçoit une commission si vous ouvrez un compte
            via nos liens d&apos;affiliation, sans surcoût pour vous.
          </p>
          <div className="space-y-5">
            {BROKERS.map((broker) => (
              <div key={broker.name} className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
                  style={{ backgroundColor: broker.logoBg, color: broker.logoColor }}
                >
                  {broker.logo}
                </div>
                <div>
                  <p className="text-sm font-normal text-white mb-1">{broker.name}</p>
                  <p className="text-xs font-light" style={{ color: "#7899ce" }}>
                    {broker.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right small cards */}
        <div className="flex flex-col gap-4">
          {BOTTOM_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white/5 rounded-2xl p-8 border border-white/10 relative flex-1 min-h-36 transition-all duration-[400ms] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            >
              <div className="absolute top-6 right-6">
                <ArrowIcon />
              </div>
              <h2 className="text-xl font-normal text-white mb-1 mt-12">{card.title}</h2>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#7899ce" }}>
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
