import type { ImageLoaderProps } from "next/image";

/**
 * Routes gallery images through our own /api/img proxy instead of Vercel's
 * image optimizer. The proxy fetches Drive's server-side-resized thumbnail
 * (`sz=wN`) with retries and long CDN caching — no Vercel transformation
 * quota (which 402s once exhausted), and no per-visitor Drive rate limits
 * from hotlinking drive.google.com in the browser.
 *
 * Non-Drive sources (the demo Picsum fallback) pass through unchanged.
 */
export default function driveImageLoader({
  src,
  width,
}: ImageLoaderProps): string {
  if (src.startsWith("https://drive.google.com/thumbnail")) {
    const id = new URL(src).searchParams.get("id");
    if (id) return `/api/img/${id}?w=${width}`;
  }
  return src;
}
