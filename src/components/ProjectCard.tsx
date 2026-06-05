import type { Project } from "@/lib/types";
import { TagList } from "./Tag";

export function ProjectCard({ project }: { project: Project }) {
  const primary = project.url ?? project.repoUrl;

  return (
    <section className="list-item">
      <h2 className="title hash-2">
        {primary ? (
          <a href={primary} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        ) : (
          project.title
        )}
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
    </section>
  );
}
