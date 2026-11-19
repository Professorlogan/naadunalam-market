import type { NextConfig } from "next";

// `NN_EXPORT=1 npm run build` writes a fully static copy of the site to ./out (used for previews).
const nextConfig: NextConfig = {
  output: process.env.NN_EXPORT ? "export" : undefined,
  trailingSlash: !!process.env.NN_EXPORT,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};
export default nextConfig;
