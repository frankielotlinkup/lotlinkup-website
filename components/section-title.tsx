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
      <div
        aria-hidden="true"
        className={`h-0.5 w-[60px] bg-accent ${isCenter ? "mx-auto" : ""}`}
      />
      {eyebrow && (
        <p
          className={`mt-5 text-[13px] font-medium uppercase tracking-[0.12em] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`${eyebrow ? "mt-4" : "mt-5"} font-serif text-[32px] font-bold leading-[1.05] tracking-[-0.01em] ${headlineColor} md:text-[44px]`}
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
