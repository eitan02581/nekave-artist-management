import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gallery images bypass the Vercel image optimizer entirely (its free
  // quota 402s when exhausted): lib/drive-image-loader.ts routes Drive
  // thumbnails through the /api/img proxy and passes the demo Picsum
  // fallback straight through, so no remotePatterns are needed.
};

export default nextConfig;
