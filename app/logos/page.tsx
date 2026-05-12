// TEMPORARY logo lookbook v3 — pick one, then this page goes away.

export const metadata = {
  title: "Logo concepts v3",
  robots: { index: false, follow: false },
};

const accent = "#0F6E56";
const ink = "#0F1115";

/* ============= MONOGRAM LL FAMILY ============= */

function MonogramA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 10 L10 54 L36 54" stroke={accent} strokeWidth="6" />
      <path d="M28 10 L54 10 L54 54" stroke={accent} strokeWidth="6" opacity="0.55" />
    </svg>
  );
}

function MonogramB({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M12 12 L12 52 L52 52" stroke={accent} strokeWidth="7" />
      <path d="M52 12 L52 52" stroke={accent} strokeWidth="7" />
      <path d="M28 12 L52 12" stroke={accent} strokeWidth="7" />
    </svg>
  );
}

function MonogramC({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 10 L24 10 L24 40 L54 40 L54 54 L10 54 Z" fill={accent} />
    </svg>
  );
}

/* ============= PLOT PIN FAMILY ============= */

function PlotPinA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="14" width="44" height="36" stroke={accent} strokeWidth="3.5" />
      <circle cx="10" cy="14" r="5" fill={accent} />
    </svg>
  );
}

function PlotPinB({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M14 14 L50 14 L50 42 L36 42 L32 52 L28 42 L14 42 Z"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="28" r="3.5" fill={accent} />
    </svg>
  );
}

function PlotPinC({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="12" width="48" height="40" stroke={accent} strokeWidth="3" />
      <path
        d="M32 22 C26 22 22 26 22 31 C22 37 32 46 32 46 C32 46 42 37 42 31 C42 26 38 22 32 22 Z"
        fill={accent}
      />
      <circle cx="32" cy="31" r="2.5" fill="white" />
    </svg>
  );
}

/* ---- 2D: Stylized US silhouette with a pin (v1 — abstract blob) ---- */
function PlotPinUS({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M6 24 L10 18 L20 16 L30 18 L42 14 L52 16 L58 22 L58 34 L54 40 L46 42 L44 48 L40 46 L34 44 L26 44 L18 42 L10 36 L6 30 Z"
        stroke={accent}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M34 26 C30 26 28 29 28 32 C28 36 34 44 34 44 C34 44 40 36 40 32 C40 29 38 26 34 26 Z"
        fill={accent}
      />
      <circle cx="34" cy="32" r="2" fill="white" />
    </svg>
  );
}

/* ---- 2G: More recognizable simplified US outline + pin ---- */
function PlotPinUSv2({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 80" fill="none">
      {/* Simplified contiguous US outline — west coast curve, top border,
          east coast with Florida tail, Texas/Gulf bulge. Stylized but
          should read instantly as the US. */}
      <path
        d="M6 28
           Q4 22 8 18
           L18 14
           L26 12
           L40 14
           L56 12
           L72 12
           L88 12
           L100 14
           L110 18
           L120 22
           L122 28
           L118 34
           L112 38
           L104 42
           L98 44
           L94 50
           L92 58
           L86 60
           L82 54
           L76 50
           L68 48
           L60 46
           L52 46
           L44 48
           L36 48
           L28 46
           L22 42
           L16 38
           L10 34
           Z"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pin — sitting roughly over Texas */}
      <path
        d="M62 28 C56 28 53 32 53 36 C53 42 62 54 62 54 C62 54 71 42 71 36 C71 32 68 28 62 28 Z"
        fill={accent}
      />
      <circle cx="62" cy="36" r="2.6" fill="white" />
    </svg>
  );
}

