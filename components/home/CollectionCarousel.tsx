"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import driveImageLoader from "@/lib/drive-image-loader";
import Lightbox from "@/components/ui/Lightbox";
import type { Collection } from "@/lib/types";

interface CollectionCarouselProps {
  collection: Collection;
}

export default function CollectionCarousel({
  collection,
}: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    // Use absolute value so this also behaves under RTL (negative scrollLeft).
    const pos = Math.abs(el.scrollLeft);
    setCanScrollLeft(pos > 4);
    setCanScrollRight(pos < maxScroll - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByViewport = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Heading */}
      <h3 className="font-display text-2xl md:text-3xl font-light text-charcoal tracking-wide text-center mb-8 md:mb-10 px-6">
        {collection.title}
      </h3>

      <div className="relative group">
        {/* Prev arrow (desktop) */}
        <button
          type="button"
          onClick={() => scrollByViewport("left")}
          aria-label="Scroll left"
          className={`hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-charcoal shadow-[0_2px_20px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scroll strip */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 md:px-16 py-2"
        >
          {collection.images.map((image, i) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open ${image.alt}`}
              className="snap-start shrink-0 relative overflow-hidden bg-off-white cursor-pointer"
            >
              <Image
                loader={driveImageLoader}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 768px) 70vw, 30vw"
                className="h-64 md:h-[26rem] w-auto object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>

        {/* Next arrow (desktop) */}
        <button
          type="button"
          onClick={() => scrollByViewport("right")}
          aria-label="Scroll right"
          className={`hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-charcoal shadow-[0_2px_20px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <Lightbox
        images={collection.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
