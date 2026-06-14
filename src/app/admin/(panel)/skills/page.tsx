import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EditIcon, PlusIcon } from "@/components/icons";
import { getSkills } from "@/lib/data";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="mt-1 text-sm text-muted">
            {skills.length} {skills.length === 1 ? "skill" : "skills"}
          </p>
        </div>
        <Link href="/admin/skills/new">
          <Button>
            <PlusIcon className="h-4 w-4" />
            New skill
          </Button>
        </Link>
      </div>

      {skills.length === 0 ? (
        <Card className="mt-6 text-sm text-muted">
          No skills yet. Add your first one.
        </Card>
      ) : (
        <Card className="mt-6 divide-y divide-border p-0">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3 px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background">
                {skill.logo ? (
                  <Image
                    src={skill.logo}
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-muted">—</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{skill.name}</p>
                <p className="truncate text-sm text-muted">{skill.summary}</p>
              </div>
              <Link
                href={`/admin/skills/new?id=${skill.id}`}
                className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                aria-label="Edit skill"
              >
                <EditIcon className="h-4 w-4" />
              </Link>
              <DeleteButton id={skill.id} kind="skill" label={skill.name} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
