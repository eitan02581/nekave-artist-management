"use client";

interface PlaceholderImageProps {
  label?: string;
  className?: string;
  aspectRatio?: string;
  variant?: "artwork" | "portrait" | "exhibition";
}

const palettes = {
  artwork: [
    { bg: "#E8E0D4", accent: "#C4B8A8" },
    { bg: "#D4D8DC", accent: "#B8BCC0" },
    { bg: "#DCD4C8", accent: "#C0B8AC" },
    { bg: "#D0D8D4", accent: "#B4BCB8" },
    { bg: "#E0D8D0", accent: "#C4BCB4" },
    { bg: "#D8D4E0", accent: "#BCB8C4" },
  ],
  portrait: [{ bg: "#E4DCD4", accent: "#C8C0B8" }],
  exhibition: [{ bg: "#DCD8D0", accent: "#C0BCB4" }],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function PlaceholderImage({
  label = "Artwork",
  className = "",
  aspectRatio = "4/3",
  variant = "artwork",
}: PlaceholderImageProps) {
  const palette = palettes[variant];
  const colorIdx = hashString(label) % palette.length;
  const { bg, accent } = palette[colorIdx];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio, backgroundColor: bg }}
    >
      {/* Abstract geometric shapes to suggest art */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill={bg} />
        <circle cx="280" cy="100" r="60" fill={accent} opacity="0.5" />
        <rect
          x="50"
          y="120"
          width="120"
          height="80"
          fill={accent}
          opacity="0.3"
          transform="rotate(-5 110 160)"
        />
        <line
          x1="100"
          y1="50"
          x2="300"
          y2="250"
          stroke={accent}
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex items-end p-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-40"
          style={{ color: "#1a1a1a" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
