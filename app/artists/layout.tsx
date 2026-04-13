import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Explore contemporary painters and sculptors represented by NEKAVE Artists Management.",
  openGraph: {
    title: "Artists | NEKAVE",
    description:
      "Explore contemporary painters and sculptors represented by NEKAVE Artists Management.",
  },
};

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
