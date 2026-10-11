import path from "node:path"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // RFQ drawings are capped at 4 MB in lib/schemas/rfq.ts (Vercel's body limit is 4.5 MB).
  experimental: {
    serverActions: { bodySizeLimit: "4.4mb" },
  },
  // Images and videos aren't content-hashed, so cache for a week and refresh
  // in the background rather than marking them immutable.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
    return [
      { source: "/images/:path*", headers: cache },
      { source: "/videos/:path*", headers: cache },
      { source: "/brochure.pdf", headers: cache },
    ]
  },
  // Lets every module `@use "abstracts" as *;` without relative paths.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "styles")],
  },
}

export default nextConfig
