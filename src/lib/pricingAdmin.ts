// Admin pricing configuration management

export interface RoutePrice {
  route: string
  minPrice: number
  maxPrice: number
  fluctuation: number
}

export interface RegionPricing {
  region: string
  shortHaul: RoutePrice[]
  mediumHaul: RoutePrice[]
  longHaul: RoutePrice[]
}

export interface ServiceClass {
  name: string
  multiplier: number
}

export interface TripType {
  name: string
  multiplier: number
}

export interface PricingConfiguration {
  regionPricing: RegionPricing[]
  serviceClasses: ServiceClass[]
  tripTypes: TripType[]
  lastUpdated: string
}

// Default configuration based on price.md
export const defaultPricingConfig: PricingConfiguration = {
  regionPricing: [
    {
      region: 'USA Domestic',
      shortHaul: [
        { route: 'Short Haul Routes', minPrice: 500, maxPrice: 550, fluctuation: 15 }
      ],
      mediumHaul: [
        { route: 'Medium Haul Routes', minPrice: 1400, maxPrice: 1600, fluctuation: 15 }
      ],
      longHaul: [
        { route: 'Long Haul Routes', minPrice: 1400, maxPrice: 1600, fluctuation: 15 }
      ]
    },
    {
      region: 'USA to Europe',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Europe', minPrice: 2000, maxPrice: 2500, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to Middle East',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Middle East', minPrice: 1800, maxPrice: 2300, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to Africa',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Africa', minPrice: 1800, maxPrice: 2600, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to Asia',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Asia', minPrice: 2200, maxPrice: 3000, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to India/Japan',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-India/Japan', minPrice: 2000, maxPrice: 2800, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to Australia',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Australia', minPrice: 2400, maxPrice: 3200, fluctuation: 20 }
      ]
    },
    {
      region: 'USA to Oceania',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'USA-Oceania', minPrice: 2200, maxPrice: 3000, fluctuation: 20 }
      ]
    },
    {
      region: 'Europe to Asia',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'Europe-Asia', minPrice: 1600, maxPrice: 2200, fluctuation: 20 }
      ]
    },
    {
      region: 'Europe to Africa',
      shortHaul: [],
      mediumHaul: [
        { route: 'Europe-Africa', minPrice: 900, maxPrice: 1300, fluctuation: 15 }
      ],
      longHaul: []
    },
    {
      region: 'Europe to Middle East',
      shortHaul: [],
      mediumHaul: [
        { route: 'Europe-Middle East', minPrice: 800, maxPrice: 1200, fluctuation: 15 }
      ],
      longHaul: []
    },
    {
      region: 'Europe to India/Japan',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'Europe-India/Japan', minPrice: 1400, maxPrice: 1900, fluctuation: 20 }
      ]
    },
    {
      region: 'Europe to Australia',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'Europe-Australia', minPrice: 1800, maxPrice: 2500, fluctuation: 20 }
      ]
    },
    {
      region: 'Europe to Oceania',
      shortHaul: [],
      mediumHaul: [],
      longHaul: [
        { route: 'Europe-Oceania', minPrice: 2000, maxPrice: 2700, fluctuation: 20 }
      ]
    }
  ],
  serviceClasses: [
    { name: 'Business', multiplier: 2.1 },
    { name: 'First', multiplier: 3.2 }
  ],
  tripTypes: [
    { name: 'One-way', multiplier: 0.5 },
    { name: 'Round Trip', multiplier: 1.0 },
    { name: 'Multi-city', multiplier: 1.5 }
  ],
  lastUpdated: new Date().toISOString()
}

// Local storage key
const PRICING_CONFIG_KEY = 'flyluxsky_pricing_config'

// Save configuration to localStorage
export const savePricingConfig = (config: PricingConfiguration): void => {
  try {
    const configWithTimestamp = {
      ...config,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(PRICING_CONFIG_KEY, JSON.stringify(configWithTimestamp))
  } catch (error) {
    console.error('Failed to save pricing configuration:', error)
    throw new Error('Failed to save pricing configuration')
  }
}

// Load configuration from localStorage
export const loadPricingConfig = (): PricingConfiguration => {
  try {
    const stored = localStorage.getItem(PRICING_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return defaultPricingConfig
  } catch (error) {
    console.error('Failed to load pricing configuration:', error)
    return defaultPricingConfig
  }
}

// Export configuration as JSON
export const exportPricingConfig = (config: PricingConfiguration): string => {
  return JSON.stringify(config, null, 2)
}

// Import configuration from JSON
export const importPricingConfig = (jsonString: string): PricingConfiguration => {
  try {
    const config = JSON.parse(jsonString)
    // Validate the structure
    if (!config.regionPricing || !config.serviceClasses || !config.tripTypes) {
      throw new Error('Invalid configuration format')
    }
    return {
      ...config,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to import pricing configuration:', error)
    throw new Error('Invalid JSON format or configuration structure')
  }
}

// Calculate price based on configuration
export const calculatePrice = (
  basePrice: number,
  serviceClass: string,
  tripType: string,
  config: PricingConfiguration
): number => {
  const classMultiplier = config.serviceClasses.find(c => c.name === serviceClass)?.multiplier || 1
  const tripMultiplier = config.tripTypes.find(t => t.name === tripType)?.multiplier || 1
  
  return Math.round(basePrice * classMultiplier * tripMultiplier)
}

// Get price range for a route
export const getPriceRange = (
  regionName: string,
  category: 'shortHaul' | 'mediumHaul' | 'longHaul',
  routeName: string,
  config: PricingConfiguration
): { minPrice: number; maxPrice: number; fluctuation: number } | null => {
  const region = config.regionPricing.find(r => r.region === regionName)
  if (!region) return null
  
  const route = region[category].find(r => r.route === routeName)
  return route ? {
    minPrice: route.minPrice,
    maxPrice: route.maxPrice,
    fluctuation: route.fluctuation
  } : null
}