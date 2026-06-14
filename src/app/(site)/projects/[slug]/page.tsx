import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/Tag";
import { Cover } from "@/components/Cover";
import { getProject } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <div className="title">
        <h1 className="title hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {project.title}
        </h1>
        {project.description && <div className="meta">{project.description}</div>}
      </div>

      {/* Repo / live links */}
      {(project.repoUrl || project.url) && (
        <p style={{ marginTop: "0.5em" }}>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              source ↗
            </a>
          )}
          {project.repoUrl && project.url && <span> · </span>}
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              live ↗
            </a>
          )}
        </p>
      )}

      <div style={{ marginTop: "1.2em" }}>
        <Cover
          src={project.image}
          seed={project.slug}
          kind="project"
          alt={project.title}
          sizes="(max-width: 800px) 100vw, 800px"
          priority
        />
      </div>

      {project.content && (
        <section
          className="prose body"
          dangerouslySetInnerHTML={{ __html: project.content }}
          style={{ marginTop: "1.5em" }}
        />
      )}

      {project.tags.length > 0 && (
        <div style={{ marginTop: "2em" }}>
          <TagList tags={project.tags} />
        </div>
      )}

      <p style={{ marginTop: "2em" }}>
        <Link href="/projects">⟵ Back to all projects</Link>
      </p>
    </article>
  );
}
