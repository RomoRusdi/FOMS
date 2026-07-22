import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the tracing root to this project (a stray lockfile exists in the home dir).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
