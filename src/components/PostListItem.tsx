import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Cover } from "./Cover";

/** Post card: logo beside heading + meta description, styled after Archie. */
export function PostListItem({ post }: { post: Post }) {
  const href = `/posts/${post.slug}`;
  return (
    <section className="list-item">
      <div className="list-row">
        <Link href={href} className="plain">
          <Cover src={post.coverImage} seed={post.slug} kind="post" alt={post.title} variant="logo" />
        </Link>
        <div className="list-body">
          <h2 className="title hash-1">
            <Link href={href}>{post.title}</Link>
          </h2>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <div className="description">{post.excerpt}</div>
          <Link className="readmore" href={href}>
            Read more ⟶
          </Link>
        </div>
      </div>
    </section>
  );
}
