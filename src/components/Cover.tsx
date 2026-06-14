import Image from "next/image";
import { FileText, FolderGit2 } from "lucide-react";

/** Deterministic two-stop gradient derived from a seed string (stable per item). */
function gradientFor(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const a = (h >>> 0) % 360;
  const b = (a + 55) % 360;
  const angle = ((h >>> 9) % 120) + 90; // 90–210deg
  return `linear-gradient(${angle}deg, hsl(${a} 70% 56%), hsl(${b} 72% 44%))`;
}

/**
 * Cover for posts/projects. Falls back to a generated gradient with a centered
 * white Lucide icon when no image is uploaded.
 * - `banner` (default): full-width 16:9, used on detail pages.
 * - `logo`: small square, used beside the title in listings.
 */
export function Cover({
  src,
  seed,
  kind,
  alt,
  priority = false,
  sizes = "(max-width: 700px) 100vw, 700px",
  variant = "banner",
}: {
  src?: string;
  seed: string;
  kind: "post" | "project";
  alt: string;
  priority?: boolean;
  sizes?: string;
  variant?: "banner" | "logo";
}) {
  const Icon = kind === "project" ? FolderGit2 : FileText;
  const isLogo = variant === "logo";
  const wrapClass = isLogo ? "cover-logo" : "thumb";

  if (src) {
    return (
      <div className={wrapClass}>
        <Image src={src} alt={alt} fill sizes={isLogo ? "64px" : sizes} priority={priority} />
      </div>
    );
  }

  return (
    <div
      className={`${wrapClass} grid place-items-center`}
      style={{ background: gradientFor(seed), borderColor: "transparent" }}
      aria-hidden
    >
      <Icon color="#ffffff" size={isLogo ? 26 : 44} strokeWidth={1.75} />
    </div>
  );
}
