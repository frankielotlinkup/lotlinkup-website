// TEMPORARY logo lookbook v2 — pick one, then this page goes away.

export const metadata = {
  title: "Logo concepts v2",
  robots: { index: false, follow: false },
};

const accent = "#0F6E56";
const ink = "#0F1115";

// ---- 1A: Original LL monogram (kept for reference) ----
function MonogramA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
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

// ---- 1B: Tight interlocked LL — two L's locked into a rectangle ----
function MonogramB({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Forward L */}
      <path
        d="M12 12 L12 52 L52 52"
        stroke={accent}
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      {/* Inverted L tucked into the forward one */}
      <path
        d="M52 12 L52 52"
        stroke={accent}
        strokeWidth="7"
        strokeLinecap="butt"
      />
      <path
        d="M28 12 L52 12"
        stroke={accent}
        strokeWidth="7"
        strokeLinecap="butt"
      />
    </svg>
  );
}

// ---- 1C: Solid L with cut-out inner L (Adobe-style negative space) ----
function MonogramC({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M10 10 L24 10 L24 40 L54 40 L54 54 L10 54 Z"
        fill={accent}
      />
      <path
        d="M30 16 L40 16 L40 34 L48 34 L48 28 L34 28 L34 16 Z"
        fill="white"
        opacity="0"
      />
    </svg>
  );
}

// ---- 2A: Plot pin — integrated, single corner dot, no dashed line ----
function PlotPinA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect
        x="10"
        y="14"
        width="44"
        height="36"
        stroke={accent}
        strokeWidth="3.5"
      />
      <circle cx="10" cy="14" r="5" fill={accent} />
    </svg>
  );
}

// ---- 2B: Plot pin — teardrop merged with parcel ----
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

// ---- 2C: Plot pin — pin inside the parcel ----
function PlotPinC({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect
        x="8"
        y="12"
        width="48"
        height="40"
        stroke={accent}
        strokeWidth="3"
        rx="1"
      />
      <path
        d="M32 22 C26 22 22 26 22 31 C22 37 32 46 32 46 C32 46 42 37 42 31 C42 26 38 22 32 22 Z"
        fill={accent}
      />
      <circle cx="32" cy="31" r="2.5" fill="white" />
    </svg>
  );
}

// ---- 4A: Topo lines — clean stacked contour hill ----
function TopoA({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M6 48 Q32 18 58 48"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14 48 Q32 26 50 48"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M22 48 Q32 34 42 48"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---- 4B: Topo with a marker on the peak ----
function TopoB({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M6 50 Q32 22 58 50"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M14 50 Q32 28 50 50"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M22 50 Q32 36 42 50"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="22" r="3.5" fill={accent} />
    </svg>
  );
}

// ---- 4C: Topo — closed contour (loop) suggesting a parcel boundary ----
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
    family: "Monogram LL",
    variants: [
      { name: "1A — original", mark: <MonogramA />, big: <MonogramA size={144} /> },
      { name: "1B — tight interlock", mark: <MonogramB />, big: <MonogramB size={144} /> },
      { name: "1C — negative-space L", mark: <MonogramC />, big: <MonogramC size={144} /> },
    ],
    note: "Pure geometry — two L's. 1A is the loose original, 1B locks them into a clean rectangle, 1C is a solid L silhouette.",
  },
  {
    family: "Plot Pin",
    variants: [
      { name: "2A — corner dot", mark: <PlotPinA />, big: <PlotPinA size={144} /> },
      { name: "2B — folded tag", mark: <PlotPinB />, big: <PlotPinB size={144} /> },
      { name: "2C — pin inside", mark: <PlotPinC />, big: <PlotPinC size={144} /> },
    ],
    note: "Land + location. 2A is minimal (parcel with a corner marker), 2B fuses parcel and pin into one shape, 2C puts the classic teardrop pin inside the boundary.",
  },
  {
    family: "Topo",
    variants: [
      { name: "4A — clean stack", mark: <TopoA />, big: <TopoA size={144} /> },
      { name: "4B — peak marker", mark: <TopoB />, big: <TopoB size={144} /> },
      { name: "4C — loop boundary", mark: <TopoC />, big: <TopoC size={144} /> },
    ],
    note: "Atmospheric land/topography. 4A is the pure stacked hill, 4B adds a marker (the lot you're looking at), 4C reads more as an enclosed parcel boundary from above.",
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
          Logo concepts — v2
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#555" }}>
          Three families, three variants each. Tell me a code (e.g. &quot;1B&quot;)
          or a hybrid (&quot;2A but rounder corners&quot;) and I&apos;ll refine.
        </p>

        <div className="mt-12 space-y-20">
          {concepts.map((fam) => (
            <section key={fam.family}>
              <div className="mb-6">
                <h2
                  className="font-serif text-2xl font-semibold"
                  style={{ color: ink }}
                >
                  {fam.family}
                </h2>
                <p className="mt-2 text-sm" style={{ color: "#555" }}>
                  {fam.note}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {fam.variants.map((v) => (
                  <div
                    key={v.name}
                    className="rounded-md border p-4"
                    style={{ borderColor: "#eee" }}
                  >
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: "#888" }}
                    >
                      {v.name}
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
          Give me the code (1A / 1B / 1C / 2A / 2B / 2C / 4A / 4B / 4C). Hybrids
          welcome.
        </p>
      </div>
    </div>
  );
}
