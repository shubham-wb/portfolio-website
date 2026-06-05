import Link from "next/link";
import { Fragment } from "react";
import { PostListItem } from "@/components/PostListItem";
import { ProjectCard } from "@/components/ProjectCard";
import { SocialIcon } from "@/components/icons";
import {
  getFeaturedPosts,
  getFeaturedProjects,
  getSettings,
  getSocialLinks,
} from "@/lib/data";

export default async function HomePage() {
  const [settings, posts, projects, socials] = await Promise.all([
    getSettings(),
    getFeaturedPosts(4),
    getFeaturedProjects(3),
    getSocialLinks(),
  ]);

  return (
    <>
      <div className="site-description">
        <p>{settings.description}</p>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}
      >
        {socials.map((link) => {
          const external =
            link.url.startsWith("http") || link.url.startsWith("mailto");
          const icon = <SocialIcon platform={link.platform} />;
          return external ? (
            <a key={link.id} className="soc" href={link.url} rel="me" title={link.label}>
              {icon}
            </a>
          ) : (
            <Link key={link.id} className="soc" href={link.url} title={link.label}>
              {icon}
            </Link>
          );
        })}
      </div>

      <h2 className="section-title hash-2">Recent posts</h2>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
      <p style={{ marginTop: "1.2em" }}>
        <Link href="/posts">All posts ⟶</Link>
      </p>

      <h2 className="section-title hash-2">Projects</h2>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <p style={{ marginTop: "1.2em" }}>
        <Link href="/projects">All projects ⟶</Link>
      </p>
    </>
  );
}
