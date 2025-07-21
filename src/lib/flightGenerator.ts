import airports from './airports.json';
import type { Airport } from './utils';
import { pricingConfig } from './pricingConfig';

// Simple seeded random number generator
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

// Create a daily seed based on current date and route
function createDailySeed(fromCode: string, toCode: string, flightClass: string): number {
  // Fixed date to ensure consistent flight data
  const dateString = '2024-01-15';
  const routeString = `${fromCode}-${toCode}-${flightClass}`;
  
  // Simple hash function to convert string to number
  let hash = 0;
  const fullString = dateString + routeString;
  for (let i = 0; i < fullString.length; i++) {
    const char = fullString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}



export interface FlightSegment {
  id: string;
  airline: string;
  logo: string;
  flightNumber: string;
  departure: { time: string; airport: string; city: string; date?: string };
  arrival: { time: string; airport: string; city: string; date?: string };
  duration: string;
  stops: number;
  stopoverAirports?: { code: string; city: string; country: string }[];
  price: number;
  class: string;
  amenities: string[];
  rating: number;
  aircraft: string;
}

export interface GeneratedFlight {
  id: number;
  airline: string;
  logo: string;
  flightNumber: string;
  departure: { time: string; airport: string; city: string; date?: string };
  arrival: { time: string; airport: string; city: string; date?: string };
  duration: string;
  stops: number;
  stopoverAirports?: { code: string; city: string; country: string }[];
  price: number;
  class: string;
  amenities: string[];
  rating: number;
  aircraft: string;
  seatsLeft: number;
  segments?: FlightSegment[];
  totalPrice?: number;
  totalDuration?: string;
  returnFlight?: {
    airline: string;
    logo: string;
    flightNumber: string;
    departure: { time: string; airport: string; city: string; date?: string };
    arrival: { time: string; airport: string; city: string; date?: string };
    duration: string;
    stops: number;
    stopoverAirports?: { code: string; city: string; country: string }[];
    amenities: string[];
    aircraft: string;
  };
}

export interface MultiCityFlight {
  id: number;
  segments: FlightSegment[];
  totalPrice: number;
  totalDuration: string;
  class: string;
  seatsLeft: number;
}

// Common airlines data for client-side usage
const commonAirlines = [
  { name: 'Emirates', iata: 'EK', rating: 4.8, country: 'UAE', premium: true, hubs: ['DXB', 'DWC'] },
  { name: 'Lufthansa', iata: 'LH', rating: 4.6, country: 'Germany', premium: false, hubs: ['FRA', 'MUC'] },
  { name: 'Turkish Airlines', iata: 'TK', rating: 4.7, country: 'Turkey', premium: false, hubs: ['IST', 'SAW'] },
  { name: 'British Airways', iata: 'BA', rating: 4.5, country: 'UK', premium: false, hubs: ['LHR', 'LGW'] },
  { name: 'Air France', iata: 'AF', rating: 4.4, country: 'France', premium: false, hubs: ['CDG', 'ORY'] },
  { name: 'Singapore Airlines', iata: 'SQ', rating: 4.9, country: 'Singapore', premium: true, hubs: ['SIN'] },
  { name: 'Qatar Airways', iata: 'QR', rating: 4.8, country: 'Qatar', premium: true, hubs: ['DOH'] },
  { name: 'Etihad Airways', iata: 'EY', rating: 4.7, country: 'UAE', premium: true, hubs: ['AUH'] },
  { name: 'Swiss International Air Lines', iata: 'LX', rating: 4.6, country: 'Switzerland', premium: false, hubs: ['ZUR', 'GVA'] },
  { name: 'KLM', iata: 'KL', rating: 4.5, country: 'Netherlands', premium: false, hubs: ['AMS'] },
  // US Airlines
  { name: 'American Airlines', iata: 'AA', rating: 4.2, country: 'USA', premium: false, hubs: ['DFW', 'CLT', 'PHX', 'MIA'] },
  { name: 'Delta Air Lines', iata: 'DL', rating: 4.3, country: 'USA', premium: false, hubs: ['ATL', 'DTW', 'MSP', 'SEA'] },
  { name: 'United Airlines', iata: 'UA', rating: 4.1, country: 'USA', premium: false, hubs: ['ORD', 'DEN', 'IAH', 'SFO'] },
  { name: 'Southwest Airlines', iata: 'WN', rating: 4.0, country: 'USA', premium: false, hubs: ['DAL', 'MDW', 'BWI', 'PHX'] },
  { name: 'Alaska Airlines', iata: 'AS', rating: 4.4, country: 'USA', premium: false, hubs: ['SEA', 'ANC', 'PDX', 'LAX'] },
  { name: 'JetBlue Airways', iata: 'B6', rating: 4.2, country: 'USA', premium: false, hubs: ['JFK', 'BOS', 'FLL', 'LGB'] },
  { name: 'Spirit Airlines', iata: 'NK', rating: 3.5, country: 'USA', premium: false, hubs: ['FLL', 'DTW', 'LAS', 'ORD'] },
  { name: 'Frontier Airlines', iata: 'F9', rating: 3.4, country: 'USA', premium: false, hubs: ['DEN', 'LAS', 'PHX', 'ORD'] },
  { name: 'Hawaiian Airlines', iata: 'HA', rating: 4.3, country: 'USA', premium: false, hubs: ['HNL', 'OGG', 'KOA', 'LIH'] },
  { name: 'Allegiant Air', iata: 'G4', rating: 3.6, country: 'USA', premium: false, hubs: ['LAS', 'SFB', 'PIE', 'BLI'] },
  { name: 'Sun Country Airlines', iata: 'SY', rating: 3.8, country: 'USA', premium: false, hubs: ['MSP', 'LAS', 'DFW'] }
];

// Основные международные хабы по регионам
const majorHubs = {
  'North America': ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'DEN', 'SEA', 'YYZ', 'YVR'],
  'Europe': ['LHR', 'CDG', 'FRA', 'AMS', 'IST', 'MUC', 'ZUR', 'VIE', 'CPH', 'ARN'],
  'Asia': ['NRT', 'ICN', 'SIN', 'HKG', 'BKK', 'KUL', 'DEL', 'BOM', 'PVG', 'PEK'],
  'Middle East': ['DXB', 'DOH', 'AUH', 'KWI', 'RUH'],
  'Latin America': ['MEX', 'GRU', 'EZE', 'LIM', 'BOG', 'SCL', 'PTY'],
  'Africa': ['CAI', 'JNB', 'ADD', 'LOS', 'CMN'],
  'Oceania': ['SYD', 'MEL', 'AKL']
};

