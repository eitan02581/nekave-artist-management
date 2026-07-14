/**
 * Same-origin proxy for Google Drive thumbnails.
 *
 * Serving Drive thumbnails to browsers directly breaks two ways: Vercel's
 * image optimizer 402s once its free quota is spent, and hotlinking
 * drive.google.com gets per-session rate-limited (Google serves a non-image
 * throttle page that Chrome blocks with ERR_BLOCKED_BY_ORB). This route
 * fetches the thumbnail server-side with retries and returns it with a long
 * CDN cache lifetime, so each image size hits Drive roughly once per region
 * instead of once per visitor.
 */
import type { NextRequest } from "next/server";

// The widths next/image generates (deviceSizes + imageSizes defaults).
// Snapping to this set bounds the number of CDN cache variants per image.
const WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

const RETRIES = 3;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^[\w-]{10,}$/.test(id)) {
    return new Response("Invalid image id", { status: 400 });
  }

  const requested = Number(request.nextUrl.searchParams.get("w"));
  const width =
    WIDTHS.find((w) => w >= requested) ?? WIDTHS[WIDTHS.length - 1];

  const upstream = `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

  let res: Response | null = null;
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
    try {
      res = await fetch(upstream, { redirect: "follow", cache: "no-store" });
    } catch {
      continue; // transient network failure — retry
    }
    if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
      return new Response(res.body, {
        headers: {
          "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
          // Browser: 1 day. Vercel CDN: 1 year, serve stale while refreshing.
          "Cache-Control":
            "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
        },
      });
    }
  }

  return new Response("Upstream image unavailable", { status: 502 });
}
