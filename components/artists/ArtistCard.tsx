"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { Artist } from "@/lib/types";

interface ArtistCardProps {
  artist: Artist;
  size?: "small" | "medium" | "large";
  index?: number;
}

export default function ArtistCard({
  artist,
  size = "medium",
  index = 0,
}: ArtistCardProps) {
  const aspectRatio = size === "large" ? "3/4" : size === "medium" ? "4/5" : "1/1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      <Link href={`/artists/${artist.slug}`} className="group block">
        {/* Double-Bezel outer shell */}
        <div className="rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] p-1.5">
          {/* Inner core */}
          <div className="rounded-[calc(1.5rem-0.375rem)] overflow-hidden bg-white">
            {/* Image container */}
            <div className="relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <PlaceholderImage
                  label={artist.works[0]?.title || artist.name}
                  aspectRatio={aspectRatio}
                  variant="artwork"
                />
              </motion.div>
            </div>

            {/* Card content */}
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-medium text-black tracking-wide group-hover:text-gold transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  {artist.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-silver">
                  {artist.medium}
                </span>
              </div>
              <p className="font-body text-xs text-silver mt-1.5">
                {artist.location}
              </p>
              {/* Gold underline draw animation */}
              <div className="mt-3 h-[1px] bg-gold/0 group-hover:bg-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] origin-left scale-x-0 group-hover:scale-x-100" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
