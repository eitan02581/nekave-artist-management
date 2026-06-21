import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand refresh endpoint.
 *
 * Opening this URL purges the cached Drive listing and the homepage so the
 * latest folder/title/image changes appear immediately, instead of waiting for
 * the ~10-minute automatic window. Intended as a bookmark, e.g.
 *   https://your-site.com/api/refresh?secret=YOUR_SECRET
 *
 * Protected by REVALIDATE_SECRET so it can't be triggered by random visitors.
 */

function page(title: string, message: string, accent: string): Response {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
             font-family: ui-sans-serif, system-ui, sans-serif; background: #fafafa; color: #1a1a1a; }
      .card { text-align: center; padding: 3rem 2rem; }
      .mark { font-size: 2.5rem; color: ${accent}; }
      h1 { font-weight: 300; letter-spacing: 0.04em; font-size: 1.4rem; margin: 1rem 0 0.5rem; }
      p { color: #6b6b6b; font-size: 0.95rem; margin: 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="mark">${title.startsWith("Refreshed") ? "✓" : "✕"}</div>
      <h1>${title}</h1>
      <p>${message}</p>
    </div>
  </body>
</html>`;
  const status = title.startsWith("Refreshed") ? 200 : 401;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request): Promise<Response> {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return page(
      "Not authorized",
      "This refresh link is missing or has the wrong secret.",
      "#8b2e2e"
    );
  }

  // Purge the cached Drive listing (2nd arg = stale-while-revalidate window)
  // and regenerate the homepage so changes show on the next load.
  revalidateTag("collections", "max");
  revalidatePath("/");

  return page(
    "Refreshed",
    "Your latest Google Drive changes are now live on the website.",
    "#b8924a"
  );
}
