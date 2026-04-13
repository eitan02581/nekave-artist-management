"use client";

type FilterValue = "All" | "Painter" | "Sculptor";

interface ArtistFilterProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "All" },
  { label: "Painters", value: "Painter" },
  { label: "Sculptors", value: "Sculptor" },
];

export default function ArtistFilter({
  activeFilter,
  onFilterChange,
}: ArtistFilterProps) {
  return (
    <div className="flex items-center gap-3">
      {filters.map(({ label, value }) => {
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`
              font-body text-sm uppercase tracking-wider px-6 py-2.5 rounded-full
              transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${
                isActive
                  ? "bg-black text-white"
                  : "bg-transparent text-charcoal ring-1 ring-black/10 hover:ring-black/20"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
