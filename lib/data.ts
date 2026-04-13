import type { Artist, Exhibition } from "@/lib/types";
import artistsData from "@/data/artists.json";
import exhibitionsData from "@/data/exhibitions.json";

const artists: Artist[] = artistsData as Artist[];
const exhibitions: Exhibition[] = exhibitionsData as Exhibition[];

export function getArtists(): Artist[] {
  return artists;
}

export function getArtist(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getFeaturedArtists(): Artist[] {
  return artists.filter((artist) => artist.featured);
}

export function getExhibitions(): Exhibition[] {
  return [...exhibitions].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function getExhibition(slug: string): Exhibition | undefined {
  return exhibitions.find((exhibition) => exhibition.slug === slug);
}

export function getArtistsByMedium(medium: "Painter" | "Sculptor"): Artist[] {
  return artists.filter((artist) => artist.medium === medium);
}

export function getArtistsForExhibition(exhibition: Exhibition): Artist[] {
  return exhibition.artistSlugs
    .map((slug) => artists.find((artist) => artist.slug === slug))
    .filter((artist): artist is Artist => artist !== undefined);
}