// Calculate distance between two airports
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateStops(distance: number, rng?: SeededRandom): number {
  // Более реалистичная логика остановок на основе расстояния
  if (distance < 500) {
    // Короткие рейсы - обычно прямые
    return 0;
  } else if (distance < 2000) {
    // Средние рейсы - редко с остановками
    return (rng?.random() || Math.random()) > 0.9 ? 1 : 0;
  } else if (distance < 6000) {
    // Длинные рейсы - иногда с остановками
    return (rng?.random() || Math.random()) > 0.7 ? 1 : 0;
  } else {
    // Очень длинные рейсы - часто с остановками
    return (rng?.random() || Math.random()) > 0.4 ? 1 : 0;
  }
}

// Определить регион аэропорта
function getAirportRegion(airportCode: string): string | null {
  for (const [region, codes] of Object.entries(majorHubs)) {
    if (codes.includes(airportCode)) {
      return region;
    }
  }
  return null;
}

// Получить подходящие хабы для маршрута
function getRealisticStopovers(
  fromAirport: Airport,
  toAirport: Airport,
  airlineName: string
): string[] {
  const airline = commonAirlines.find(a => a.name === airlineName);
  const fromRegion = getAirportRegion(fromAirport.code);
  const toRegion = getAirportRegion(toAirport.code);
  
  const potentialHubs: string[] = [];
  
  // 1. Приоритет хабам авиакомпании
  if (airline?.hubs) {
    potentialHubs.push(...airline.hubs);
  }
  
  // 2. Если маршрут межрегиональный, добавить основные хабы между регионами
  if (fromRegion && toRegion && fromRegion !== toRegion) {
    // Для трансатлантических рейсов
    if ((fromRegion === 'North America' && toRegion === 'Europe') || 
        (fromRegion === 'Europe' && toRegion === 'North America')) {
      potentialHubs.push('LHR', 'CDG', 'FRA', 'AMS', 'JFK', 'ORD', 'ATL');
    }
    // Для рейсов в Азию
    else if (fromRegion === 'North America' && toRegion === 'Asia') {
      potentialHubs.push('NRT', 'ICN', 'SIN', 'HKG', 'SEA', 'LAX', 'SFO');
    }
    else if (fromRegion === 'Europe' && toRegion === 'Asia') {
      potentialHubs.push('IST', 'DXB', 'DOH', 'SIN', 'HKG', 'FRA', 'AMS');
    }
    // Для рейсов через Ближний Восток
    else if ((fromRegion === 'Europe' || fromRegion === 'North America') && 
             (toRegion === 'Asia' || toRegion === 'Africa')) {
      potentialHubs.push('DXB', 'DOH', 'AUH', 'IST');
    }
    // Для рейсов в Латинскую Америку
    else if (fromRegion === 'North America' && toRegion === 'Latin America') {
      potentialHubs.push('MEX', 'PTY', 'DFW', 'MIA');
    }
  }
  
  // 3. Добавить региональные хабы
  if (fromRegion && fromRegion in majorHubs) {
    potentialHubs.push(...majorHubs[fromRegion as keyof typeof majorHubs].slice(0, 3));
  }
  if (toRegion && toRegion in majorHubs) {
    potentialHubs.push(...majorHubs[toRegion as keyof typeof majorHubs].slice(0, 3));
  }
  
  // Убрать дубликаты и исключить аэропорты отправления/назначения
  const uniqueHubs = [...new Set(potentialHubs)]
    .filter(hub => hub !== fromAirport.code && hub !== toAirport.code);
  
  return uniqueHubs;
}

