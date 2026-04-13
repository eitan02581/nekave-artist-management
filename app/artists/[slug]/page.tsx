import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtists, getArtist } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const artists = getArtists();
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);

  if (!artist) {
    return { title: "Artist Not Found" };
  }

  return { title: artist.name };
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtist(slug);

  if (!artist) {
    notFound();
  }

  const [firstWork, ...remainingWorks] = artist.works;

  return (
    <section className="px-8 md:px-16 py-24 md:py-32">
      {/* Back link */}
      <ScrollReveal variant="fade" delay={0}>
        <Link
          href="/artists"
          className="inline-block font-body text-sm text-silver hover:text-charcoal transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] mb-16"
        >
          &larr; Back to Artists
        </Link>
      </ScrollReveal>

      {/* Artist header */}
      <ScrollReveal variant="fade-up" delay={0.1}>
        <h1 className="font-display text-5xl md:text-6xl font-light text-black mb-4">
          {artist.name}
        </h1>
        <p className="font-mono text-xs text-silver uppercase tracking-[0.15em]">
          {artist.medium} &mdash; {artist.location}
        </p>
      </ScrollReveal>

      {/* Bio section */}
      <ScrollReveal variant="fade-up" delay={0.2}>
        <blockquote className="border-l-2 border-gold pl-6 mt-16 mb-24 max-w-3xl">
          <p className="font-display text-xl md:text-2xl italic text-charcoal/80 leading-relaxed">
            {artist.bio}
          </p>
        </blockquote>
      </ScrollReveal>

      {/* Selected Works heading */}
      <ScrollReveal variant="fade-up" delay={0.1}>
        <h2 className="font-display text-3xl md:text-4xl font-light text-black mb-12">
          Selected Works
        </h2>
      </ScrollReveal>

      {/* First artwork - full width */}
      {firstWork && (
        <div className="mb-16">
          <ScrollReveal variant="unveil">
            <div className="rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] p-1.5">
              <div className="rounded-[calc(1.5rem-0.375rem)] overflow-hidden">
                <PlaceholderImage
                  label={firstWork.title}
                  aspectRatio="16/9"
                  variant="artwork"
                />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="mt-4 space-y-0.5">
              <p className="font-mono text-xs text-silver uppercase tracking-[0.15em]">
                {firstWork.title}, {firstWork.year}
              </p>
              <p className="font-mono text-xs text-silver tracking-[0.1em]">
                {firstWork.medium}
              </p>
              <p className="font-mono text-xs text-silver tracking-[0.1em]">
                {firstWork.dimensions}
              </p>
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Remaining artworks - 2-column grid */}
      {remainingWorks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {remainingWorks.map((work, index) => (
            <div key={work.title}>
              <ScrollReveal variant="fade-up" delay={index * 0.1}>
                <div className="rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] p-1.5">
                  <div className="rounded-[calc(1.5rem-0.375rem)] overflow-hidden">
                    <PlaceholderImage
                      label={work.title}
                      aspectRatio="4/3"
                      variant="artwork"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-0.5">
                  <p className="font-mono text-xs text-silver uppercase tracking-[0.15em]">
                    {work.title}, {work.year}
                  </p>
                  <p className="font-mono text-xs text-silver tracking-[0.1em]">
                    {work.medium}
                  </p>
                  <p className="font-mono text-xs text-silver tracking-[0.1em]">
                    {work.dimensions}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <ScrollReveal variant="fade-up" delay={0.2}>
        <div className="text-center py-24">
          <Link
            href="#"
            className="inline-block bg-gold text-white font-body text-sm uppercase tracking-wider rounded-full px-8 py-4 hover:bg-gold-hover transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            Inquire About This Artist
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
