import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/Tag";
import { Cover } from "@/components/Cover";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <div className="title">
        <h1 className="title hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {post.title}
        </h1>
        <div className="meta">
          Posted on {formatDate(post.date)} · {post.readingTime} min read
        </div>
      </div>

      <div style={{ marginTop: "1.2em" }}>
        <Cover
          src={post.coverImage}
          seed={post.slug}
          kind="post"
          alt={post.title}
          sizes="(max-width: 800px) 100vw, 800px"
          priority
        />
      </div>

      <section
        className="prose body"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ marginTop: "1.5em" }}
      />

      <div className="post-tags" style={{ marginTop: "2em" }}>
        <TagList tags={post.tags} />
      </div>

      <p style={{ marginTop: "2em" }}>
        <Link href="/posts">⟵ Back to all posts</Link>
      </p>
    </article>
  );
}
