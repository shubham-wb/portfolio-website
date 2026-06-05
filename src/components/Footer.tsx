import Link from "next/link";
import { Fragment } from "react";
import { SocialIcon } from "./icons";
import { getSettings, getSocialLinks } from "@/lib/data";

export async function Footer() {
  const [links, settings] = await Promise.all([getSocialLinks(), getSettings()]);
  const year = new Date().getFullYear();

  return (
    <footer>
      <div style={{ display: "flex", alignItems: "center" }}>
        {links.map((link, i) => {
          const external =
            link.url.startsWith("http") || link.url.startsWith("mailto");
          const icon = <SocialIcon platform={link.platform} />;
          return (
            <Fragment key={link.id}>
              {external ? (
                <a className="soc" href={link.url} rel="me" title={link.label}>
                  {icon}
                </a>
              ) : (
                <Link className="soc" href={link.url} title={link.label}>
                  {icon}
                </Link>
              )}
              {i < links.length - 1 && <span className="divider" />}
            </Fragment>
          );
        })}
      </div>
      <div className="footer-info">
        {year} © {settings.name} | Built with{" "}
        <a href="https://nextjs.org" rel="noopener noreferrer">
          Next.js
        </a>
      </div>
    </footer>
  );
}
