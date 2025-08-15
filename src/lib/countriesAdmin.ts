// Admin helper for managing country page content

export interface CountryContent {
  slug: string // e.g. 'united-kingdom'
  title: string
  subtitle: string
  description: string
  heroImage: string // public path to image
  introTitle?: string // e.g. 'Enjoy Your United Kingdom Trip With Fly Lux Sky'
  introText?: string // e.g. 'Explore United Kingdom's rich history and modern charm...'
  ctaTitle?: string
  ctaText?: string
  updated_at?: string
}

export const DEFAULT_COUNTRY_CONTENT: Record<string, CountryContent> = {
  'united-kingdom': {
    slug: 'united-kingdom',
    title: 'United Kingdom',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United Kingdom',
    heroImage: '/images/uk.jpg',
    introTitle: 'Enjoy Your United Kingdom Trip With Fly Lux Sky',
    introText: 'Explore the United Kingdom\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your United Kingdom Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to the United Kingdom with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare and experience the UK like never before.'
  },
  'portugal': {
    slug: 'portugal',
    title: 'Portugal',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Portugal',
    heroImage: '/images/portugal.jpg',
    introTitle: 'Enjoy Your Portugal Trip With Fly Lux Sky',
    introText: 'Explore Portugal\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Portugal Business Class Flight Today.',
    ctaText: 'Experience premium travel to Portugal.'
  },
  'greece': {
    slug: 'greece',
    title: 'Greece',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Greece',
    heroImage: '/images/greece.jpg',
    introTitle: 'Enjoy Your Greece Trip With Fly Lux Sky',
    introText: 'Explore Greece\'s ancient history and stunning islands. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Greece Business Class Flight Today.',
    ctaText: 'Experience premium travel to Greece.'
  },
  'france': {
    slug: 'france',
    title: 'France',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to France',
    heroImage: '/images/france.jpg',
    introTitle: 'Enjoy Your France Trip With Fly Lux Sky',
    introText: 'Explore France\'s rich culture and elegant charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your France Business Class Flight Today.',
    ctaText: 'Experience premium travel to France.'
  },
  'spain': {
    slug: 'spain',
    title: 'Spain',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Spain',
    heroImage: '/images/spain.jpg',
    introTitle: 'Enjoy Your Spain Trip With Fly Lux Sky',
    introText: 'Explore Spain\'s vibrant culture and beautiful landscapes. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Spain Business Class Flight Today.',
    ctaText: 'Experience premium travel to Spain.'
  },
  'italy': {
    slug: 'italy',
    title: 'Italy',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Italy',
    heroImage: '/images/italy.jpg',
    introTitle: 'Enjoy Your Italy Trip With Fly Lux Sky',
    introText: 'Explore Italy\'s rich history and artistic heritage. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Italy Business Class Flight Today.',
    ctaText: 'Experience premium travel to Italy.'
  }
}

const COUNTRY_CONTENT_KEY = 'flyluxsky_countries_content'

export const loadCountriesContent = async (): Promise<Record<string, CountryContent>> => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COUNTRY_CONTENT_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all countries exist
        return { ...DEFAULT_COUNTRY_CONTENT, ...parsed }
      }
    }
  } catch (error) {
    // Failed to load countries content from localStorage
  }
  return DEFAULT_COUNTRY_CONTENT
}

export const saveCountriesContent = (content: Record<string, CountryContent>) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COUNTRY_CONTENT_KEY, JSON.stringify(content))
    }
  } catch (error) {
    // Failed to save countries content to localStorage
  }
}

export const exportCountriesContent = (content: Record<string, CountryContent>) => JSON.stringify(content, null, 2)

export const importCountriesContent = (json: string): Record<string, CountryContent> => {
  return JSON.parse(json)
}