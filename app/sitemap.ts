import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL;
  if (!base) return [];
  const paths = [
    "/",
    "/guides",
    "/recommend-school",
    ...[
      "start-a-club",
      "first-meetings",
      "curriculum",
      "ysws",
      "low-resource",
      "school-outreach",
      "organize-and-lead",
    ].map((slug) => `/guides/${slug}`),
  ];
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
