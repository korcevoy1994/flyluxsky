// Admin helper for managing airline page content

export interface AirlineContent {
  slug: string // e.g. 'emirates-airlines'
  title: string
  subtitle: string
  description: string
  heroImage: string // public path to image
  introTitle?: string
  introText?: string
  ctaTitle?: string
  ctaText?: string
  features?: Array<{
    title: string
    description: string
  }>
  popularRoutes?: Array<{
    from: string
    to: string
    price: string
  }>
  travelClasses?: Array<{
    name: string
    description: string
    features: string[]
  }>
  updated_at?: string
}

export const DEFAULT_AIRLINE_CONTENT: Record<string, AirlineContent> = {
  'emirates-airlines': {
    slug: 'emirates-airlines',
    title: 'Emirates Airlines',
    subtitle: 'Fly Better',
    description: 'Experience luxury in the sky with Emirates Airlines. World-class service, modern fleet, and unparalleled comfort await you.',
    heroImage: '/images/emirates-hero.jpg',
    introTitle: 'Experience the Emirates Difference',
    introText: 'Emirates Airlines redefines luxury air travel with award-winning service, state-of-the-art aircraft, and world-class amenities. From our spacious cabins to our gourmet cuisine, every detail is crafted to make your journey extraordinary.',
    ctaTitle: 'Book Your Emirates Flight Today',
    ctaText: 'Join millions of satisfied passengers who choose Emirates for their premium travel experience. Contact our travel experts to secure your seat.',
    features: [
      {
        title: 'Award-Winning Service',
        description: 'Experience world-class hospitality with our highly trained cabin crew.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on the latest Airbus A380 and Boeing 777 aircraft with cutting-edge technology.'
      },
      {
        title: 'Global Network',
        description: 'Connect to over 150 destinations across 6 continents.'
      }
    ],
    popularRoutes: [
      { from: 'Dubai', to: 'London', price: 'From $2,499' },
      { from: 'Dubai', to: 'New York', price: 'From $3,299' },
      { from: 'Dubai', to: 'Sydney', price: 'From $2,899' }
    ],
    travelClasses: [
      {
        name: 'First Class',
        description: 'Ultimate luxury with private suites and shower spa.',
        features: ['Private suite', 'Shower spa', 'Chauffeur service', 'Gourmet dining']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats and premium amenities for the discerning traveler.',
        features: ['Lie-flat seats', 'Premium dining', 'Priority boarding', 'Lounge access']
      }
    ]
  },
  'singapore-airlines': {
    slug: 'singapore-airlines',
    title: 'Singapore Airlines',
    subtitle: 'A Great Way to Fly',
    description: 'Discover the world with Singapore Airlines. Exceptional service, innovative cuisine, and award-winning entertainment.',
    heroImage: '/images/singapore-hero.jpg',
    introTitle: 'The Singapore Airlines Experience',
    introText: 'Singapore Airlines has been setting the standard for excellence in aviation for decades. With our commitment to innovation and service, we ensure every journey is memorable.',
    ctaTitle: 'Fly Singapore Airlines Today',
    ctaText: 'Experience the difference that has made Singapore Airlines the world\'s most awarded airline.',
    features: [
      {
        title: 'World\'s Best Airline',
        description: 'Consistently ranked as the world\'s best airline by Skytrax.'
      },
      {
        title: 'Innovative Cuisine',
        description: 'Savor dishes crafted by world-renowned chefs.'
      },
      {
        title: 'KrisFlyer Program',
        description: 'Earn and redeem miles with our award-winning loyalty program.'
      }
    ],
    popularRoutes: [
      { from: 'Singapore', to: 'London', price: 'From $2,199' },
      { from: 'Singapore', to: 'Tokyo', price: 'From $1,899' },
      { from: 'Singapore', to: 'Los Angeles', price: 'From $2,799' }
    ],
    travelClasses: [
      {
        name: 'Suites',
        description: 'The world\'s largest business class seats with separate bed and chair.',
        features: ['Separate bed and chair', 'Personal wardrobe', 'Premium amenities']
      },
      {
        name: 'Business Class',
        description: 'Spacious seats that convert to fully flat beds.',
        features: ['Fully flat beds', 'Premium dining', 'Priority services']
      }
    ]
  },
  'lufthansa-airlines': {
    slug: 'lufthansa-airlines',
    title: 'Lufthansa Airlines',
    subtitle: 'Nonstop You',
    description: 'Fly with Europe\'s leading airline. Lufthansa combines German precision with warm hospitality.',
    heroImage: '/images/lufthansa-hero.jpg',
    introTitle: 'Precision Meets Comfort',
    introText: 'Lufthansa brings you the perfect blend of German engineering and hospitality. With our extensive European network and modern fleet, we connect you to the world.',
    ctaTitle: 'Choose Lufthansa for Your Next Journey',
    ctaText: 'Experience the reliability and comfort that has made Lufthansa a trusted choice for travelers worldwide.',
    features: [
      {
        title: 'European Leader',
        description: 'Europe\'s largest airline group with extensive network coverage.'
      },
      {
        title: 'Miles & More',
        description: 'One of the world\'s leading frequent flyer programs.'
      },
      {
        title: 'Environmental Pioneer',
        description: 'Leading the industry in sustainable aviation practices.'
      }
    ],
    popularRoutes: [
      { from: 'Frankfurt', to: 'New York', price: 'From $2,399' },
      { from: 'Munich', to: 'Tokyo', price: 'From $2,699' },
      { from: 'Frankfurt', to: 'Singapore', price: 'From $2,499' }
    ],
    travelClasses: [
      {
        name: 'First Class',
        description: 'Ultimate luxury with private compartments and premium service.',
        features: ['Private compartments', 'Premium bedding', 'Gourmet cuisine']
      },
      {
        name: 'Business Class',
        description: 'Comfortable lie-flat seats with direct aisle access.',
        features: ['Lie-flat seats', 'Direct aisle access', 'Premium amenities']
      }
    ]
  },
  'american-airlines': {
    slug: 'american-airlines',
    title: 'American Airlines',
    subtitle: 'Going for Great',
    description: 'Fly with America\'s largest airline network. Connect to more destinations with modern aircraft and exceptional service.',
    heroImage: '/images/american-hero.jpg',
    introTitle: 'America\'s Largest Network',
    introText: 'American Airlines connects you to more destinations than any other carrier. With our modern fleet and commitment to service, we make your journey as comfortable as possible.',
    ctaTitle: 'Fly American Airlines',
    ctaText: 'Join the millions who choose American Airlines for reliable service and extensive network coverage.',
    features: [
      {
        title: 'Largest Network',
        description: 'More destinations than any other U.S. carrier.'
      },
      {
        title: 'AAdvantage Program',
        description: 'Earn miles and enjoy elite benefits with our loyalty program.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on our newest aircraft with the latest amenities.'
      }
    ],
    popularRoutes: [
      { from: 'Dallas', to: 'London', price: 'From $2,299' },
      { from: 'Miami', to: 'Madrid', price: 'From $1,999' },
      { from: 'Los Angeles', to: 'Tokyo', price: 'From $2,599' }
    ],
    travelClasses: [
      {
        name: 'Flagship First',
        description: 'Premium luxury with lie-flat seats and personalized service.',
        features: ['Lie-flat seats', 'Premium dining', 'Flagship Lounge access']
      },
      {
        name: 'Flagship Business',
        description: 'Business class comfort with enhanced amenities.',
        features: ['Lie-flat seats', 'Premium meals', 'Priority boarding']
      }
    ]
  },
  'nippon-airways': {
    slug: 'nippon-airways',
    title: 'Nippon Airways (ANA)',
    subtitle: 'Inspiration of Japan',
    description: 'Experience Japanese hospitality and precision. ANA delivers the art of omotenashi service on every flight.',
    heroImage: '/images/ana-hero.jpg',
    introTitle: 'The Art of Japanese Hospitality',
    introText: 'ANA brings you the finest in Japanese hospitality with our omotenashi service philosophy. Experience punctuality, comfort, and attention to detail that defines Japanese excellence.',
    ctaTitle: 'Experience ANA\'s Omotenashi Service',
    ctaText: 'Discover why ANA is consistently rated among the world\'s best airlines for service and reliability.',
    features: [
      {
        title: 'Omotenashi Service',
        description: 'Experience the Japanese art of hospitality and attention to detail.'
      },
      {
        title: 'Punctuality Leader',
        description: 'One of the world\'s most punctual airlines.'
      },
      {
        title: 'Modern Boeing Fleet',
        description: 'Fly on the latest Boeing 787 Dreamliner aircraft.'
      }
    ],
    popularRoutes: [
      { from: 'Tokyo', to: 'New York', price: 'From $2,799' },
      { from: 'Tokyo', to: 'London', price: 'From $2,599' },
      { from: 'Osaka', to: 'Los Angeles', price: 'From $2,699' }
    ],
    travelClasses: [
      {
        name: 'First Class',
        description: 'The Room - ANA\'s revolutionary first class experience.',
        features: ['Private suites', 'Premium bedding', 'Kaiseki cuisine']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats with direct aisle access and premium amenities.',
        features: ['Lie-flat seats', 'Japanese cuisine', 'Premium service']
      }
    ]
  },
  'qantas-airways': {
    slug: 'qantas-airways',
    title: 'Qantas Airways',
    subtitle: 'Spirit of Australia',
    description: 'Fly with Australia\'s flag carrier. Experience the spirit of the land down under with safety excellence and warm hospitality.',
    heroImage: '/images/qantas-hero.jpg',
    introTitle: 'The Spirit of Australia',
    introText: 'Qantas embodies the adventurous spirit of Australia. With our commitment to safety and service, we connect Australia to the world and bring the world to Australia.',
    ctaTitle: 'Fly the Spirit of Australia',
    ctaText: 'Experience the warmth and reliability that has made Qantas Australia\'s most trusted airline.',
    features: [
      {
        title: 'Safety Excellence',
        description: 'Recognized as one of the world\'s safest airlines.'
      },
      {
        title: 'Australian Spirit',
        description: 'Experience genuine Australian hospitality and service.'
      },
      {
        title: 'Pacific Network',
        description: 'Extensive network across the Pacific region.'
      }
    ],
    popularRoutes: [
      { from: 'Sydney', to: 'London', price: 'From $2,899' },
      { from: 'Melbourne', to: 'Los Angeles', price: 'From $2,699' },
      { from: 'Brisbane', to: 'Tokyo', price: 'From $2,399' }
    ],
    travelClasses: [
      {
        name: 'First Class',
        description: 'Spacious suites with premium amenities and service.',
        features: ['Private suites', 'Premium dining', 'Chauffeur service']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat beds with direct aisle access.',
        features: ['Lie-flat beds', 'Premium meals', 'Lounge access']
      }
    ]
  },
  'turkish-airlines': {
    slug: 'turkish-airlines',
    title: 'Turkish Airlines',
    subtitle: 'Widen Your World',
    description: 'Discover the bridge between continents. Turkish Airlines connects you to more countries than any other airline.',
    heroImage: '/images/turkish-hero.jpg',
    introTitle: 'Bridge Between Continents',
    introText: 'Turkish Airlines serves as the perfect bridge between Europe, Asia, and beyond. With Istanbul as our hub, we connect you to more destinations than any other airline in the world.',
    ctaTitle: 'Widen Your World with Turkish Airlines',
    ctaText: 'Discover new horizons with Turkish Airlines\' extensive global network and renowned Turkish hospitality.',
    features: [
      {
        title: 'Most Destinations',
        description: 'Fly to more countries than any other airline in the world.'
      },
      {
        title: 'Istanbul Hub',
        description: 'Connect through our modern Istanbul Airport hub.'
      },
      {
        title: 'Turkish Hospitality',
        description: 'Experience warm Turkish culture and hospitality.'
      }
    ],
    popularRoutes: [
      { from: 'Istanbul', to: 'New York', price: 'From $2,199' },
      { from: 'Istanbul', to: 'Tokyo', price: 'From $2,399' },
      { from: 'Istanbul', to: 'London', price: 'From $1,899' }
    ],
    travelClasses: [
      {
        name: 'Business Class',
        description: 'Lie-flat seats with premium Turkish cuisine and service.',
        features: ['Lie-flat seats', 'Turkish cuisine', 'Premium amenities']
      },
      {
        name: 'Comfort Class',
        description: 'Enhanced economy experience with extra space and amenities.',
        features: ['Extra legroom', 'Priority boarding', 'Enhanced meals']
      }
    ]
  }
}

const AIRLINE_CONTENT_KEY = 'flyluxsky_airlines_content'

export const loadAirlinesContent = async (): Promise<Record<string, AirlineContent>> => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AIRLINE_CONTENT_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all airlines exist
        return { ...DEFAULT_AIRLINE_CONTENT, ...parsed }
      }
    }
  } catch {
    // Failed to load airlines content from localStorage
  }
  return DEFAULT_AIRLINE_CONTENT
}

export const saveAirlinesContent = (content: Record<string, AirlineContent>) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AIRLINE_CONTENT_KEY, JSON.stringify(content))
    }
  } catch {
    // Failed to save airlines content to localStorage
  }
}

export const exportAirlinesContent = (content: Record<string, AirlineContent>) => JSON.stringify(content, null, 2)

export const importAirlinesContent = (json: string): Record<string, AirlineContent> => {
  const parsed = JSON.parse(json)
  return { ...DEFAULT_AIRLINE_CONTENT, ...parsed }
}