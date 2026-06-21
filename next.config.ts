import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Both hosts 302-redirect to a CDN, and Next follows allowed-pattern
    // redirects without re-checking, so only the entry host needs listing.
    remotePatterns: [
      {
        // Live: Google Drive thumbnails for collection images.
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        // Fallback: demo collection photos (Lorem Picsum) when Drive is unset.
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
