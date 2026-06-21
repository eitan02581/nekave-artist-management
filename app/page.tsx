import HomeClient from "@/components/home/HomeClient";
import { getCollections } from "@/lib/collections";

// Re-render every 10 minutes so Google Drive uploads appear automatically.
export const revalidate = 600;

export default async function HomePage() {
  const collections = await getCollections();

  return <HomeClient collections={collections} />;
}
