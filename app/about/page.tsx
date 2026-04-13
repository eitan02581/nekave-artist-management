import type { Metadata } from "next";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
};

const values = [
  {
    number: "01",
    title: "Artist-First",
    description:
      "Every decision we make begins with what best serves the artist and their practice.",
  },
  {
    number: "02",
    title: "Global Reach",
    description:
      "Connecting our artists with galleries, biennials, and collections across five continents.",
  },
  {
    number: "03",
    title: "Long-Term Vision",
    description:
      "Building careers, not just exhibitions. We invest in the sustained growth of every artist we represent.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <ScrollReveal variant="unveil">
        <PlaceholderImage
          variant="exhibition"
          aspectRatio="21/9"
          label="NEKAVE Gallery"
          className="w-full"
        />
      </ScrollReveal>

      {/* ─── Mission Statement ─── */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <ScrollReveal variant="fade">
            <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal mb-6">
              About
            </span>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl font-light text-black tracking-wide mb-10">
              NEKAVE Artists Management
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="font-body text-lg leading-relaxed text-charcoal/80 mb-6">
              Founded in Tel Aviv, NEKAVE Artists Management represents a
              carefully curated roster of contemporary painters and sculptors
              whose work challenges and redefines the boundaries of their
              respective mediums.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.3}>
            <p className="font-body text-lg leading-relaxed text-charcoal/80 mb-6">
              We believe in building lasting relationships between artists,
              galleries, collectors, and institutions. Our approach is deeply
              personal. We work closely with each artist to develop their
              practice, secure exhibition opportunities, and place their work in
              significant collections worldwide.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.4}>
            <p className="font-body text-lg leading-relaxed text-charcoal/80">
              NEKAVE was established with the conviction that exceptional art
              deserves exceptional representation. We are committed to nurturing
              artistic vision while navigating the complexities of the
              contemporary art market.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="bg-off-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {values.map((value, index) => (
              <ScrollReveal
                key={value.number}
                variant="fade-up"
                delay={index * 0.15}
              >
                <div>
                  <span className="font-mono text-xs text-gold mb-4 block">
                    {value.number}
                  </span>
                  <h3 className="font-display text-2xl text-black tracking-wide mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-silver leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
