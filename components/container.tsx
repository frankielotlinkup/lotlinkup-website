import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  size?: "default" | "wide";
  className?: string;
};

export function Container({
  children,
  size = "default",
  className = "",
}: ContainerProps) {
  const max = size === "wide" ? "max-w-7xl" : "max-w-6xl";
  return (
    <div className={`mx-auto w-full ${max} px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