/* ---- 2E: Waterfront parcel — square with wavy water edge + pin ---- */
function PlotPinWaterfront({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Parcel — three straight sides, bottom is wavy (water) */}
      <path
        d="M10 14 L54 14 L54 44 Q48 50 42 44 Q36 38 30 44 Q24 50 18 44 Q14 40 10 44 Z"
        stroke={accent}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pin near top-right of the dry land */}
      <path
        d="M40 20 C36 20 34 23 34 26 C34 30 40 36 40 36 C40 36 46 30 46 26 C46 23 44 20 40 20 Z"
        fill={accent}
      />
      <circle cx="40" cy="26" r="2" fill="white" />
    </svg>
  );
}

/* ---- 2F: Texas outline with pin (Andrew's biggest market) ---- */
function PlotPinTexas({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Stylized Texas */}
      <path
        d="M14 14 L46 14 L48 20 L52 22 L52 28 L50 32 L46 36 L42 40 L40 48 L36 52 L32 50 L28 52 L24 48 L20 44 L16 38 L12 32 L12 20 Z"
        stroke={accent}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 24 C26 24 24 27 24 30 C24 34 30 40 30 40 C30 40 36 34 36 30 C36 27 34 24 30 24 Z"
        fill={accent}
      />
      <circle cx="30" cy="30" r="2" fill="white" />
    </svg>
  );
}

/* ============= TOPO FAMILY ============= */

function TopoA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M6 48 Q32 18 58 48" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M14 48 Q32 26 50 48" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 48 Q32 34 42 48" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function TopoB({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M6 50 Q32 22 58 50" stroke={accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />
      <path d="M14 50 Q32 28 50 50" stroke={accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
      <path d="M22 50 Q32 36 42 50" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="22" r="3.5" fill={accent} />
    </svg>
  );
}

function TopoC({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M10 32 Q10 14 32 14 Q54 14 54 32 Q54 50 32 50 Q10 50 10 32 Z"
        stroke={accent}
        strokeWidth="3.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M18 32 Q18 22 32 22 Q46 22 46 32 Q46 42 32 42 Q18 42 18 32 Z"
        stroke={accent}
        strokeWidth="3.5"
        fill="none"
        opacity="0.7"
      />
      <circle cx="32" cy="32" r="4" fill={accent} />
    </svg>
  );
}

/* ============= LANDSCAPE FAMILY (NEW) ============= */

/* ---- 5A: Mountain peaks — two triangles + horizon ---- */
function LandscapeMountains({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M8 46 L24 22 L36 38 L46 26 L56 46 Z"
        stroke={accent}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="6" y1="50" x2="58" y2="50" stroke={accent} strokeWidth="2.5" />
    </svg>
  );
}

/* ---- 5B: Sun rising over a hill — circle + curve ---- */
function LandscapeSunHill({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="26" r="9" stroke={accent} strokeWidth="3" fill="none" />
      <path
        d="M4 46 Q22 38 32 42 Q42 46 60 38"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="6" y1="52" x2="58" y2="52" stroke={accent} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

/* ---- 5C: Pine trees on a hill — minimal cabin-in-the-woods feel ---- */
function LandscapePines({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Hill */}
      <path
        d="M4 50 Q24 38 38 44 Q52 50 60 46"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Three pine silhouettes */}
      <path d="M18 44 L22 32 L26 44 Z" fill={accent} />
      <path d="M28 42 L33 26 L38 42 Z" fill={accent} />
      <path d="M40 44 L44 34 L48 44 Z" fill={accent} />
    </svg>
  );
}

