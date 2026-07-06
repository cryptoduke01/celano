import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer it from a parent lockfile.
  // Keeps build logs clean (local + Vercel).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
