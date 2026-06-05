import Link from "next/link";
import { Badge, Button, Card } from "@/components/admin/ui";
import {
  FileTextIcon,
  FolderIcon,
  PlusIcon,
  EditIcon,
} from "@/components/icons";
import { getPosts, getProjects, getAllTags } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminDashboard() {
  const [posts, projects, tags] = await Promise.all([
    getPosts(),
    getProjects(),
    getAllTags(),
  ]);

  const stats = [
    { label: "Posts", value: posts.length, icon: FileTextIcon, href: "/admin/posts" },
    { label: "Projects", value: projects.length, icon: FolderIcon, href: "/admin/projects" },
    { label: "Tags", value: tags.length, icon: FileTextIcon, href: "/admin/posts" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back. Here&apos;s what&apos;s on your site.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <PlusIcon className="h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:bg-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-2 text-3xl font-bold">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Recent posts
          </h2>
          <Link
            href="/admin/posts"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            Manage all
          </Link>
        </div>
        <Card className="divide-y divide-border p-0">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{post.title}</p>
                <p className="font-mono text-xs text-muted">
                  {formatDate(post.date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={post.published ? "success" : "warning"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
                <Link
                  href={`/admin/posts/new?id=${post.id}`}
                  className="text-muted transition-colors hover:text-accent"
                  aria-label={`Edit ${post.title}`}
                >
                  <EditIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
