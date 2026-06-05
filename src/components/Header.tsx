import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { mainNav, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header>
      <div className="main">
        <Link href="/">{siteConfig.name}</Link>
      </div>
      <nav>
        {mainNav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
