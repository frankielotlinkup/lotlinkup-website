// TEMPORARY logo lookbook — pick one, then this page goes away.

export const metadata = {
  title: "Logo concepts",
  robots: { index: false, follow: false },
};

const accent = "#0F6E56";
const ink = "#0F1115";

// ---- Concept 1: LL monogram — interlocking L's forming a plot corner ----
function MonogramLL({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 10 L10 54 L36 54"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path
        d="M28 10 L54 10 L54 54"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="square"
        opacity="0.55"
      />
    </svg>
  );
}

// ---- Concept 2: Plot pin — a square parcel with a marker dot ----
function PlotPin({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="14"
        width="44"
        height="36"
        stroke={accent}
        strokeWidth="3"
        rx="2"
      />
      <circle cx="22" cy="26" r="5" fill={accent} />
      <line
        x1="22"
        y1="26"
        x2="22"
        y2="40"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

// ---- Concept 3: Linked parcels — two overlapping squares (linkup) ----
function LinkedParcels({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="14"
        width="30"
        height="30"
        stroke={accent}
        strokeWidth="3"
        rx="2"
      />
      <rect
        x="26"
        y="22"
        width="30"
        height="30"
        stroke={accent}
        strokeWidth="3"
        rx="2"
        fill="white"
      />
    </svg>
  );
}

// ---- Concept 4: Topo lines — three contour curves forming a hill ----
function TopoLines({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 46 Q32 26 58 46"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 38 Q32 22 52 38"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M20 30 Q32 22 44 30"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

// ---- Concept 5: Compass-rose L — a tall L with a north arrow tick ----
function CompassL({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8 L16 52 L52 52"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path d="M16 8 L20 14 L12 14 Z" fill={accent} />
    </svg>
  );
}

// ---- Wordmark in serif ----
function Wordmark({
  mark,
  className = "",
}: {
  mark: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {mark}
      <span
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ color: ink }}
      >
        Lot Linkup
      </span>
    </div>
  );
}

const concepts = [
  {
    name: "Monogram LL",
    note: "Two L's nested into each other — the second sits inside the first, suggesting parcels linked together. Pure geometric.",
    mark: <MonogramLL size={64} />,
    big: <MonogramLL size={144} />,
  },
  {
    name: "Plot Pin",
    note: "A literal map parcel with a corner marker. Most explicitly real-estate; reads instantly as 'land for sale'.",
    mark: <PlotPin size={64} />,
    big: <PlotPin size={144} />,
  },
  {
    name: "Linked Parcels",
    note: "Two overlapping plots — the 'linkup' word, made visual. Works small.",
    mark: <LinkedParcels size={64} />,
    big: <LinkedParcels size={144} />,
  },
  {
    name: "Topo Lines",
    note: "Three contour-map lines forming a soft hill. Most atmospheric — feels land/nature without being literal.",
    mark: <TopoLines size={64} />,
    big: <TopoLines size={144} />,
  },
  {
    name: "Compass L",
    note: "A bold L with a north-arrow tick at the top. Confident, direction-forward.",
    mark: <CompassL size={64} />,
    big: <CompassL size={144} />,
  },
];

export default function LogosPage() {
  return (
    <div style={{ background: "white" }} className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h1
          className="font-serif text-3xl font-semibold"
          style={{ color: ink }}
        >
          Logo concepts
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#555" }}>
          Five rough SVG marks. Each one is fully scalable, monochrome,
          editable. Pick one (or any combination — a hybrid is fine) and
          I&apos;ll refine it into a final mark + favicon.
        </p>

        <div className="mt-12 space-y-16">
          {concepts.map((c, i) => (
            <div
              key={c.name}
              className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr_auto]"
            >
              <div>
                <p
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: "#888" }}
                >
                  Concept {i + 1}
                </p>
                <h2
                  className="mt-1 font-serif text-xl font-semibold"
                  style={{ color: ink }}
                >
                  {c.name}
                </h2>
                <p className="mt-3 text-sm" style={{ color: "#444" }}>
                  {c.note}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Big mark */}
                <div className="flex h-48 items-center justify-center rounded-md bg-[#fafaf7]">
                  {c.big}
                </div>

                {/* Wordmark */}
                <div className="rounded-md bg-[#fafaf7] p-6">
                  <Wordmark mark={c.mark} />
                </div>
              </div>

              {/* Header-size preview */}
              <div className="flex flex-col items-end justify-center gap-3 text-right">
                <p
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "#888" }}
                >
                  Header size
                </p>
                <div className="flex items-center gap-2 rounded-md bg-[#fafaf7] px-4 py-3">
                  <div style={{ transform: "scale(0.5)" }}>{c.mark}</div>
                  <span
                    className="font-serif text-base font-semibold tracking-tight"
                    style={{ color: ink }}
                  >
                    Lot Linkup
                  </span>
                </div>
                <p
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "#888" }}
                >
                  Favicon
                </p>
                <div className="rounded-sm bg-[#fafaf7] p-2">
                  <div style={{ transform: "scale(0.45)" }}>{c.mark}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-16 border-t pt-6 text-sm"
          style={{ color: "#666", borderColor: "#eee" }}
        >
          Tell me a concept number (1–5) or hybrid (e.g. &quot;3 with the
          stronger color of 1&quot;) and I&apos;ll refine. Colors are placeholder
          accent green — fully changeable.
        </p>
      </div>
    </div>
  );
}
