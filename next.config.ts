import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't pick up a stray
  // lockfile elsewhere on the machine (e.g. C:\Users\<you>\package-lock.json).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Cloudinary-hosted uploads (skill logos, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
