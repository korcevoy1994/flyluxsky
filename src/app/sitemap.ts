import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://flyluxsky.vercel.app'
  const lastModified = new Date()

  const staticRoutes = [
    '/',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/all-airlines',
    '/reviews',
    '/search',
    '/top-cities',
    '/top-countries',
  ]

  const airlines = [
    'air-france',
    'american-airlines',
    'british-airlines',
    'emirates-airlines',
    'etihad-airlines',
    'iberia-airlines',
    'lufthansa-airlines',
    'nippon-airlines',
    'qantas-airlines',
    'qatar-airlines',
    'singapore-airlines',
    'swiss-airlines',
    'turkish-airlines',
    'united-airlines',
  ].map((slug) => `/airlines/${slug}`)

  const cities = [
    'amsterdam',
    'athens',
    'barcelona',
    'doha',
    'dubai',
    'frankfurt',
    'istanbul',
    'lisbon',
    'london',
    'madrid',
    'paris',
    'rome',
    'singapore',
    'sydney',
    'tokyo',
  ].map((slug) => `/cities/${slug}`)

  const countries = [
    'australia',
    'france',
    'germany',
    'greece',
    'italy',
    'japan',
    'netherlands',
    'portugal',
    'qatar',
    'singapore',
    'spain',
    'turkey',
    'united-arab-emirates',
    'united-kingdom',
  ].map((slug) => `/countries/${slug}`)

  const urls = [...staticRoutes, ...airlines, ...cities, ...countries]

  return urls.map((path) => ({
    url: `${base}${path}`,
    lastModified,
  }))
}