function selectStopoverAirports(
  fromAirport: Airport,
  toAirport: Airport,
  stopsCount: number,
  airlineName: string,
  rng?: SeededRandom
): { code: string; city: string; country: string }[] {
  if (stopsCount === 0) return [];
  
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const realisticHubs = getRealisticStopovers(fromAirport, toAirport, airlineName);
  
  // Фильтровать только существующие в базе аэропорты
  const availableHubs = realisticHubs
    .map(code => airportsMap.get(code))
    .filter(airport => airport !== undefined);
  
  if (availableHubs.length === 0) {
    // Fallback к старой логике если нет подходящих хабов
    const potentialStopovers = airports.filter(airport => {
      if (airport.code === fromAirport.code || airport.code === toAirport.code) {
        return false;
      }
      
      const distanceFromOrigin = calculateDistance(
        fromAirport.lat, fromAirport.lon,
        airport.lat, airport.lon
      );
      const distanceToDestination = calculateDistance(
        airport.lat, airport.lon,
        toAirport.lat, toAirport.lon
      );
      const totalDistance = calculateDistance(
        fromAirport.lat, fromAirport.lon,
        toAirport.lat, toAirport.lon
      );
      
      const detourDistance = distanceFromOrigin + distanceToDestination;
      const detourRatio = detourDistance / totalDistance;
      
      return detourRatio <= 1.5 && distanceFromOrigin > 200 && distanceToDestination > 200;
    });
    
    availableHubs.push(...potentialStopovers.slice(0, 5));
  }
  
  // Выбрать случайные хабы
  const selectedStopovers: { code: string; city: string; country: string }[] = [];
  
  for (let i = 0; i < stopsCount && availableHubs.length > 0; i++) {
    const randomIndex = Math.floor((rng?.random() || Math.random()) * availableHubs.length);
    const selectedAirport = availableHubs[randomIndex];
    
    selectedStopovers.push({
      code: selectedAirport.code,
      city: selectedAirport.city,
      country: selectedAirport.country
    });
    
    // Удалить выбранный аэропорт из списка
    availableHubs.splice(randomIndex, 1);
  }
  
  return selectedStopovers;
}

// Calculate flight duration based on distance
function calculateDuration(distance: number, stopsCount: number = 0, rng?: SeededRandom): string {
  // Calculate duration based on average aircraft speed of 850 km/h
  const averageSpeed = 850; // km/h
  const flightTimeHours = distance / averageSpeed;
  
  // Add taxi time and other delays (typically 30-60 minutes total)
  const randomValue = rng ? rng.random() : Math.random();
  const taxiAndDelayMinutes = 30 + randomValue * 30;
  
  // Add layover time for flights with stops (typically 1-3 hours per stop)
  const layoverMinutes = stopsCount * (60 + randomValue * 120); // 1-3 hours per stop
  
  const totalMinutes = Math.round(flightTimeHours * 60 + taxiAndDelayMinutes + layoverMinutes);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
}

