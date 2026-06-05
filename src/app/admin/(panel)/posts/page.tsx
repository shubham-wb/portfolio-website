import Link from "next/link";
import { Badge, Button, Card } from "@/components/admin/ui";
import { EditIcon, PlusIcon, TrashIcon, EyeIcon } from "@/components/icons";
import { getPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <PlusIcon className="h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      <Card className="mt-6 divide-y divide-border p-0">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center gap-3 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{post.title}</p>
                <Badge tone={post.published ? "success" : "warning"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">
                {post.excerpt}
              </p>
              <p className="mt-1 font-mono text-xs text-muted">
                {formatDate(post.date)} · /{post.slug}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/posts/${post.slug}`}
                target="_blank"
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                aria-label="View post"
              >
                <EyeIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`/admin/posts/new?id=${post.id}`}
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                aria-label="Edit post"
              >
                <EditIcon className="h-4 w-4" />
              </Link>
              <button
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                aria-label="Delete post"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
