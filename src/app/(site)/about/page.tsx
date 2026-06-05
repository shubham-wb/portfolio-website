import type { Metadata } from "next";
import { getAbout } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "A little about me.",
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <h1 className="hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {about.heading}
      </h1>
      {about.location && <div className="meta">{about.location}</div>}
      <section
        className="prose"
        dangerouslySetInnerHTML={{ __html: about.body }}
        style={{ marginTop: "1.5em" }}
      />
    </>
  );
}