// Calculate price based on distance, airline, class and other factors
function calculatePrice(distance: number, airlineName: string, flightClass: string, fromCountry?: string, toCountry?: string, rng?: SeededRandom): number {
  // Base price calculation with different rates for distance ranges
  let basePricePerKm;
  if (distance < 500) {
    basePricePerKm = pricingConfig.basePricePerKm.shortHaul;
  } else if (distance < 2000) {
    basePricePerKm = pricingConfig.basePricePerKm.mediumHaul;
  } else if (distance < 5000) {
    basePricePerKm = pricingConfig.basePricePerKm.longHaul;
  } else {
    basePricePerKm = pricingConfig.basePricePerKm.ultraLongHaul;
  }
  
  let basePrice = distance * basePricePerKm;
  
  // Find airline info
  const airline = commonAirlines.find(a => a.name === airlineName);
  
  // Premium airline surcharge
  if (airline?.premium) {
    basePrice *= pricingConfig.premiumAirlineSurcharge;
  }
  
  // Class multipliers
  const classMultiplier = pricingConfig.classMultipliers[flightClass as keyof typeof pricingConfig.classMultipliers] || 1.0;
  basePrice *= classMultiplier;
  
  // Add fuel surcharge and taxes
  const randomValue1 = rng ? rng.random() : Math.random();
  const fuelAndTaxesPercentage = pricingConfig.fuelAndTaxes.min + randomValue1 * (pricingConfig.fuelAndTaxes.max - pricingConfig.fuelAndTaxes.min);
  const fuelAndTaxes = basePrice * fuelAndTaxesPercentage;
  basePrice += fuelAndTaxes;
  
  // Special pricing for flights from USA (popular international destinations)
  const isFromUSA = fromCountry === 'United States';
  const isInternational = fromCountry !== toCountry;
  
  // Apply USA international flight premium before market variation
  if (isFromUSA && isInternational) {
    const randomValue2 = rng ? rng.random() : Math.random();
    const usaPremium = pricingConfig.usaInternationalPremium.min + randomValue2 * (pricingConfig.usaInternationalPremium.max - pricingConfig.usaInternationalPremium.min);
    basePrice *= usaPremium;
  }
  
  // Random market variation
  const randomValue3 = rng ? rng.random() : Math.random();
  const marketVariation = pricingConfig.marketVariation.min + randomValue3 * (pricingConfig.marketVariation.max - pricingConfig.marketVariation.min);
  basePrice *= marketVariation;
  
  // Set minimum price thresholds
  let minimumPrice;
  const flightClassKey = flightClass as keyof typeof pricingConfig.minimumPrice.standard;
  if (isFromUSA && isInternational) {
    minimumPrice = pricingConfig.minimumPrice.internationalFromUsa[flightClassKey];
  } else {
    minimumPrice = pricingConfig.minimumPrice.standard[flightClassKey];
  }
  
  // Add randomness to minimum price (up to 15% variation)
  const randomValue4 = rng ? rng.random() : Math.random();
  const randomizedMinimumPrice = minimumPrice * (1 + (randomValue4 * 0.15));
  
  return Math.round(Math.max(basePrice, randomizedMinimumPrice));
}

