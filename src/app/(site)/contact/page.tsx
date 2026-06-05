import type { Metadata } from "next";
import Link from "next/link";
import { SocialIcon } from "@/components/icons";
import { getSocialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ways to get in touch.",
};

export default async function ContactPage() {
  const links = await getSocialLinks();

  return (
    <>
      <h1 className="hash-1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Contact
      </h1>
      <div className="site-description">
        <p>The best ways to reach me. I read everything, eventually.</p>
      </div>

      <ul className="posts">
        {links.map((link) => {
          const external =
            link.url.startsWith("http") || link.url.startsWith("mailto");
          const label = (
            <>
              <span style={{ marginInlineEnd: "0.5rem", verticalAlign: "middle" }}>
                <SocialIcon platform={link.platform} width={15} height={15} />
              </span>
              {link.label}
            </>
          );
          return (
            <li key={link.id}>
              {external ? (
                <a href={link.url} rel="me noopener noreferrer">
                  {label}
                </a>
              ) : (
                <Link href={link.url}>{label}</Link>
              )}{" "}
              <span className="meta">{link.url}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
