import { unstable_cache } from "next/cache";
import type { Collection } from "@/lib/types";
import { getCollectionsFromDrive, isDriveConfigured } from "@/lib/drive";

/**
 * The single source of collections for the homepage.
 *
 * When Google Drive credentials are configured, this lists the shared Drive
 * folder (each subfolder = one collection, its images = the carousel). The
 * result is cached and revalidated every 10 minutes, so an upload by your
 * brother appears on the site automatically within that window — no deploy.
 *
 * Without credentials (e.g. local dev, preview before setup), it falls back to
 * the demo photos below so the page always renders. Either way it returns the
 * same `Collection[]` shape, so the carousel/lightbox components are unaffected.
 *
 * The demo placeholders are generic photography (Lorem Picsum) standing in for
 * real artworks, sized in mixed orientations.
 */

const REVALIDATE_SECONDS = 600; // 10 minutes

// Helper: build a Lorem Picsum URL + matching intrinsic dimensions.
function demoImage(
  seed: string,
  width: number,
  height: number,
  alt: string
): Collection["images"][number] {
  return {
    id: seed,
    src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    alt,
    width,
    height,
  };
}

const collections: Collection[] = [
  {
    id: "modern-masters",
    title: "Modern Masters",
    images: [
      demoImage("nekave-mm-1", 900, 1200, "Modern Masters — work 1"),
      demoImage("nekave-mm-2", 1400, 900, "Modern Masters — work 2"),
      demoImage("nekave-mm-3", 1000, 1000, "Modern Masters — work 3"),
      demoImage("nekave-mm-4", 800, 1150, "Modern Masters — work 4"),
      demoImage("nekave-mm-5", 1300, 870, "Modern Masters — work 5"),
      demoImage("nekave-mm-6", 950, 1250, "Modern Masters — work 6"),
    ],
  },
  {
    id: "abstract-horizons",
    title: "Abstract Horizons",
    images: [
      demoImage("nekave-ah-1", 1400, 900, "Abstract Horizons — work 1"),
      demoImage("nekave-ah-2", 850, 1200, "Abstract Horizons — work 2"),
      demoImage("nekave-ah-3", 1200, 800, "Abstract Horizons — work 3"),
      demoImage("nekave-ah-4", 1000, 1000, "Abstract Horizons — work 4"),
      demoImage("nekave-ah-5", 760, 1100, "Abstract Horizons — work 5"),
      demoImage("nekave-ah-6", 1350, 900, "Abstract Horizons — work 6"),
      demoImage("nekave-ah-7", 900, 1180, "Abstract Horizons — work 7"),
    ],
  },
  {
    id: "sculpture-and-form",
    title: "Sculpture & Form",
    images: [
      demoImage("nekave-sf-1", 820, 1230, "Sculpture & Form — work 1"),
      demoImage("nekave-sf-2", 1250, 830, "Sculpture & Form — work 2"),
      demoImage("nekave-sf-3", 980, 1100, "Sculpture & Form — work 3"),
      demoImage("nekave-sf-4", 1100, 1100, "Sculpture & Form — work 4"),
      demoImage("nekave-sf-5", 880, 1200, "Sculpture & Form — work 5"),
    ],
  },
];

const getCachedDriveCollections = unstable_cache(
  getCollectionsFromDrive,
  ["nekave-collections"],
  { revalidate: REVALIDATE_SECONDS, tags: ["collections"] }
);

export async function getCollections(): Promise<Collection[]> {
  if (!isDriveConfigured()) {
    return collections;
  }

  try {
    return await getCachedDriveCollections();
  } catch (error) {
    // Never break the homepage on a transient Drive/auth failure.
    console.error("[collections] Drive fetch failed:", error);
    return [];
  }
}