// Get airline logo path
function getAirlineLogo(airlineName: string): string {
  const logoMap: { [key: string]: string } = {
    'Emirates': '/logos/emirates.svg',
    'Lufthansa': '/logos/lufthansa.svg',
    'Turkish Airlines': '/logos/turkish-airlines.png',
    'British Airways': '/logos/emirates.svg', // Fallback to emirates for missing logos
    'Air France': '/logos/lufthansa.svg', // Fallback to lufthansa for missing logos
    'Singapore Airlines': '/logos/singapore-airlines.png',
    'Qatar Airways': '/logos/emirates.svg', // Fallback to emirates for missing logos
    'Etihad Airways': '/logos/etihad-airways.svg',
    'Swiss International Air Lines': '/logos/swiss.png',
    'KLM': '/logos/lufthansa.svg', // Fallback to lufthansa for missing logos
    // US Airlines - using fallbacks to existing logos
    'American Airlines': '/logos/emirates.svg',
    'Delta Air Lines': '/logos/lufthansa.svg',
    'United Airlines': '/logos/emirates.svg',
    'Southwest Airlines': '/logos/lufthansa.svg',
    'Alaska Airlines': '/logos/emirates.svg',
    'JetBlue Airways': '/logos/lufthansa.svg',
    'Spirit Airlines': '/logos/emirates.svg',
    'Frontier Airlines': '/logos/lufthansa.svg',
    'Hawaiian Airlines': '/logos/emirates.svg',
    'Allegiant Air': '/logos/lufthansa.svg',
    'Sun Country Airlines': '/logos/emirates.svg'
  };
  
  return logoMap[airlineName] || '/logos/emirates.svg';
}

// Get aircraft type based on distance
function getAircraftType(distance: number, rng?: SeededRandom): string {
  const random = rng ? rng.random() : Math.random();
  
  if (distance < 1000) {
    return ['Airbus A320', 'Boeing 737-800', 'Embraer E190'][Math.floor(random * 3)];
  } else if (distance < 3000) {
    return ['Airbus A321', 'Boeing 737 MAX', 'Airbus A330'][Math.floor(random * 3)];
  } else {
    return ['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9'][Math.floor(random * 3)];
  }
}

// Get amenities based on airline and distance
function getAmenities(airlineName: string, distance: number): string[] {
  const baseAmenities = ['wifi'];
  
  if (distance > 500) {
    baseAmenities.push('entertainment');
  }
  
  if (distance > 1000) {
    baseAmenities.push('meal');
  }
  
  const airline = commonAirlines.find(a => a.name === airlineName);
  if (airline?.premium) {
    baseAmenities.push('lounge');
  }
  
  return baseAmenities;
}

// Generate random flight times
function generateFlightTimes(durationString: string, rng?: SeededRandom): { departure: string; arrival: string; arrivalDateOffset: number } {
  const randomValue1 = rng ? rng.random() : Math.random();
  const randomValue2 = rng ? rng.random() : Math.random();
  const departureHour = Math.floor(randomValue1 * 24);
  const departureMinute = Math.floor(randomValue2 * 4) * 15; // 0, 15, 30, 45

  const departure = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;

  // Parse duration string (e.g., "7h 23m")
  const durationMatch = durationString.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) {
    return { departure, arrival: departure, arrivalDateOffset: 0 };
  }

  const durationHours = parseInt(durationMatch[1]);
  const durationMinutes = parseInt(durationMatch[2]);

  // Use a reference date (epoch) and work in UTC to calculate time of day and offset
  const departureTime = new Date(0);
  departureTime.setUTCHours(departureHour, departureMinute, 0, 0);

  const arrivalTime = new Date(departureTime.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000);

  const arrival = `${arrivalTime.getUTCHours().toString().padStart(2, '0')}:${arrivalTime.getUTCMinutes().toString().padStart(2, '0')}`;

  // The offset is the number of full days that have passed since the reference date.
  const arrivalDateOffset = Math.floor(arrivalTime.getTime() / (24 * 60 * 60 * 1000));

  return { departure, arrival, arrivalDateOffset };
}

