import { type ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  level?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const headingClass =
    level === "h1" ? "type-h1" : level === "h3" ? "type-h3" : "type-h2";
  const alignClass = align === "center" ? "text-center" : "";
  const descAlign = align === "center" ? "mx-auto" : "";

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <p className="type-caption text-accent mb-4">{eyebrow}</p>
      )}
      {level === "h1" ? (
        <h1 className={headingClass}>{title}</h1>
      ) : level === "h3" ? (
        <h3 className={headingClass}>{title}</h3>
      ) : (
        <h2 className={headingClass}>{title}</h2>
      )}
      {description && (
        <p className={`type-body text-ink-soft mt-4 max-w-2xl ${descAlign}`}>
          {description}
        </p>
      )}
    </div>
  );
}
