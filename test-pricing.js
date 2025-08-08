// Test script to debug pricing logic for LAX-JFK route

import { readFileSync } from 'fs';

// Load airports data
const airports = JSON.parse(readFileSync('./src/lib/airports.json', 'utf8'));

// Mock loadPricingConfig function with default config
function loadPricingConfig() {
  return {
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
  };
}

// Mock the calculateDistance function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Mock the getRouteInfo function
function getRouteInfo(fromCountry, toCountry, distance) {
  const isFromUSA = fromCountry === 'United States';
  const isInternational = fromCountry !== toCountry;
  
  let category;
  if (distance < 1500) {
    category = 'shortHaul';
  } else if (distance < 4000) {
    category = 'mediumHaul';
  } else {
    category = 'longHaul';
  }
  
  let region;
  if (isFromUSA && !isInternational) {
    region = 'USA Domestic';
  } else {
    region = 'USA to Asia'; // Default fallback
  }
  
  return { region, category };
}

// Mock the calculatePriceWithAdminConfig function
function calculatePriceWithAdminConfig(distance, airlineName, flightClass, fromCountry, toCountry) {
  try {
    const adminConfig = loadPricingConfig();
    
    console.log('=== PRICING DEBUG ===');
    console.log('Distance:', distance, 'km');
    console.log('Airline:', airlineName);
    console.log('Flight Class:', flightClass);
    console.log('From Country:', fromCountry);
    console.log('To Country:', toCountry);
    
    if (fromCountry && toCountry) {
      const { region, category } = getRouteInfo(fromCountry, toCountry, distance);
      console.log('Determined Region:', region);
      console.log('Determined Category:', category);
      
      // Find matching region in admin config
      const regionConfig = adminConfig.regionPricing.find(r => r.region === region);
      console.log('Region Config Found:', !!regionConfig);
      
      if (regionConfig && regionConfig[category].length > 0) {
        const routeConfig = regionConfig[category][0];
        console.log('Route Config:', routeConfig);
        
        // Calculate base price with fluctuation
        const randomValue1 = 0.5; // Fixed for testing
        const priceRange = routeConfig.maxPrice - routeConfig.minPrice;
        const fluctuationAmount = (routeConfig.fluctuation / 100) * routeConfig.minPrice;
        const basePrice = routeConfig.minPrice + (randomValue1 * priceRange) + 
                         (0.5 - 0.5) * 2 * fluctuationAmount; // No fluctuation for testing
        
        console.log('Price Range:', priceRange);
        console.log('Fluctuation Amount:', fluctuationAmount);
        console.log('Base Price:', basePrice);
        
        // Apply service class multiplier
        const serviceClass = adminConfig.serviceClasses.find(sc => 
          sc.name === flightClass || 
          (flightClass === 'Business class' && sc.name === 'Business') ||
          (flightClass === 'First class' && sc.name === 'First')
        );
        const classMultiplier = serviceClass ? serviceClass.multiplier : 1.0;
        console.log('Service Class Found:', serviceClass);
        console.log('Class Multiplier:', classMultiplier);
        
        let finalPrice = basePrice * classMultiplier;
        console.log('Price after class multiplier:', finalPrice);
        
        // Apply airline premium if applicable
        const premiumAirlines = ['American Airlines', 'Delta Air Lines', 'United Airlines'];
        const isPremium = premiumAirlines.includes(airlineName);
        if (isPremium) {
          finalPrice *= 1.2; // 20% premium for premium airlines
          console.log('Premium airline surcharge applied (20%)');
        }
        console.log('Final Price:', Math.round(finalPrice));
        
        return Math.round(finalPrice);
      }
    }
  } catch (error) {
    console.warn('Failed to load admin pricing config:', error);
  }
  
  return 0;
}

// Test the pricing for LAX-JFK
const laxAirport = airports.find(a => a.code === 'LAX');
const jfkAirport = airports.find(a => a.code === 'JFK');

if (laxAirport && jfkAirport) {
  console.log('LAX Airport:', laxAirport.name, laxAirport.country);
  console.log('JFK Airport:', jfkAirport.name, jfkAirport.country);
  
  // Test the pricing calculation
  const distance = calculateDistance(laxAirport.lat, laxAirport.lon, jfkAirport.lat, jfkAirport.lon);
  const airlineName = 'American Airlines';
  const flightClass = 'Business class';
  const tripType = 'Round Trip'; // This is important!

  console.log('\n=== ПОЛНЫЙ АНАЛИЗ ЦЕНООБРАЗОВАНИЯ ===');
  console.log('Маршрут: LAX -> JFK');
  console.log('Расстояние:', Math.round(distance), 'км');
  console.log('Авиакомпания:', airlineName);
  console.log('Класс:', flightClass);
  console.log('Тип поездки:', tripType);
  console.log('\n--- 1. Расчет базовой цены из админ панели ---');

  const adminPrice = calculatePriceWithAdminConfig(distance, airlineName, flightClass, 'United States', 'United States');
  console.log('\n--- 2. Применение множителя типа поездки ---');
  console.log('Цена из админ панели:', adminPrice);

  // Apply trip type multiplier (this happens in generateFlightsClient)
  let finalPrice = adminPrice;
  if (tripType === 'Round Trip') {
    finalPrice = Math.round(finalPrice * 1.8);
    console.log('Множитель Round Trip: 1.8x');
    console.log('Расчет:', adminPrice, '× 1.8 =', finalPrice);
  } else if (tripType === 'Multi-city') {
    finalPrice = Math.round(finalPrice * 1.5);
    console.log('Множитель Multi-city: 1.5x');
    console.log('Расчет:', adminPrice, '× 1.5 =', finalPrice);
  } else {
    console.log('Множитель One-way: 1.0x (без изменений)');
  }

  console.log('\n=== ИТОГОВАЯ ЦЕНА ===');
  console.log('ФИНАЛЬНАЯ ЦЕНА:', finalPrice);
  console.log('\n=== ОБЪЯСНЕНИЕ ВЫСОКОЙ ЦЕНЫ ===');
  console.log('1. Базовая цена medium haul USA Domestic: ~1500$');
  console.log('2. Множитель Business класса: ×2.1 = ~3150$');
  console.log('3. Надбавка премиум авиакомпании: ×1.2 = ~3780$');
  console.log('4. Множитель Round Trip: ×1.8 = ~6800$');
  console.log('\nВЫВОД: Высокая цена объясняется комбинацией всех множителей!');
} else {
  console.log('Could not find LAX or JFK airports');
}