// Main function to generate flights for client-side usage
function generateMultiCityFlightsFromSegments(segments: {from: string, to: string, date: string}[], flightClass: string): MultiCityFlight[] {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  
  if (segments.length === 0) {
    return [];
  }
  
  // Check if any segment has airports in the same city - return empty array if they do
  for (const segment of segments) {
    const fromAirport = airportsMap.get(segment.from);
    const toAirport = airportsMap.get(segment.to);
    
    if (!fromAirport || !toAirport) {
      return [];
    }
    
    if (fromAirport.city === toAirport.city) {
      return [];
    }
  }

  // Create seeded random number generator based on all segments
  const routeString = segments.map(s => `${s.from}-${s.to}`).join('|');
  const seed = createDailySeed(routeString, flightClass, 'multi');
  const rng = new SeededRandom(seed);

  // Generate 3 different multi-city options
  const multiCityFlights = [];
  
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const flightSegments = [];
    let totalPrice = 0;
    let totalDurationMinutes = 0;
    
    // Generate segments for this route
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentFrom = airportsMap.get(segment.from);
      const segmentTo = airportsMap.get(segment.to);
      
      if (!segmentFrom || !segmentTo) continue;
      
      const distance = calculateDistance(
        segmentFrom.lat,
        segmentFrom.lon,
        segmentTo.lat,
        segmentTo.lon
      );
      
      // Filter airlines for this segment
      const isDomesticUSA = segmentFrom.country === 'United States' && segmentTo.country === 'United States';
      const availableAirlines = commonAirlines.filter(airline => {
        // US airlines only for domestic US routes
        if (airline.country === 'USA') {
          return isDomesticUSA;
        }
        // International airlines for all routes except domestic US
        return true;
      });
      
      // Select airline for this segment
      const airlineIndex = (optionIndex + i) % availableAirlines.length;
      const airline = availableAirlines[airlineIndex];
      
      const segmentStopsCount = calculateStops(distance, rng);
      const segmentStopoverAirports = selectStopoverAirports(segmentFrom, segmentTo, segmentStopsCount, airline.name, rng);
      const duration = calculateDuration(distance, segmentStopsCount, rng);
      const durationMinutes = parseInt(duration.split('h')[0]) * 60 + parseInt(duration.split('h')[1]?.split('m')[0] || '0');
      totalDurationMinutes += durationMinutes;
      
      const times = generateFlightTimes(duration, rng);
      const price = calculatePrice(distance, airline.name, flightClass, segmentFrom.country, segmentTo.country, rng);
      totalPrice += price;
      
      const amenities = getAmenities(airline.name, distance);
      const aircraft = getAircraftType(distance, rng);
      
      // Calculate arrival date for this segment
      const segmentArrivalDate = (() => {
        const depDate = new Date(segment.date + 'T00:00:00Z');
        depDate.setUTCDate(depDate.getUTCDate() + times.arrivalDateOffset);
        return depDate.toISOString().split('T')[0];
      })();
      
      flightSegments.push({
        id: `${optionIndex}-${i}`,
        airline: airline.name,
        logo: getAirlineLogo(airline.name),
        flightNumber: `${airline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
        departure: {
          time: times.departure,
          airport: segmentFrom.code,
          city: segmentFrom.city,
          date: segment.date
        },
        arrival: {
          time: times.arrival,
          airport: segmentTo.code,
          city: segmentTo.city,
          date: segmentArrivalDate
        },
        duration,
        stops: segmentStopsCount,
        stopoverAirports: segmentStopoverAirports,
        price,
        class: flightClass,
        amenities,
        rating: airline.rating,
        aircraft
      });
    }
    
    // Calculate total duration
    const totalHours = Math.floor(totalDurationMinutes / 60);
    const totalMinutes = totalDurationMinutes % 60;
    const totalDuration = `${totalHours}h ${totalMinutes}m`;
    
    multiCityFlights.push({
      id: optionIndex + 1,
      segments: flightSegments,
      totalPrice: Math.round(totalPrice * 1.2), // Multi-city pricing
      totalDuration,
      class: flightClass,
      seatsLeft: Math.floor(rng.random() * 8) + 8
    });
  }
  
  return multiCityFlights.sort((a, b) => a.totalPrice - b.totalPrice);
}

function generateMultiCityFlights(fromCode: string, toCode: string, flightClass: string): MultiCityFlight[] {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const fromAirport = airportsMap.get(fromCode);
  const toAirport = airportsMap.get(toCode);
  
  if (!fromAirport || !toAirport) {
    return [];
  }
  
  // Check if airports are in the same city - return empty array if they are
  if (fromAirport.city === toAirport.city) {
    return [];
  }

  // Create seeded random number generator
  const seed = createDailySeed(fromCode, toCode, flightClass);
  const rng = new SeededRandom(seed);

  // Generate intermediate cities for multi-city journey
  const allAirports = airports.filter(a => a.code !== fromCode && a.code !== toCode);
  const intermediateCount = Math.floor(rng.random() * 2) + 1; // 1-2 intermediate stops
  const intermediateAirports = [];
  
  for (let i = 0; i < intermediateCount; i++) {
    const randomIndex = Math.floor(rng.random() * allAirports.length);
    intermediateAirports.push(allAirports[randomIndex]);
  }

  // Create route: from -> intermediate(s) -> to
  const route = [fromAirport, ...intermediateAirports, toAirport];
  
  // Generate 3 different multi-city options
  const multiCityFlights = [];
  
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const segments = [];
    let totalPrice = 0;
    let totalDurationMinutes = 0;
    
    // Generate segments for this route
    for (let i = 0; i < route.length - 1; i++) {
      const segmentFrom = route[i];
      const segmentTo = route[i + 1];
      
      const distance = calculateDistance(
        segmentFrom.lat,
        segmentFrom.lon,
        segmentTo.lat,
        segmentTo.lon
      );
      
      // Filter airlines for this segment
      const isDomesticUSA = segmentFrom.country === 'United States' && segmentTo.country === 'United States';
      const availableAirlines = commonAirlines.filter(airline => {
        // US airlines only for domestic US routes
        if (airline.country === 'USA') {
          return isDomesticUSA;
        }
        // International airlines for all routes except domestic US
        return true;
      });
      
      // Select airline for this segment
      const airlineIndex = (optionIndex + i) % availableAirlines.length;
      const airline = availableAirlines[airlineIndex];
      
      // Calculate stops and stopover airports for this segment
      const segmentStopsCount = calculateStops(distance, rng);
      const segmentStopoverAirports = selectStopoverAirports(segmentFrom, segmentTo, segmentStopsCount, airline.name, rng);
      
      const duration = calculateDuration(distance, segmentStopsCount, rng);
      const durationMinutes = parseInt(duration.split('h')[0]) * 60 + parseInt(duration.split('h')[1]?.split('m')[0] || '0');
      totalDurationMinutes += durationMinutes;
      
      const times = generateFlightTimes(duration, rng);
      const price = calculatePrice(distance, airline.name, flightClass, segmentFrom.country, segmentTo.country, rng);
      totalPrice += price;
      
      const amenities = getAmenities(airline.name, distance);
      const aircraft = getAircraftType(distance, rng);
      
      segments.push({
        id: `${optionIndex}-${i}`,
        airline: airline.name,
        logo: getAirlineLogo(airline.name),
        flightNumber: `${airline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
        departure: {
          time: times.departure,
          airport: segmentFrom.code,
          city: segmentFrom.city
        },
        arrival: {
          time: times.arrival,
          airport: segmentTo.code,
          city: segmentTo.city
        },
        duration,
        stops: segmentStopsCount,
        stopoverAirports: segmentStopoverAirports,
        price,
        class: flightClass,
        amenities,
        rating: airline.rating,
        aircraft
      });
    }
    
    // Calculate total duration
    const totalHours = Math.floor(totalDurationMinutes / 60);
    const totalMinutes = totalDurationMinutes % 60;
    const totalDuration = `${totalHours}h ${totalMinutes}m`;
    
    multiCityFlights.push({
      id: optionIndex + 1,
      segments,
      totalPrice: Math.round(totalPrice * 1.5), // Multi-city pricing
      totalDuration,
      class: flightClass,
      seatsLeft: Math.floor(rng.random() * 8) + 8
    });
  }
  
  return multiCityFlights.sort((a, b) => a.totalPrice - b.totalPrice);
}

