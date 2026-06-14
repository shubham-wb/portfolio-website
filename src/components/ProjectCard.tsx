import Link from "next/link";
import type { Project } from "@/lib/types";
import { TagList } from "./Tag";
import { Cover } from "./Cover";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <section className="list-item">
      <div className="list-row">
        <Link href={href} className="plain">
          <Cover src={project.image} seed={project.slug} kind="project" alt={project.title} variant="logo" />
        </Link>
        <div className="list-body">
          <h2 className="title hash-2">
            <Link href={href}>{project.title}</Link>
          </h2>
          <div className="description">{project.description}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
            <TagList tags={project.tags} />
            <span className="links">
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  source ↗
                </a>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginInlineStart: "0.75rem" }}
                >
                  live ↗
                </a>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
