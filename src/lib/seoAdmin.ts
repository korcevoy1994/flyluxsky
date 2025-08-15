// Admin helper for managing SEO metadata

export interface SeoMeta {
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  robotsTxt: string
  canonicalUrl: string
  author: string
  language: string
}

export const DEFAULT_SEO_META: SeoMeta = {
  siteTitle: 'FlyLuxSky — Business Flights',
  siteDescription: 'Your Gateway to Exclusive Business Class Savings',
  siteKeywords: 'business class flights, luxury travel, premium flights, first class',
  ogTitle: 'FlyLuxSky — Business Flights',
  ogDescription: 'Your Gateway to Exclusive Business Class Savings',
  ogImage: '/og.png',
  ogUrl: 'https://flyluxsky.vercel.app/',
  twitterCard: 'summary_large_image',
  twitterTitle: 'FlyLuxSky — Business Flights',
  twitterDescription: 'Your Gateway to Exclusive Business Class Savings',
  twitterImage: '/og.png',
  robotsTxt: 'User-agent: *\nAllow: /',
  canonicalUrl: 'https://flyluxsky.vercel.app/',
  author: 'FlyLuxSky',
  language: 'en'
}

const SEO_META_KEY = 'flyluxsky_seo_meta'

export const loadSeoMeta = (): SeoMeta => {
  if (typeof window === 'undefined') return DEFAULT_SEO_META
  
  try {
    const stored = localStorage.getItem(SEO_META_KEY)
    if (stored) {
      return { ...DEFAULT_SEO_META, ...JSON.parse(stored) }
    }
  } catch {
    // Error loading SEO meta from localStorage
  }
  
  return DEFAULT_SEO_META
}

export const saveSeoMeta = (seoMeta: SeoMeta): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SEO_META_KEY, JSON.stringify(seoMeta))
  } catch {
    // Error saving SEO meta to localStorage
  }
}

export const resetSeoMeta = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(SEO_META_KEY)
  } catch {
    // Error resetting SEO meta
  }
}