export { generateMultiCityFlightsFromSegments };

export function generateFlightsClient(fromCode: string, toCode: string, flightClass: string = 'Business class', tripType: string = 'One Way', departureDate?: string, returnDate?: string): (GeneratedFlight | MultiCityFlight)[] {
  // Handle Multi-city flights differently
  if (tripType === 'Multi-city') {
    return generateMultiCityFlights(fromCode, toCode, flightClass);
  }
  
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const fromAirport = airportsMap.get(fromCode);
  const toAirport = airportsMap.get(toCode);
  
  if (!fromAirport || !toAirport) {
    return [];
  }
  
  // Check if airports are in the same city - return empty array if they are
  if (fromAirport.city === toAirport.city) {
    return [];
  }
  
  // Create seeded random number generator for consistent daily prices
  const seed = createDailySeed(fromCode, toCode, flightClass);
  const rng = new SeededRandom(seed);
  
  const distance = calculateDistance(
    fromAirport.lat,
    fromAirport.lon,
    toAirport.lat,
    toAirport.lon
  );
  
  // Filter airlines based on route
  const isDomesticUSA = fromAirport.country === 'United States' && toAirport.country === 'United States';
  const availableAirlines = commonAirlines.filter(airline => {
    // US airlines only for domestic US routes
    if (airline.country === 'USA') {
      return isDomesticUSA;
    }
    // International airlines for all routes except domestic US
    return true;
  });
  
  // Select airlines deterministically based on seed
  const shuffledAirlines = [...availableAirlines];
  for (let i = shuffledAirlines.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffledAirlines[i], shuffledAirlines[j]] = [shuffledAirlines[j], shuffledAirlines[i]];
  }
  const selectedAirlines = shuffledAirlines.slice(0, Math.min(5, availableAirlines.length));
  
  const flights = selectedAirlines.map((airline, index) => {
    const stopsCount = calculateStops(distance, rng);
    const stopoverAirports = selectStopoverAirports(fromAirport, toAirport, stopsCount, airline.name, rng);
    const duration = calculateDuration(distance, stopsCount, rng);
    const times = generateFlightTimes(duration, rng);
    let price = calculatePrice(distance, airline.name, flightClass, fromAirport.country, toAirport.country, rng);
    
    // Adjust price based on trip type
    if (tripType === 'Round Trip') {
      price = Math.round(price * 1.8); // Round trip is typically 1.8x one way (not exactly 2x due to discounts)
    } else if (tripType === 'Multi-city') {
      price = Math.round(price * 1.5); // Multi-city pricing per segment
    }
    const amenities = getAmenities(airline.name, distance);
    const aircraft = getAircraftType(distance, rng);
    
    // Calculate arrival date
    const arrivalDate = departureDate ? (() => {
      const depDate = new Date(departureDate + 'T00:00:00Z');
      depDate.setUTCDate(depDate.getUTCDate() + times.arrivalDateOffset);
      return depDate.toISOString().split('T')[0];
    })() : undefined;
    
    const flight: GeneratedFlight = {
      id: index + 1,
      airline: airline.name,
      logo: getAirlineLogo(airline.name),
      flightNumber: `${airline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
      departure: {
        time: times.departure,
        airport: fromCode,
        city: fromAirport.city,
        date: departureDate
      },
      arrival: {
        time: times.arrival,
        airport: toCode,
        city: toAirport.city,
        date: arrivalDate
      },
      duration,
      stops: stopsCount,
      stopoverAirports,
      price,
      class: flightClass,
      amenities,
      rating: airline.rating,
      aircraft,
      seatsLeft: Math.floor(rng.random() * 8) + 8 // Random seats left between 8-15
    };

    // Generate return flight for Round Trip
    if (tripType === 'Round Trip') {
      const returnStopsCount = calculateStops(distance, rng);
      const returnStopoverAirports = selectStopoverAirports(toAirport, fromAirport, returnStopsCount, airline.name, rng);
      const returnDuration = calculateDuration(distance, returnStopsCount, rng);
      const returnTimes = generateFlightTimes(returnDuration, rng);
      const returnAmenities = getAmenities(airline.name, distance);
      const returnAircraft = getAircraftType(distance, rng);
      
      // Calculate return arrival date
      const returnArrivalDate = returnDate ? (() => {
        const retDate = new Date(returnDate + 'T00:00:00Z');
        retDate.setUTCDate(retDate.getUTCDate() + returnTimes.arrivalDateOffset);
        return retDate.toISOString().split('T')[0];
      })() : undefined;
      
      flight.returnFlight = {
        airline: airline.name,
        logo: getAirlineLogo(airline.name),
        flightNumber: `${airline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
        departure: {
          time: returnTimes.departure,
          airport: toCode,
          city: toAirport.city,
          date: returnDate
        },
        arrival: {
          time: returnTimes.arrival,
          airport: fromCode,
          city: fromAirport.city,
          date: returnArrivalDate
        },
        duration: returnDuration,
        stops: returnStopsCount,
        stopoverAirports: returnStopoverAirports,
        amenities: returnAmenities,
        aircraft: returnAircraft
      };
    }

    return flight;
  });
  
  // Sort by price (cheapest first) and limit to 3 flights
  return flights.sort((a, b) => a.price - b.price).slice(0, 3);
}