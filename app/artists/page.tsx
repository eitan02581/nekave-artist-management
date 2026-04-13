"use client";

import { useState } from "react";
import artistsData from "@/data/artists.json";
import type { Artist } from "@/lib/types";
import ArtistFilter from "@/components/artists/ArtistFilter";
import ArtistCard from "@/components/artists/ArtistCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const artists = artistsData as Artist[];

type FilterValue = "All" | "Painter" | "Sculptor";

export default function ArtistsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");

  const filteredArtists =
    activeFilter === "All"
      ? artists
      : artists.filter((artist) => artist.medium === activeFilter);

  return (
    <section className="px-8 md:px-16 py-24 md:py-32">
      {/* Eyebrow */}
      <ScrollReveal variant="fade">
        <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-silver bg-black/[0.03] ring-1 ring-black/[0.06] rounded-full px-4 py-1.5 mb-6">
          Represented
        </span>
      </ScrollReveal>

      {/* Page heading */}
      <ScrollReveal variant="fade-up" delay={0.1}>
        <h1 className="font-display text-5xl md:text-6xl font-light text-black mb-12">
          Artists
        </h1>
      </ScrollReveal>

      {/* Filter */}
      <ScrollReveal variant="fade-up" delay={0.2}>
        <div className="mb-16">
          <ArtistFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </ScrollReveal>

      {/* Artist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArtists.map((artist, index) => (
          <ArtistCard key={artist.slug} artist={artist} index={index} />
        ))}
      </div>
    </section>
  );
}
