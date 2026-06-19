import Link from "next/link";

const ChevronRight = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-0 -ml-1 group-hover:ml-0 group-hover:opacity-100 transition-all duration-[400ms]">
    <path d="M9.00005 6.50854C9.00005 6.50854 15 10.9275 15 12.5086C15 14.0897 9 18.5085 9 18.5085" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMesSimulations = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M9 2.50854H11C15.714 2.50854 18.0711 2.50854 19.5355 3.97301C21 5.43748 21 7.7945 21 12.5085V18.5085M3 13.2161V18.4894C3 20.7952 3 21.9481 3.72454 22.3608C5.12763 23.16 7.7595 20.4937 9.00938 19.691C9.73425 19.2254 10.0967 18.9926 10.5 18.9926C10.9033 18.9926 11.2657 19.2254 11.9906 19.691C13.2405 20.4937 15.8724 23.16 17.2755 22.3608C18 21.9481 18 20.7952 18 18.4894V13.2161C18 9.58271 18 7.76603 16.9017 6.63729C15.8033 5.50854 14.0355 5.50854 10.5 5.50854C6.96447 5.50854 5.1967 5.50854 4.09835 6.63729C3 7.76603 3 9.58271 3 13.2161Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Triple-ring SVG icon — exact replica of the reference pattern */
