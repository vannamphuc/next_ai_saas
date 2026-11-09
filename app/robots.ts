import type { MetadataRoute } from 'next'

const siteUrl = process.env.KINDE_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workspace', '/api/'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
