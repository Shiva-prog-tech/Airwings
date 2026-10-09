import path from "node:path"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // RFQ drawings are capped at 4 MB in lib/schemas/rfq.ts (Vercel's body limit is 4.5 MB).
  experimental: {
    serverActions: { bodySizeLimit: "4.4mb" },
  },
  // Lets every module `@use "abstracts" as *;` without relative paths.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "styles")],
  },
}

export default nextConfig
