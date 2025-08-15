// Admin helper for managing city page content

export interface CityContent {
  slug: string // e.g. 'london'
  title: string
  subtitle: string
  description: string
  heroImage: string // public path to image
  introTitle?: string // e.g. 'Enjoy Your Barcelona Trip With Fly Lux Sky'
  introText?: string // e.g. 'Explore Barcelona's rich history and modern charm...'
  ctaTitle?: string
  ctaText?: string
  updated_at?: string
}

export const DEFAULT_CITY_CONTENT: Record<string, CityContent> = {
  london: {
    slug: 'london',
    title: 'London',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United Kingdom',
    heroImage: '/images/london-big.jpg',
    introTitle: 'Enjoy Your London Trip With Fly Lux Sky',
    introText: 'Explore London\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your London Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to London with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare and experience the UK like never before.'
  },
  madrid: {
    slug: 'madrid',
    title: 'Madrid',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Spain',
    heroImage: '/images/madrid.jpg',
    introTitle: 'Enjoy Your Madrid Trip With Fly Lux Sky',
    introText: 'Explore Madrid\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Madrid Business Class Flight Today.',
    ctaText: 'Experience premium travel to Madrid.'
  },
  athens: {
    slug: 'athens',
    title: 'Athens',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Greece',
    heroImage: '/images/athens.jpg',
    introTitle: 'Enjoy Your Athens Trip With Fly Lux Sky',
    introText: 'Explore Athens\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Athens Business Class Flight Today.',
    ctaText: 'Experience premium travel to Athens.'
  },
  rome: {
    slug: 'rome',
    title: 'Rome',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Italy',
    heroImage: '/images/rome.jpg',
    introTitle: 'Enjoy Your Rome Trip With Fly Lux Sky',
    introText: 'Explore Rome\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Rome Business Class Flight Today.',
    ctaText: 'Experience premium travel to Rome.'
  },
  paris: {
    slug: 'paris',
    title: 'Paris',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to France',
    heroImage: '/images/paris.jpg',
    introTitle: 'Enjoy Your Paris Trip With Fly Lux Sky',
    introText: 'Explore Paris\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Paris Business Class Flight Today.',
    ctaText: 'Experience premium travel to Paris.'
  },
  lisbon: {
    slug: 'lisbon',
    title: 'Lisbon',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Portugal',
    heroImage: '/images/lisbon.jpg',
    introTitle: 'Enjoy Your Lisbon Trip With Fly Lux Sky',
    introText: 'Explore Lisbon\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Lisbon Business Class Flight Today.',
    ctaText: 'Experience premium travel to Lisbon.'
  }
}

const CITY_CONTENT_KEY = 'flyluxsky_cities_content'

export const loadCitiesContent = async (): Promise<Record<string, CityContent>> => {
  try {
    const stored = localStorage.getItem(CITY_CONTENT_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}

  try {
    const res = await fetch('/api/cities/content', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const payload: Record<string, CityContent> = data.content || {}
      return Object.keys(DEFAULT_CITY_CONTENT).reduce((acc, key) => {
        acc[key] = { ...DEFAULT_CITY_CONTENT[key], ...(payload[key] || {}) }
        return acc
      }, {} as Record<string, CityContent>)
    }
  } catch {}

  return DEFAULT_CITY_CONTENT
}

export const saveCitiesContent = (content: Record<string, CityContent>) => {
  const withTs = Object.fromEntries(
    Object.entries(content).map(([k, v]) => [k, { ...v, updated_at: new Date().toISOString() }])
  )
  localStorage.setItem(CITY_CONTENT_KEY, JSON.stringify(withTs))
}

export const exportCitiesContent = (content: Record<string, CityContent>) => JSON.stringify(content, null, 2)

export const importCitiesContent = (json: string): Record<string, CityContent> => {
  const data = JSON.parse(json)
  return data as Record<string, CityContent>
}