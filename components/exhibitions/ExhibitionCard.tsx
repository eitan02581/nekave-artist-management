"use client";

import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Exhibition, Artist } from "@/lib/types";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  artists?: Artist[];
  index?: number;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  const monthShort = (d: Date) =>
    d.toLocaleString("en-US", { month: "short" });
  const day = (d: Date) => d.getDate();
  const year = (d: Date) => d.getFullYear();

  const sameYear = year(start) === year(end);

  if (sameYear) {
    return `${monthShort(start)} ${day(start)} — ${monthShort(end)} ${day(end)}, ${year(end)}`;
  }

  return `${monthShort(start)} ${day(start)}, ${year(start)} — ${monthShort(end)} ${day(end)}, ${year(end)}`;
}

function StatusBadge({ status }: { status: Exhibition["status"] }) {
  const config = {
    current: {
      label: "Current",
      className: "bg-gold/10 text-gold ring-gold/20",
    },
    upcoming: {
      label: "Upcoming",
      className: "bg-charcoal/5 text-charcoal ring-charcoal/10",
    },
    past: {
      label: "Past",
      className: "bg-silver/10 text-silver ring-silver/20",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ring-1 ${className}`}
    >
      {label}
    </span>
  );
}

export default function ExhibitionCard({
  exhibition,
  artists = [],
  index = 0,
}: ExhibitionCardProps) {
  return (
    <ScrollReveal delay={index * 0.1} variant="fade-up">
      {/* Double-bezel outer shell */}
      <div className="rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] p-1.5">
        {/* Inner core */}
        <div className="rounded-[calc(1.5rem-0.375rem)] overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row">
            {/* Image section */}
            <div className="md:w-[45%] md:flex-shrink-0">
              <PlaceholderImage
                label={exhibition.title}
                aspectRatio="16/10"
                variant="exhibition"
                className="w-full h-full"
              />
            </div>

            {/* Info section */}
            <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={exhibition.status} />
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-medium text-black tracking-wide mb-3">
                {exhibition.title}
              </h3>

              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-silver mb-4">
                {formatDateRange(exhibition.startDate, exhibition.endDate)}
              </p>

              <div className="space-y-1 mb-5">
                <p className="font-body text-sm text-charcoal">
                  {exhibition.venue}
                </p>
                <p className="font-body text-xs text-silver">
                  {exhibition.location}
                </p>
              </div>

              {artists.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-silver mr-1">
                    Artists
                  </span>
                  {artists.map((artist, i) => (
                    <span key={artist.slug} className="inline-flex items-center">
                      <Link
                        href={`/artists/${artist.slug}`}
                        className="font-body text-xs text-charcoal hover:text-gold transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      >
                        {artist.name}
                      </Link>
                      {i < artists.length - 1 && (
                        <span className="text-silver/40 ml-1.5">/</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
