import type { Metadata } from "next";
import { SkillsGrid } from "@/components/SkillsGrid";
import { getAbout, getSettings, getSkills } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "A little about me.",
};

export default async function AboutPage() {
  const [about, skills, settings] = await Promise.all([
    getAbout(),
    getSkills(),
    getSettings(),
  ]);

  return (
    <>
      <h1 className="hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {about.heading || "About"}
      </h1>
      {about.location && <div className="meta">{about.location}</div>}

      {about.body && (
        <section
          className="prose"
          dangerouslySetInnerHTML={{ __html: about.body }}
          style={{ marginTop: "1.5em" }}
        />
      )}

      {settings.resumeUrl && (
        <p style={{ marginTop: "1.5em" }}>
          <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer">
            Download résumé ↓
          </a>
        </p>
      )}

      {skills.length > 0 && (
        <>
          <h2 className="section-title hash-2">Skills</h2>
          <SkillsGrid skills={skills} />
        </>
      )}
    </>
  );
}
