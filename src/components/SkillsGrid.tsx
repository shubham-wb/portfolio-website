import Image from "next/image";
import type { Skill } from "@/lib/types";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;
  return (
    <div className="skills-grid">
      {skills.map((skill) => (
        <div key={skill.id} className="skill-card">
          <span className="skill-logo">
            {skill.logo ? (
              <Image
                src={skill.logo}
                alt=""
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <span aria-hidden>▣</span>
            )}
          </span>
          <div>
            <div className="skill-name">{skill.name}</div>
            {skill.summary && <div className="skill-summary">{skill.summary}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
