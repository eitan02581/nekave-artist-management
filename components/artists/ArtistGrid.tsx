"use client";

import ArtistCard from "@/components/artists/ArtistCard";
import type { Artist } from "@/lib/types";

interface ArtistGridProps {
  artists: Artist[];
  variant?: "featured" | "full";
}

export default function ArtistGrid({
  artists,
  variant = "full",
}: ArtistGridProps) {
  if (variant === "full") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {artists.map((artist, index) => (
          <ArtistCard
            key={artist.slug}
            artist={artist}
            size="medium"
            index={index}
          />
        ))}
      </div>
    );
  }

  // Featured variant: asymmetric masonry-style grid
  // First 2 artists get large cards with wider column spans,
  // remaining artists fill in as medium cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-auto">
      {artists.map((artist, index) => {
        const isLarge = index < 2;
        const size = isLarge ? "large" : "medium";

        // Asymmetric column spans for the featured layout:
        // Card 0: spans 7 cols, Card 1: spans 5 cols,
        // Remaining cards: span 4 cols each (3 per row)
        let colSpanClass: string;
        if (index === 0) {
          colSpanClass = "lg:col-span-7";
        } else if (index === 1) {
          colSpanClass = "lg:col-span-5";
        } else {
          colSpanClass = "lg:col-span-4";
        }

        return (
          <div key={artist.slug} className={colSpanClass}>
            <ArtistCard artist={artist} size={size} index={index} />
          </div>
        );
      })}
    </div>
  );
}
