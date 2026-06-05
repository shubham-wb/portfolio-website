import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects and things I've built.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <h1 className="page-title hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Projects
      </h1>
      <div className="site-description">
        <p>Open-source tools and experiments I maintain.</p>
      </div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
}
