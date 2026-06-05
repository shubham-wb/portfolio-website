import type { ReactNode } from "react";

/** Centered, max-width content column used across the site. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-3xl px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
