import Link from "next/link";

/** Archie-style tag list: <ul class="tags"> with 🏷 prefixes and pill links. */
export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>
          <Link href={`/posts?tag=${encodeURIComponent(t)}`}>{t}</Link>
        </li>
      ))}
    </ul>
  );
}
