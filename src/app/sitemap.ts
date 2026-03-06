import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tejasnaladala.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://tejasnaladala.com/thesis", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://tejasnaladala.com/work", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://tejasnaladala.com/gallery", lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: "https://tejasnaladala.com/arcade", lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: "https://tejasnaladala.com/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: "https://tejasnaladala.com/ocean", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tejasnaladala.com/resume", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
