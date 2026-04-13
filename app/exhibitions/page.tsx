import type { Metadata } from "next";
import { getExhibitions, getArtistsForExhibition } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ExhibitionCard from "@/components/exhibitions/ExhibitionCard";

export const metadata: Metadata = {
  title: "Exhibitions",
};

export default function ExhibitionsPage() {
  const exhibitions = getExhibitions();

  const currentAndUpcoming = exhibitions.filter(
    (e) => e.status === "current" || e.status === "upcoming"
  );
  const past = exhibitions.filter((e) => e.status === "past");

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Page header */}
        <ScrollReveal variant="fade-up">
          <div className="mb-16 md:mb-20">
            <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal mb-4">
              Current &amp; Past
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-light text-black tracking-wide">
              Exhibitions
            </h1>
          </div>
        </ScrollReveal>

        {/* Current & Upcoming */}
        {currentAndUpcoming.length > 0 && (
          <div className="space-y-8 mb-20">
            {currentAndUpcoming.map((exhibition, index) => (
              <ExhibitionCard
                key={exhibition.slug}
                exhibition={exhibition}
                artists={getArtistsForExhibition(exhibition)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Past Exhibitions */}
        {past.length > 0 && (
          <div>
            <ScrollReveal variant="fade-up">
              <h2 className="font-display text-3xl md:text-4xl font-light text-black tracking-wide mb-10">
                Past Exhibitions
              </h2>
            </ScrollReveal>

            <div className="space-y-8 opacity-60">
              {past.map((exhibition, index) => (
                <ExhibitionCard
                  key={exhibition.slug}
                  exhibition={exhibition}
                  artists={getArtistsForExhibition(exhibition)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
