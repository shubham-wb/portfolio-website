import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";

/** Homepage / recent-posts entry, styled after Archie's `.list-item`. */
export function PostListItem({ post }: { post: Post }) {
  return (
    <section className="list-item">
      <h2 className="title hash-1">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <div className="description">{post.excerpt}</div>
      <Link className="readmore" href={`/posts/${post.slug}`}>
        Read more ⟶
      </Link>
    </section>
  );
}
