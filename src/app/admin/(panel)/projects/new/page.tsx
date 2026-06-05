import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { getProjects } from "@/lib/data";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let initial = null;
  if (id) {
    const projects = await getProjects();
    initial = projects.find((p) => p.id === id) ?? null;
  }
  return <ProjectEditor initial={initial} />;
}
