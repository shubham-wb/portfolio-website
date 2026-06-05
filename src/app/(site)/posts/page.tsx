import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Posts",
  description: "All blog posts.",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [allPosts, tags] = await Promise.all([getPosts(), getAllTags()]);
  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;

  return (
    <>
      <h1 className="page-title hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {tag ? `Posts tagged "${tag}"` : "All posts"}
      </h1>

      {/* Tag filter */}
      <ul className="tags" style={{ marginBlock: "1em" }}>
        <li style={{ listStyle: "none" }}>
          <Link
            href="/posts"
            style={
              !tag
                ? { background: "var(--primary)", color: "var(--on-accent)" }
                : undefined
            }
          >
            all
          </Link>
        </li>
        {tags.map((t) => (
          <li key={t}>
            <Link
              href={`/posts?tag=${encodeURIComponent(t)}`}
              style={
                tag === t
                  ? { background: "var(--primary)", color: "var(--on-accent)" }
                  : undefined
              }
            >
              {t}
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>{" "}
              <span className="meta">{formatDate(post.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
