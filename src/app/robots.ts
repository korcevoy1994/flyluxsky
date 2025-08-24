import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/thank-you/', '/searching/', '/api/'],
      },
    ],
    sitemap: 'https://flyluxsky.vercel.app/sitemap.xml',
    host: 'https://flyluxsky.vercel.app',
  }
}