function CardIcon({ inner }: { inner: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-[400ms] overflow-visible w-16 h-16"
      style={{ transformOrigin: "center center" }}>
      {/* Outer ring — fades out on hover */}
      <path opacity="0.05"
        d="M32 1.12381C15.5 1.12381 2 14.8206 2 31.5612C2 48.3017 15.5 61.9985 32 61.9985C48.5 61.9985 62 48.3017 62 31.5612C62 14.8206 48.5 1.12381 32 1.12381Z"
        stroke="white" strokeWidth="2.14286" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-[400ms] group-hover:scale-[1.5] group-hover:opacity-0"
        style={{ transformOrigin: "center" }} />
      {/* Middle ring */}
      <path opacity="0.2"
        d="M31.9998 9.57887C20.0831 9.57887 10.3331 19.471 10.3331 31.5614C10.3331 43.6518 20.0831 53.5439 31.9998 53.5439C43.9164 53.5439 53.6664 43.6518 53.6664 31.5614C53.6664 19.471 43.9164 9.57886 31.9998 9.57887Z"
        stroke="white" strokeWidth="2.14286" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-[400ms] group-hover:scale-[1.5] group-hover:opacity-5 group-hover:stroke-[#1098F7]"
        style={{ transformOrigin: "center" }} />
      {/* Inner ring — becomes blue on hover */}
      <path
        d="M32.0297 17.6709C24.4996 17.6709 18.3386 23.9217 18.3386 31.5615C18.3386 39.2014 24.4996 45.4522 32.0297 45.4521C39.5597 45.4521 45.7207 39.2014 45.7207 31.5615C45.7207 23.9217 39.5597 17.6709 32.0297 17.6709Z"
        stroke="white" strokeWidth="2.14286" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-[400ms] group-hover:scale-[1.5] group-hover:stroke-[#1098F7] group-hover:opacity-100"
        style={{ transformOrigin: "center" }} />
      {/* Inner icon — scales and turns yellow on hover */}
      <g className="transition-all duration-[400ms] group-hover:scale-[1.45]"
        style={{ transformOrigin: "center" }}>
        {inner}
      </g>
    </svg>
  );
}

const CryptoInner = () => (
  <>
    <path d="M37 36.4707H30.8889C29.0557 36.4707 28.1391 36.4707 27.5695 35.9012C27 35.3317 27 34.415 27 32.5818V26.4707"
      stroke="white" strokeLinecap="round"
      className="transition-all duration-[400ms] group-hover:stroke-[#eab308]" />
    <path d="M34.6992 28.693C34.6992 28.4168 34.9231 28.193 35.1992 28.193C35.4754 28.193 35.6992 28.4168 35.6992 28.693L34.6992 28.693ZM29.2222 34.7485C28.9461 34.7485 28.7222 34.5247 28.7222 34.2485C28.7222 33.9724 28.9461 33.7485 29.2222 33.7485L29.2222 34.7485ZM34.3192 29.59C34.1306 29.7917 33.8142 29.8024 33.6125 29.6138C33.4108 29.4252 33.4002 29.1088 33.5888 28.9071L34.3192 29.59ZM35.1992 28.6374V28.1374V27.6374C34.9321 27.6374 34.7292 27.7599 34.5781 27.8832C34.4369 27.9984 34.2858 28.1616 34.1296 28.3287L34.4948 28.6701L34.8601 29.0116L35.1992 28.6374ZM35.9036 28.6701L36.2688 28.3287C36.1127 28.1616 35.9615 27.9984 35.8204 27.8832C35.6693 27.7599 35.4663 27.6374 35.1992 27.6374V28.1374V28.6374L35.5384 29.0116L35.9036 28.6701ZM33.954 29.2485L33.5888 28.9071L34.1296 28.3287L34.4948 28.6701L34.8601 29.0116L34.3192 29.59L33.954 29.2485ZM35.9036 28.6701L35.5384 29.0116L36.0792 29.59L36.4444 29.2485L36.8097 28.9071L36.2688 28.3287L35.9036 28.6701ZM35.1992 28.693L34.6992 28.693C34.6992 30.4026 34.0833 31.6475 33.1229 32.4721C32.1521 33.3056 30.7828 33.7485 29.2222 33.7485L29.2222 34.2485L29.2222 34.7485C30.9627 34.7485 32.5819 34.2546 33.7743 33.2308C34.9771 32.1981 35.6992 30.6652 35.6992 28.693L35.1992 28.693Z"
      fill="white"
      className="transition-all duration-[400ms] group-hover:fill-[#eab308]" />
  </>
);

const SIMULATEURS = [
  {
    href: "/simulateur-crypto",
    title: "Simulateur Crypto DCA",
    description: "Simulez vos gains en investissant en DCA ou en une seule fois sur vos cryptos préférées.",
    available: true,
    inner: <CryptoInner />,
  },
];

export default function SimulateursPage() {
  return (
    <div className="container px-0 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 font-light">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-2 tracking-tight text-white">Les simulateurs</h1>
          <p className="text-xs lg:text-sm" style={{ color: "#7899ce" }}>
            Avec les simulateurs S&apos;investir, passez de l&apos;idée à l&apos;action&nbsp;: créez, simulez, investissez.
          </p>
        </div>

        <Link
          href="/mes-simulations"
          className="btn inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-[400ms] outline-none px-4 sm:px-10 py-4 text-[14px] text-white relative overflow-hidden z-0 border border-transparent hover:border-[#3d5af1] whitespace-nowrap"
          style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
        >
          <span className="text-xl flex items-center">
            <IconMesSimulations />
          </span>
          <span className="text-sm font-light">Mes simulations</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {SIMULATEURS.map((sim) =>
          sim.available ? (
            <Link
              key={sim.href}
              href={sim.href}
              className="group bg-white/[2.5%] hover:bg-[#1a237e33] hover:border-[#1098F7bf] transition-colors cursor-pointer rounded-2xl p-8 border border-white/10 relative duration-[400ms]"
            >
              <CardIcon inner={sim.inner} />
              <h2 className="flex items-baseline gap-x-2 text-2xl font-normal mb-4 mt-8 group-hover:text-[#1098F7] transition-colors duration-[400ms] text-white">
                <span>{sim.title}</span>
                <ChevronRight />
              </h2>
              <p className="leading-relaxed text-sm font-light max-w-lg" style={{ color: "#7899ce" }}>
                {sim.description}
              </p>
            </Link>
          ) : (
            <div
              key={sim.href}
              className="group bg-white/[2.5%] rounded-2xl p-8 border border-white/10 relative duration-[400ms] opacity-50 cursor-default"
            >
              <CardIcon inner={sim.inner} />
              <h2 className="flex items-baseline gap-x-2 text-2xl font-normal mb-4 mt-8 text-white">
                <span>{sim.title}</span>
              </h2>
              <p className="leading-relaxed text-sm font-light max-w-lg" style={{ color: "#7899ce" }}>
                {sim.description}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
