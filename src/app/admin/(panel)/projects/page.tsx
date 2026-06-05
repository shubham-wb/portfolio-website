import Link from "next/link";
import { Badge, Button, Card } from "@/components/admin/ui";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { getProjects } from "@/lib/data";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <PlusIcon className="h-4 w-4" />
            New project
          </Button>
        </Link>
      </div>

      <Card className="mt-6 divide-y divide-border p-0">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center gap-3 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{project.title}</p>
                {project.featured && <Badge tone="success">Featured</Badge>}
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">
                {project.description}
              </p>
              <p className="mt-1 font-mono text-xs text-muted">
                {project.tags.map((t) => `#${t}`).join(" ")}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/projects/new?id=${project.id}`}
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                aria-label="Edit project"
              >
                <EditIcon className="h-4 w-4" />
              </Link>
              <button
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                aria-label="Delete project"
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
