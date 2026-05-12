import type { SVGProps } from "react";

// Lot Linkup brand mark — three pines on a rolling hill. Uses currentColor
// so the mark inherits whatever text color the surrounding context applies
// (header has light-on-dark and dark-on-light states).
export function LogoMark({
  size = 28,
  ...rest
}: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      {/* Hill */}
      <path
        d="M4 50 Q22 38 36 44 Q50 50 60 44"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Three pines, ascending in size toward the middle peak */}
      <path d="M16 44 L20 30 L24 44 Z" fill="currentColor" />
      <path d="M27 44 L33 22 L39 44 Z" fill="currentColor" />
      <path d="M42 44 L46 32 L50 44 Z" fill="currentColor" />
    </svg>
  );
}
