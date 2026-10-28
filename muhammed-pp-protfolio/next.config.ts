import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download": [
      "./.env.example",
      "./.gitignore",
      "./README.md",
      "./drizzle.config.ts",
      "./eslint.config.mjs",
      "./next.config.ts",
      "./package.json",
      "./package-lock.json",
      "./postcss.config.mjs",
      "./tsconfig.json",
      "./src/**/*",
      "./public/**/*",
    ],
  },
};

export default nextConfig;
