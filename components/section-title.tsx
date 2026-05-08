import { type ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  headline: string;
  subhead?: ReactNode;
  align?: "left" | "center";
  variant?: "light" | "dark";
  className?: string;
};

export function SectionTitle({
  eyebrow,
  headline,
  subhead,
  align = "left",
  variant = "light",
  className = "",
}: SectionTitleProps) {
  const isCenter = align === "center";
  const isDark = variant === "dark";

  const wrapperClass = [
    "max-w-2xl",
    isCenter ? "mx-auto text-center" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const eyebrowColor = isDark ? "text-paper-warm/80" : "text-accent";
  const headlineColor = isDark ? "text-paper" : "text-ink";
  const subheadColor = isDark ? "text-paper-warm/85" : "text-ink-soft";

  return (
    <div className={wrapperClass}>
      {/* Accent line — inline with the eyebrow when present, otherwise on its own */}
      {eyebrow ? (
        <div
          className={`flex items-center gap-3.5 ${isCenter ? "justify-center" : ""}`}
        >
          <span
            aria-hidden="true"
            className="h-[1.5px] w-9 bg-accent"
          />
          <p
            className={`text-[13px] font-medium uppercase tracking-[0.12em] ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        </div>
      ) : (
        <span
          aria-hidden="true"
          className={`block h-[1.5px] w-9 bg-accent ${isCenter ? "mx-auto" : ""}`}
        />
      )}

      <h2
        className={`mt-4 font-serif text-[32px] font-bold leading-[1.05] tracking-[-0.01em] ${headlineColor} md:text-[44px]`}
      >
        {headline}
      </h2>

      {subhead && (
        <p
          className={`mt-3.5 max-w-[600px] text-base leading-[1.55] ${subheadColor} ${isCenter ? "mx-auto" : ""} md:text-[17px]`}
        >
          {subhead}
        </p>
      )}
    </div>
  );
}
