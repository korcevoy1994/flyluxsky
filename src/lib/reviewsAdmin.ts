// Admin reviews/testimonials management

export interface ReviewData {
  id?: string
  name: string
  avatar: string
  rating: number
  date: string
  review: string
  created_at?: string
  updated_at?: string
}

export interface ReviewsConfiguration {
  reviews: ReviewData[]
  lastUpdated: string
}

// Default reviews based on current testimonials-section.tsx
export const defaultReviews: ReviewData[] = [
  {
    id: '1',
    name: "John Cirillo",
    avatar: "/images/avatars/avatar-john-cirillo.png",
    rating: 5,
    date: "Mar 6, 2025",
    review: "Daniel Hoffman provided excellent customer service for my recent inquiry. He was quick to respond and is certainly an asset for his company..."
  },
  {
    id: '2',
    name: "Mrs. Deborah Rydberg",
    avatar: "/images/avatars/avatar-deborah-rydberg.png",
    rating: 5,
    date: "Mar 6, 2025",
    review: "Anthony was able to get us last minute flights to Paris. The ones we originally chose were sold out by the time I got the forms completed..."
  },
  {
    id: '3',
    name: "denise",
    avatar: "/images/avatars/avatar-denise.png",
    rating: 5,
    date: "Mar 6, 2025",
    review: "Daniel is extremely helpful at finding us the flight we wanted at the price we never expected! He is responsive and thorough and will walk you..."
  },
  {
    id: '4',
    name: "earl gress",
    avatar: "/images/avatars/avatar-earl-gress.png",
    rating: 5,
    date: "Mar 6, 2025",
    review: "Sergio our personal customer service representative was able to make our Buck List trip to Ireland a reality. His professionalism and attention..."
  },
  {
    id: '5',
    name: "Sarah Mitchell",
    avatar: "", 
    rating: 5,
    date: "Mar 5, 2025",
    review: "Amazing service! They found me the perfect flight within my budget and the booking process was seamless. Highly recommend for all your travel needs."
  },
  {
    id: '6',
    name: "Michael Johnson",
    avatar: "", 
    rating: 5,
    date: "Mar 4, 2025",
    review: "The team went above and beyond to help me change my flight dates. Professional, efficient, and genuinely caring customer service. Thank you!"
  },
  {
    id: '7',
    name: "Emily Davis",
    avatar: "", 
    rating: 5,
    date: "Mar 3, 2025",
    review: "Best travel booking experience I've ever had. The staff was knowledgeable, friendly, and helped me save hundreds on my international flight."
  },
  {
    id: '8',
    name: "Robert Wilson",
    avatar: "", 
    rating: 5,
    date: "Mar 2, 2025",
    review: "Outstanding service from start to finish. They made my complex multi-city trip planning effortless and stress-free. Will definitely use again!"
  }
]

// Local storage key
const REVIEWS_CONFIG_KEY = 'flyluxsky_reviews_config'

// Save reviews to localStorage
export const saveReviewsConfig = (reviews: ReviewData[]): void => {
  try {
    const config: ReviewsConfiguration = {
      reviews,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(REVIEWS_CONFIG_KEY, JSON.stringify(config))
  } catch {
    // Failed to save reviews configuration
    throw new Error('Failed to save reviews configuration')
  }
}

// Load reviews from localStorage
export const loadReviewsConfig = (): ReviewData[] => {
  try {
    const stored = localStorage.getItem(REVIEWS_CONFIG_KEY)
    if (stored) {
      const config: ReviewsConfiguration = JSON.parse(stored)
      return config.reviews || defaultReviews
    }
    return defaultReviews
  } catch {
    // Failed to load reviews configuration
    return defaultReviews
  }
}

// Ensure reviews config is available in localStorage
// Ensure reviews config is available. Prefer server/API first, then fall back to local, then defaults.
export const ensureReviewsConfigLoaded = async (): Promise<ReviewData[]> => {
  // 1) Try API/Supabase first
  try {
    const res = await fetch('/api/reviews', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const rawReviews = Array.isArray(data?.reviews) ? data.reviews : []
      
      // Map Supabase schema to ReviewData format
      const reviews: ReviewData[] = rawReviews.map((row: Record<string, unknown>) => ({
        id: row.id || generateReviewId(),
        name: row.name || '',
        avatar: row.avatar_url || '',
        rating: Math.max(1, Math.min(5, Number(row.rating ?? 5))),
        date: row.review_date || (row.created_at && typeof row.created_at === 'string' ? new Date(row.created_at).toLocaleDateString() : ''),
        review: row.text || '',
        created_at: typeof row.created_at === 'string' ? row.created_at : undefined,
        updated_at: typeof row.updated_at === 'string' ? row.updated_at : undefined
      }))
      
      if (reviews.length > 0) {
        try { saveReviewsConfig(reviews) } catch {}
        return reviews
      }
    }
  } catch {
    // ignore and fall back
  }

  // 2) Fall back to local storage
  try {
    const stored = localStorage.getItem(REVIEWS_CONFIG_KEY)
    if (stored) {
      const config: ReviewsConfiguration = JSON.parse(stored)
      return config.reviews || defaultReviews
    }
  } catch {
    // ignore json/localStorage issues
  }

  // 3) Default seed data
  return defaultReviews
}

// Generate unique ID for new reviews
export const generateReviewId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Add new review
export const addReview = (reviews: ReviewData[], newReview: Omit<ReviewData, 'id'>): ReviewData[] => {
  const reviewWithId: ReviewData = {
    ...newReview,
    id: generateReviewId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  return [reviewWithId, ...reviews]
}

// Update existing review
export const updateReview = (reviews: ReviewData[], id: string, updates: Partial<ReviewData>): ReviewData[] => {
  return reviews.map(review => 
    review.id === id 
      ? { ...review, ...updates, updated_at: new Date().toISOString() }
      : review
  )
}

// Delete review
export const deleteReview = (reviews: ReviewData[], id: string): ReviewData[] => {
  return reviews.filter(review => review.id !== id)
}

// Export reviews as JSON
export const exportReviewsConfig = (reviews: ReviewData[]): string => {
  return JSON.stringify({ reviews, lastUpdated: new Date().toISOString() }, null, 2)
}

// Import reviews from JSON
export const importReviewsConfig = (jsonString: string): ReviewData[] => {
  try {
    const parsed = JSON.parse(jsonString) as { reviews?: unknown }
    const arr = Array.isArray(parsed.reviews) ? parsed.reviews : []
    return arr.map((item, index) => {
      const review = item as Partial<ReviewData>
      return {
        id: review.id || generateReviewId(),
        name: review.name || `User ${index + 1}`,
        avatar: review.avatar || '',
        rating: Math.max(1, Math.min(5, parseInt(String(review.rating)) || 5)),
        date: review.date || new Date().toLocaleDateString(),
        review: review.review || '',
        created_at: review.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })
  } catch {
    // Failed to import reviews configuration
    throw new Error('Invalid JSON format or reviews structure')
  }
}