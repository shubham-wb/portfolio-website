import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't pick up a stray
  // lockfile elsewhere on the machine (e.g. C:\Users\<you>\package-lock.json).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
