/** Format an ISO date string ("2026-05-28") as "May 28, 2026". */
export function formatDate(iso: string): string {
  // Parse as UTC to avoid off-by-one shifts across timezones.
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Short numeric date ("2026-05-28" -> "2026.05.28") for compact listings. */
export function formatDateShort(iso: string): string {
  return iso.replaceAll("-", ".");
}
