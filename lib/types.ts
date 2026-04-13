export interface Artwork {
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  image: string;
}

export interface Artist {
  slug: string;
  name: string;
  medium: "Painter" | "Sculptor";
  location: string;
  bio: string;
  portrait: string;
  featured: boolean;
  works: Artwork[];
}

export interface Exhibition {
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  description: string;
  image: string;
  artistSlugs: string[];
  status: "upcoming" | "current" | "past";
}
