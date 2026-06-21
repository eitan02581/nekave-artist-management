"use client";

import CollectionCarousel from "@/components/home/CollectionCarousel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Collection } from "@/lib/types";

export default function CollectionsSection({
  collections,
}: {
  collections: Collection[];
}) {
  if (collections.length === 0) return null;

  return (
    <section id="collections" className="scroll-mt-12 py-24 md:py-32">
      <ScrollReveal variant="fade-up" className="text-center mb-16 md:mb-20">
        <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/70">
          Collections
        </span>
      </ScrollReveal>

      <div className="flex flex-col gap-24 md:gap-32">
        {collections.map((collection) => (
          <ScrollReveal key={collection.id} variant="fade-up">
            <CollectionCarousel collection={collection} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
