import { SkillEditor } from "@/components/admin/SkillEditor";
import { getSkills } from "@/lib/data";

export default async function NewSkillPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let initial = null;
  if (id) {
    const skills = await getSkills();
    initial = skills.find((s) => s.id === id) ?? null;
  }
  return <SkillEditor initial={initial} />;
}