/* ---- 5D: Horizon with a single tree + sun (rural homestead vibe) ---- */
function LandscapeHomestead({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Sun */}
      <circle cx="46" cy="22" r="6" fill={accent} />
      {/* Ground line */}
      <line x1="4" y1="48" x2="60" y2="48" stroke={accent} strokeWidth="2.5" />
      {/* Tree on left */}
      <line x1="18" y1="48" x2="18" y2="34" stroke={accent} strokeWidth="2.5" />
      <circle cx="18" cy="28" r="7" stroke={accent} strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* ============= WORDMARK + LAYOUT ============= */

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

const families = [
  {
    name: "Monogram LL",
    note: "Two L's. Pure geometry.",
    variants: [
      { code: "1A", mark: <MonogramA />, big: <MonogramA size={144} /> },
      { code: "1B", mark: <MonogramB />, big: <MonogramB size={144} /> },
      { code: "1C", mark: <MonogramC />, big: <MonogramC size={144} /> },
    ],
  },
  {
    name: "Plot Pin",
    note: "Boundary + marker. Variants expand the boundary concept (parcel, US, waterfront, Texas).",
    variants: [
      { code: "2A", mark: <PlotPinA />, big: <PlotPinA size={144} /> },
      { code: "2B", mark: <PlotPinB />, big: <PlotPinB size={144} /> },
      { code: "2C", mark: <PlotPinC />, big: <PlotPinC size={144} /> },
      { code: "2D — US outline", mark: <PlotPinUS />, big: <PlotPinUS size={144} /> },
      { code: "2G — US outline v2", mark: <PlotPinUSv2 />, big: <PlotPinUSv2 size={144} /> },
      { code: "2E — waterfront", mark: <PlotPinWaterfront />, big: <PlotPinWaterfront size={144} /> },
      { code: "2F — Texas outline", mark: <PlotPinTexas />, big: <PlotPinTexas size={144} /> },
    ],
  },
  {
    name: "Topo",
    note: "Land/topography feel. Less literal.",
    variants: [
      { code: "4A", mark: <TopoA />, big: <TopoA size={144} /> },
      { code: "4B", mark: <TopoB />, big: <TopoB size={144} /> },
      { code: "4C", mark: <TopoC />, big: <TopoC size={144} /> },
    ],
  },
  {
    name: "Landscape (new)",
    note: "Minimal scenic line-art. Most editorial / lifestyle.",
    variants: [
      { code: "5A — mountains", mark: <LandscapeMountains />, big: <LandscapeMountains size={144} /> },
      { code: "5B — sun + hill", mark: <LandscapeSunHill />, big: <LandscapeSunHill size={144} /> },
      { code: "5C — pines on hill", mark: <LandscapePines />, big: <LandscapePines size={144} /> },
      { code: "5D — homestead", mark: <LandscapeHomestead />, big: <LandscapeHomestead size={144} /> },
    ],
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
          Logo concepts — v3
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#555" }}>
          Four families. Tell me a code (e.g. &quot;2E&quot;) and I&apos;ll refine.
        </p>

        <div className="mt-12 space-y-20">
          {families.map((fam) => (
            <section key={fam.name}>
              <div className="mb-6">
                <h2
                  className="font-serif text-2xl font-semibold"
                  style={{ color: ink }}
                >
                  {fam.name}
                </h2>
                <p className="mt-2 text-sm" style={{ color: "#555" }}>
                  {fam.note}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {fam.variants.map((v) => (
                  <div
                    key={v.code}
                    className="rounded-md border p-4"
                    style={{ borderColor: "#eee" }}
                  >
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: "#888" }}
                    >
                      {v.code}
                    </p>
                    <div className="mt-4 flex h-40 items-center justify-center rounded-md bg-[#fafaf7]">
                      {v.big}
                    </div>
                    <div className="mt-3 rounded-md bg-[#fafaf7] p-3">
                      <Wordmark mark={v.mark} />
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-md bg-[#fafaf7] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div style={{ transform: "scale(0.5)" }}>{v.mark}</div>
                        <span
                          className="font-serif text-sm font-semibold tracking-tight"
                          style={{ color: ink }}
                        >
                          Lot Linkup
                        </span>
                      </div>
                      <div style={{ transform: "scale(0.4)" }}>{v.mark}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p
          className="mt-16 border-t pt-6 text-sm"
          style={{ color: "#666", borderColor: "#eee" }}
        >
          Give me the code. Hybrids welcome (&quot;5C tree shapes on top of 2A parcel&quot;).
        </p>
      </div>
    </div>
  );
}
