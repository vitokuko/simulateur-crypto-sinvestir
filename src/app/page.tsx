import Link from "next/link";

function ArrowIcon() {
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H7M17 7V17"
          stroke="#0b0f1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const CARDS = [
  {
    href: "/simulateur-crypto",
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
            className="relative flex flex-col justify-end rounded-2xl p-8 min-h-52 overflow-hidden transition-opacity hover:opacity-90"
            style={{
              backgroundColor: card.dark ? "#0f2055" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="absolute top-6 right-6">
              <ArrowIcon />
            </div>
            <h2 className="text-2xl font-normal text-white mb-2">{card.title}</h2>
            <p className="text-sm font-light" style={{ color: "#7899ce" }}>
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
              className="relative flex flex-col justify-end rounded-2xl p-8 flex-1 min-h-36 overflow-hidden transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="absolute top-6 right-6">
                <ArrowIcon />
              </div>
              <h2 className="text-xl font-normal text-white mb-1">{card.title}</h2>
              <p className="text-sm font-light" style={{ color: "#7899ce" }}>
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
