import type { MetadataRoute } from 'next'

const siteUrl = process.env.KINDE_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL('/', siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
