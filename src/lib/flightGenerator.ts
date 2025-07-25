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
  // 🌍 Европа
  { name: 'Lufthansa', iata: 'LH', rating: 4.6, country: 'Germany', premium: true, hubs: ['FRA', 'MUC'], continent: 'Europe' },
  { name: 'Air France', iata: 'AF', rating: 4.4, country: 'France', premium: true, hubs: ['CDG', 'ORY'], continent: 'Europe' },
  { name: 'KLM', iata: 'KL', rating: 4.5, country: 'Netherlands', premium: true, hubs: ['AMS'], continent: 'Europe' },
  { name: 'British Airways', iata: 'BA', rating: 4.5, country: 'UK', premium: true, hubs: ['LHR', 'LGW'], continent: 'Europe' },
  { name: 'Virgin Atlantic', iata: 'VS', rating: 4.3, country: 'UK', premium: true, hubs: ['LHR', 'LGW'], continent: 'Europe' },
  { name: 'Iberia', iata: 'IB', rating: 4.3, country: 'Spain', premium: true, hubs: ['MAD', 'BCN'], continent: 'Europe' },
  { name: 'Swiss International Air Lines', iata: 'LX', rating: 4.6, country: 'Switzerland', premium: true, hubs: ['ZUR', 'GVA'], continent: 'Europe' },
  { name: 'Austrian Airlines', iata: 'OS', rating: 4.4, country: 'Austria', premium: false, hubs: ['VIE'], continent: 'Europe' },
  { name: 'Finnair', iata: 'AY', rating: 4.5, country: 'Finland', premium: false, hubs: ['HEL'], continent: 'Europe' },
  { name: 'SAS', iata: 'SK', rating: 4.3, country: 'Sweden', premium: false, hubs: ['ARN', 'CPH', 'OSL'], continent: 'Europe' },
  { name: 'TAP Air Portugal', iata: 'TP', rating: 4.2, country: 'Portugal', premium: false, hubs: ['LIS'], continent: 'Europe' },
  { name: 'LOT Polish Airlines', iata: 'LO', rating: 4.1, country: 'Poland', premium: false, hubs: ['WAW'], continent: 'Europe' },
  { name: 'Tarom', iata: 'RO', rating: 4.0, country: 'Romania', premium: false, hubs: ['OTP'], continent: 'Europe' },

  // 🌍 Северная Америка
  { name: 'American Airlines', iata: 'AA', rating: 4.2, country: 'USA', premium: true, hubs: ['DFW', 'CLT', 'PHX', 'MIA'], domestic: true, continent: 'North America' },
  { name: 'Delta Air Lines', iata: 'DL', rating: 4.3, country: 'USA', premium: true, hubs: ['ATL', 'DTW', 'MSP', 'SEA'], domestic: true, continent: 'North America' },
  { name: 'United Airlines', iata: 'UA', rating: 4.1, country: 'USA', premium: true, hubs: ['ORD', 'DEN', 'IAH', 'SFO'], domestic: true, continent: 'North America' },
  { name: 'Air Canada', iata: 'AC', rating: 4.4, country: 'Canada', premium: false, hubs: ['YYZ', 'YVR', 'YUL'], continent: 'North America' },
  { name: 'Alaska Airlines', iata: 'AS', rating: 4.4, country: 'USA', premium: false, hubs: ['SEA', 'ANC', 'PDX', 'LAX'], domestic: true, continent: 'North America' },

  // 🌍 Южная Америка
  { name: 'LATAM Airlines', iata: 'LA', rating: 4.3, country: 'Chile', premium: false, hubs: ['SCL', 'GRU', 'LIM'], continent: 'South America' },
  { name: 'Avianca', iata: 'AV', rating: 4.2, country: 'Colombia', premium: false, hubs: ['BOG', 'UIO', 'SAL'], continent: 'South America' },
  { name: 'GOL Linhas Aéreas', iata: 'G3', rating: 4.0, country: 'Brazil', premium: false, hubs: ['GRU', 'CGH'], continent: 'South America' },
  { name: 'Azul Brazilian Airlines', iata: 'AD', rating: 4.1, country: 'Brazil', premium: false, hubs: ['VCP', 'CNF'], continent: 'South America' },
  { name: 'SKY Airline', iata: 'H2', rating: 3.9, country: 'Chile', premium: false, hubs: ['SCL'], continent: 'South America' },
  { name: 'Aerolíneas Argentinas', iata: 'AR', rating: 3.8, country: 'Argentina', premium: false, hubs: ['EZE', 'AEP'], continent: 'South America' },

  // 🌍 Азия
  { name: 'Singapore Airlines', iata: 'SQ', rating: 4.9, country: 'Singapore', premium: true, hubs: ['SIN'], continent: 'Asia' },
  { name: 'Cathay Pacific', iata: 'CX', rating: 4.7, country: 'Hong Kong', premium: true, hubs: ['HKG'], continent: 'Asia' },
  { name: 'Japan Airlines', iata: 'JL', rating: 4.8, country: 'Japan', premium: true, hubs: ['NRT', 'HND'], continent: 'Asia' },
  { name: 'All Nippon Airways', iata: 'NH', rating: 4.8, country: 'Japan', premium: true, hubs: ['NRT', 'HND'], continent: 'Asia' },
  { name: 'Korean Air', iata: 'KE', rating: 4.6, country: 'South Korea', premium: true, hubs: ['ICN'], continent: 'Asia' },
  { name: 'Asiana Airlines', iata: 'OZ', rating: 4.5, country: 'South Korea', premium: false, hubs: ['ICN'], continent: 'Asia' },
  { name: 'Vietnam Airlines', iata: 'VN', rating: 4.3, country: 'Vietnam', premium: false, hubs: ['SGN', 'HAN'], continent: 'Asia' },
  { name: 'Thai Airways', iata: 'TG', rating: 4.4, country: 'Thailand', premium: false, hubs: ['BKK'], continent: 'Asia' },

  { name: 'China Southern Airlines', iata: 'CZ', rating: 4.1, country: 'China', premium: false, hubs: ['CAN', 'PEK'], continent: 'Asia' },
  { name: 'China Eastern Airlines', iata: 'MU', rating: 4.0, country: 'China', premium: false, hubs: ['PVG', 'PEK'], continent: 'Asia' },
  { name: 'Air China', iata: 'CA', rating: 4.1, country: 'China', premium: false, hubs: ['PEK', 'PVG'], continent: 'Asia' },
  { name: 'Philippine Airlines', iata: 'PR', rating: 4.0, country: 'Philippines', premium: false, hubs: ['MNL'], continent: 'Asia' },
  { name: 'Garuda Indonesia', iata: 'GA', rating: 4.2, country: 'Indonesia', premium: false, hubs: ['CGK'], continent: 'Asia' },
  { name: 'IndiGo', iata: '6E', rating: 4.0, country: 'India', premium: false, hubs: ['DEL', 'BOM'], continent: 'Asia' },

  // 🌍 Ближний Восток
  { name: 'Emirates', iata: 'EK', rating: 4.8, country: 'UAE', premium: true, hubs: ['DXB', 'DWC'], continent: 'Middle East' },
  { name: 'Qatar Airways', iata: 'QR', rating: 4.8, country: 'Qatar', premium: true, hubs: ['DOH'], continent: 'Middle East' },
  { name: 'Etihad Airways', iata: 'EY', rating: 4.7, country: 'UAE', premium: true, hubs: ['AUH'], continent: 'Middle East' },
  { name: 'Saudia', iata: 'SV', rating: 4.2, country: 'Saudi Arabia', premium: false, hubs: ['RUH', 'JED'], continent: 'Middle East' },
  { name: 'El Al', iata: 'LY', rating: 4.3, country: 'Israel', premium: false, hubs: ['TLV'], continent: 'Middle East' },
  { name: 'Royal Jordanian', iata: 'RJ', rating: 4.1, country: 'Jordan', premium: false, hubs: ['AMM'], continent: 'Middle East' },
  { name: 'Kuwait Airways', iata: 'KU', rating: 3.9, country: 'Kuwait', premium: false, hubs: ['KWI'], continent: 'Middle East' },
  { name: 'Oman Air', iata: 'WY', rating: 4.2, country: 'Oman', premium: false, hubs: ['MCT'], continent: 'Middle East' },

  // 🌍 Африка
  { name: 'Ethiopian Airlines', iata: 'ET', rating: 4.3, country: 'Ethiopia', premium: false, hubs: ['ADD'], continent: 'Africa' },
  { name: 'EgyptAir', iata: 'MS', rating: 3.9, country: 'Egypt', premium: false, hubs: ['CAI'], continent: 'Africa' },
  { name: 'Kenya Airways', iata: 'KQ', rating: 4.0, country: 'Kenya', premium: false, hubs: ['NBO'], continent: 'Africa' },
  { name: 'Royal Air Maroc', iata: 'AT', rating: 4.0, country: 'Morocco', premium: false, hubs: ['CMN'], continent: 'Africa' },
  { name: 'South African Airways', iata: 'SA', rating: 3.8, country: 'South Africa', premium: false, hubs: ['JNB'], continent: 'Africa' },
  { name: 'Air Mauritius', iata: 'MK', rating: 4.1, country: 'Mauritius', premium: false, hubs: ['MRU'], continent: 'Africa' },
  { name: 'RwandAir', iata: 'WB', rating: 4.2, country: 'Rwanda', premium: false, hubs: ['KGL'], continent: 'Africa' },

  // 🌍 Океания
  { name: 'Qantas', iata: 'QF', rating: 4.6, country: 'Australia', premium: true, hubs: ['SYD', 'MEL'], continent: 'Oceania' },
  { name: 'Virgin Australia', iata: 'VA', rating: 4.3, country: 'Australia', premium: false, hubs: ['SYD', 'MEL', 'BNE'], continent: 'Oceania' },
  { name: 'Air New Zealand', iata: 'NZ', rating: 4.5, country: 'New Zealand', premium: false, hubs: ['AKL', 'CHC'], continent: 'Oceania' },
  { name: 'Jetstar Airways', iata: 'JQ', rating: 3.8, country: 'Australia', premium: false, hubs: ['MEL', 'SYD'], continent: 'Oceania' },
  { name: 'Fiji Airways', iata: 'FJ', rating: 4.1, country: 'Fiji', premium: false, hubs: ['NAN'], continent: 'Oceania' }
];

// Основные международные хабы по регионам
const majorHubs = {
  'North America': ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'DEN', 'SEA', 'YYZ', 'YVR'],
  'Europe': ['LHR', 'CDG', 'FRA', 'AMS', 'IST', 'MUC', 'ZUR', 'VIE', 'CPH', 'ARN'],
  'Asia': ['NRT', 'ICN', 'SIN', 'HKG', 'BKK', 'KUL', 'DEL', 'BOM', 'PVG', 'PEK'],
  'Middle East': ['DXB', 'DOH', 'AUH', 'KWI', 'RUH'],
  'South America': ['MEX', 'GRU', 'EZE', 'LIM', 'BOG', 'SCL', 'PTY'],
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

// Function to determine continent based on airport country
function getAirportContinent(airport: Airport): string {
  const countryToContinentMap: { [key: string]: string } = {
    // Europe
    'Germany': 'Europe',
    'France': 'Europe',
    'Netherlands': 'Europe',
    'United Kingdom': 'Europe',
    'UK': 'Europe',
    'Spain': 'Europe',
    'Switzerland': 'Europe',
    'Austria': 'Europe',
    'Finland': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Denmark': 'Europe',
    'Portugal': 'Europe',
    'Poland': 'Europe',
    'Italy': 'Europe',
    'Greece': 'Europe',
    'Turkey': 'Europe',
    'Russia': 'Europe',
    'Belgium': 'Europe',
    'Czech Republic': 'Europe',
    'Hungary': 'Europe',
    'Romania': 'Europe',
    'Bulgaria': 'Europe',
    'Croatia': 'Europe',
    'Serbia': 'Europe',
    'Ireland': 'Europe',
    'Iceland': 'Europe',
    
    // North America
    'United States': 'North America',
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    
    // South America
    'Chile': 'South America',
    'Colombia': 'South America',
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Peru': 'South America',
    'Ecuador': 'South America',
    'Venezuela': 'South America',
    'Uruguay': 'South America',
    'Paraguay': 'South America',
    'Bolivia': 'South America',
    'Guyana': 'South America',
    'Suriname': 'South America',
    
    // Asia
    'Singapore': 'Asia',
    'Hong Kong': 'Asia',
    'Japan': 'Asia',
    'South Korea': 'Asia',
    'Vietnam': 'Asia',
    'Thailand': 'Asia',
    'Taiwan': 'Asia',
    'China': 'Asia',
    'Philippines': 'Asia',
    'Indonesia': 'Asia',
    'India': 'Asia',
    'Malaysia': 'Asia',
    'Cambodia': 'Asia',
    'Laos': 'Asia',
    'Myanmar': 'Asia',
    'Bangladesh': 'Asia',
    'Sri Lanka': 'Asia',
    'Nepal': 'Asia',
    'Pakistan': 'Asia',
    'Afghanistan': 'Asia',
    'Kazakhstan': 'Asia',
    'Uzbekistan': 'Asia',
    'Mongolia': 'Asia',
    
    // Middle East
    'UAE': 'Middle East',
    'United Arab Emirates': 'Middle East',
    'Qatar': 'Middle East',
    'Saudi Arabia': 'Middle East',
    'Israel': 'Middle East',
    'Jordan': 'Middle East',
    'Kuwait': 'Middle East',
    'Oman': 'Middle East',
    'Bahrain': 'Middle East',
    'Lebanon': 'Middle East',
    'Syria': 'Middle East',
    'Iraq': 'Middle East',
    'Iran': 'Middle East',
    'Yemen': 'Middle East',
    
    // Africa
    'Ethiopia': 'Africa',
    'Egypt': 'Africa',
    'Kenya': 'Africa',
    'Morocco': 'Africa',
    'South Africa': 'Africa',
    'Mauritius': 'Africa',
    'Rwanda': 'Africa',
    'Nigeria': 'Africa',
    'Ghana': 'Africa',
    'Tanzania': 'Africa',
    'Uganda': 'Africa',
    'Algeria': 'Africa',
    'Tunisia': 'Africa',
    'Libya': 'Africa',
    'Sudan': 'Africa',
    'Senegal': 'Africa',
    'Ivory Coast': 'Africa',
    'Cameroon': 'Africa',
    'Zimbabwe': 'Africa',
    'Zambia': 'Africa',
    'Botswana': 'Africa',
    'Namibia': 'Africa',
    'Angola': 'Africa',
    'Mozambique': 'Africa',
    'Madagascar': 'Africa',
    
    // Oceania
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',
    'Fiji': 'Oceania',
    'Papua New Guinea': 'Oceania',
    'Vanuatu': 'Oceania',
    'Solomon Islands': 'Oceania',
    'New Caledonia': 'Oceania',
    'French Polynesia': 'Oceania'
  };
  
  return countryToContinentMap[airport.country] || 'Other';
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
  // Alternative names mapping for codes and short names
  const alternativeNameMap: { [key: string]: string } = {
    // 🌍 Европа
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'AirFrance': 'Air France',
    'KL': 'KLM',
    'BA': 'British Airways',
    'IB': 'Iberia',
    'Swiss': 'Swiss International Air Lines',
    'SWISS': 'Swiss International Air Lines',
    'LX': 'Swiss International Air Lines',
    'OS': 'Austrian Airlines',
    'AY': 'Finnair',
    'SK': 'SAS',
    'TP': 'TAP Air Portugal',
    'LO': 'LOT Polish Airlines',
    
    // 🌍 Северная Америка
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'AC': 'Air Canada',
    'AS': 'Alaska Airlines',
    
    // 🌍 Южная Америка
    'LA': 'LATAM Airlines',
    'AV': 'Avianca',
    'G3': 'GOL Linhas Aéreas',
    'AD': 'Azul Brazilian Airlines',
    'H2': 'SKY Airline',
    'AR': 'Aerolíneas Argentinas',
    
    // 🌍 Азия
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'JAL': 'Japan Airlines',
    'ANA': 'All Nippon Airways',
    'NH': 'All Nippon Airways',
    'KE': 'Korean Air',
    'OZ': 'Asiana Airlines',
    'VN': 'Vietnam Airlines',
    'TG': 'Thai Airways',
    'CI': 'China Airlines',
    'CZ': 'China Southern Airlines',
    'MU': 'China Eastern Airlines',
    'CA': 'Air China',
    'PR': 'Philippine Airlines',
    'GA': 'Garuda Indonesia',
    '6E': 'IndiGo',
    
    // 🌍 Ближний Восток
    'EK': 'Emirates',
    'Qatar': 'Qatar Airways',
    'QATAR': 'Qatar Airways',
    'QR': 'Qatar Airways',
    'Etihad': 'Etihad Airways',
    'ETIHAD': 'Etihad Airways',
    'EY': 'Etihad Airways',
    'SV': 'Saudia',
    'LY': 'El Al',
    'RJ': 'Royal Jordanian',
    'KU': 'Kuwait Airways',
    'WY': 'Oman Air',
    
    // 🌍 Африка
    'ET': 'Ethiopian Airlines',
    'MS': 'EgyptAir',
    'KQ': 'Kenya Airways',
    'AT': 'Royal Air Maroc',
    'SA': 'South African Airways',
    'MK': 'Air Mauritius',
    'WB': 'RwandAir',
    
    // 🌍 Океания
    'QF': 'Qantas',
    'VA': 'Virgin Australia',
    'NZ': 'Air New Zealand',
    'JQ': 'Jetstar Airways',
    'FJ': 'Fiji Airways'
  };
  
  // Check if we need to convert the airline name first
  const resolvedAirlineName = alternativeNameMap[airlineName] || airlineName;
  
  // Mapping for exact airline names to their logo files
  const logoMap: { [key: string]: string } = {
    // 🌍 Европа
    'Lufthansa': '/logos/airlines/Lufthansa.svg',
    'Air France': '/logos/airlines/Air France.svg',
    'KLM': '/logos/airlines/KLM.svg',
    'British Airways': '/logos/airlines/British Airways.svg',
    'Virgin Atlantic': '/logos/airlines/Virgin Group.svg',
    'Iberia': '/logos/airlines/Iberia (airline).svg',
    'Swiss International Air Lines': '/logos/airlines/Swiss International Air Lines.svg',
    'Austrian Airlines': '/logos/airlines/Austrian Airlines.svg',
    'Finnair': '/logos/airlines/Finnair.svg',
    'SAS': '/logos/airlines/SAS.svg',
    'TAP Air Portugal': '/logos/airlines/TAP Air Portugal.svg',
    'LOT Polish Airlines': '/logos/airlines/LOT Polish Airlines.svg',
    'Tarom': '/logos/airlines/Tarom.svg',
    
    // 🌍 Северная Америка
    'American Airlines': '/logos/airlines/American Airlines.svg',
    'Delta Air Lines': '/logos/airlines/Delta Air Lines.svg',
    'United Airlines': '/logos/airlines/United Airlines.svg',
    'Air Canada': '/logos/airlines/Air Canada.svg',
    'Alaska Airlines': '/logos/airlines/Alaska Airlines.svg',
    
    // 🌍 Южная Америка
    'LATAM Airlines': '/logos/airlines/LATAM Airlines.svg',
    'Avianca': '/logos/airlines/Avianca.svg',
    'GOL Linhas Aéreas': '/logos/airlines/GOL Linhas Aéreas.svg',
    'Azul Brazilian Airlines': '/logos/airlines/Azul Brazilian Airlines.svg',
    'SKY Airline': '/logos/airlines/SKY Airline.svg',
    'Aerolíneas Argentinas': '/logos/airlines/Aerolíneas Argentinas.svg',
    
    // 🌍 Азия
    'Singapore Airlines': '/logos/airlines/Singapore Airlines.svg',
    'Cathay Pacific': '/logos/airlines/Cathay Pacific.svg',
    'Japan Airlines': '/logos/airlines/Japan Airlines.svg',
    'All Nippon Airways': '/logos/airlines/All Nippon Airways.svg',
    'Korean Air': '/logos/airlines/Korean Air.svg',
    'Asiana Airlines': '/logos/airlines/Asiana Airlines.svg',
    'Vietnam Airlines': '/logos/airlines/Vietnam Airlines.svg',
    'Thai Airways': '/logos/airlines/Thai Airways.svg',

    'China Southern Airlines': '/logos/airlines/China Southern Airlines.svg',
    'China Eastern Airlines': '/logos/airlines/China Eastern Airlines.svg',
    'Air China': '/logos/airlines/Air China.svg',
    'Philippine Airlines': '/logos/airlines/Philippine Airlines.svg',
    'Garuda Indonesia': '/logos/airlines/Garuda Indonesia.svg',
    'IndiGo': '/logos/airlines/IndiGo.svg',
    
    // 🌍 Ближний Восток
    'Emirates': '/logos/airlines/Emirates.svg',
    'Qatar Airways': '/logos/airlines/Qatar Airways.svg',
    'Etihad Airways': '/logos/airlines/Etihad Airways.svg',
    'Saudia': '/logos/airlines/Saudia.svg',
    'El Al': '/logos/airlines/El Al.svg',
    'Royal Jordanian': '/logos/airlines/Royal Jordanian.svg',
    'Kuwait Airways': '/logos/airlines/Kuwait Airways.svg',
    'Oman Air': '/logos/airlines/Oman Air.svg',
    
    // 🌍 Африка
    'Ethiopian Airlines': '/logos/airlines/Ethiopian Airlines.svg',
    'EgyptAir': '/logos/airlines/EgyptAir.svg',
    'Kenya Airways': '/logos/airlines/Kenya Airways.svg',
    'Royal Air Maroc': '/logos/airlines/Royal Air Maroc.svg',
    'South African Airways': '/logos/airlines/South African Airways.svg',
    'Air Mauritius': '/logos/airlines/Air Mauritius.svg',
    'RwandAir': '/logos/airlines/RwandAir.svg',
    
    // 🌍 Океания
    'Qantas': '/logos/airlines/Qantas.svg',
    'Virgin Australia': '/logos/airlines/Virgin Australia.svg',
    'Air New Zealand': '/logos/airlines/Air New Zealand.svg',
    'Jetstar Airways': '/logos/airlines/Jetstar Airways.svg',
    'Fiji Airways': '/logos/airlines/Fiji Airways.svg'
  };
  
  // If exact match found, return it
  if (logoMap[resolvedAirlineName]) {
    return logoMap[resolvedAirlineName];
  }
  
  // Try to find a close match by normalizing the name
  const normalizedName = resolvedAirlineName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Additional mappings for common variations
  const alternativeMap: { [key: string]: string } = {
    // 🌍 Европа
    'lufthansa': '/logos/airlines/Lufthansa.svg',
    'airfrance': '/logos/airlines/Air France.svg',
    'klm': '/logos/airlines/KLM.svg',
    'british': '/logos/airlines/British Airways.svg',
    'iberia': '/logos/airlines/Iberia.svg',
    'swiss': '/logos/airlines/Swiss International Air Lines.svg',
    'austrian': '/logos/airlines/Austrian Airlines.svg',
    'finnair': '/logos/airlines/Finnair.svg',
    'sas': '/logos/airlines/SAS Braathens.svg.svg',
    'tap': '/logos/airlines/TAP Air Portugal.svg',
    'lot': '/logos/airlines/LOT Polish Airlines.svg',
    
    // 🌍 Северная Америка
    'american': '/logos/airlines/American Airlines.svg',
    'delta': '/logos/airlines/Delta Air Lines.svg',
    'united': '/logos/airlines/United Airlines.svg',
    'aircanada': '/logos/airlines/Air Canada.svg',
    'alaska': '/logos/airlines/Alaska Airlines.svg',
    
    // 🌍 Южная Америка
    'latam': '/logos/airlines/LATAM Airlines.svg',
    'avianca': '/logos/airlines/Avianca.svg',
    'gol': '/logos/airlines/GOL Linhas Aéreas.svg',
    'azul': '/logos/airlines/Azul Brazilian Airlines.svg',
    'sky': '/logos/airlines/SKY Airline.svg',
    'aerolineas': '/logos/airlines/Aerolíneas Argentinas.svg',
    
    // 🌍 Азия
    'singapore': '/logos/airlines/Singapore Airlines.svg',
    'cathay': '/logos/airlines/Cathay Pacific.svg',
    'jal': '/logos/airlines/Japan Airlines.svg',
    'ana': '/logos/airlines/All Nippon Airways.svg',
    'allnipponairways': '/logos/airlines/All Nippon Airways.svg',
    'korean': '/logos/airlines/Korean Air.svg',
    'asiana': '/logos/airlines/Asiana Airlines.svg',
    'vietnam': '/logos/airlines/Vietnam Airlines.svg',
    'thai': '/logos/airlines/Thai Airways.svg',
    'chinaairlines': '/logos/airlines/China Airlines.svg',
    'chinasouthern': '/logos/airlines/China Southern Airlines.svg',
    'chinaeastern': '/logos/airlines/China Eastern Airlines.svg',
    'airchina': '/logos/airlines/Air China.svg',
    'philippine': '/logos/airlines/Philippine Airlines.svg',
    'garuda': '/logos/airlines/Garuda Indonesia.svg',
    'indigo': '/logos/airlines/IndiGo.svg',
    
    // 🌍 Ближний Восток
    'emirates': '/logos/airlines/Emirates.svg',
    'qatar': '/logos/airlines/Qatar Airways.svg',
    'etihad': '/logos/airlines/Etihad Airways.svg',
    'saudia': '/logos/airlines/Saudia.svg',
    'elal': '/logos/airlines/El Al.svg',
    'royaljordanian': '/logos/airlines/Royal Jordanian.svg',
    'kuwait': '/logos/airlines/Kuwait Airways.svg',
    'oman': '/logos/airlines/Oman Air.svg',
    
    // 🌍 Африка
    'ethiopian': '/logos/airlines/Ethiopian Airlines.svg',
    'egyptair': '/logos/airlines/EgyptAir.svg',
    'kenya': '/logos/airlines/Kenya Airways.svg',
    'royalairmaroc': '/logos/airlines/Royal Air Maroc.svg',
    'southafrican': '/logos/airlines/South African Airways.svg',
    'airmauritius': '/logos/airlines/Air Mauritius.svg',
    'rwandair': '/logos/airlines/RwandAir.svg',
    
    // 🌍 Океания
    'qantas': '/logos/airlines/Qantas.svg',
    'virgin': '/logos/airlines/Virgin Australia.svg',
    'airnewzealand': '/logos/airlines/Air New Zealand.svg',
    'jetstar': '/logos/airlines/Jetstar Airways.svg',
    'fiji': '/logos/airlines/Fiji Airways.svg'
  };
  
  // Check alternative mappings
  if (alternativeMap[normalizedName]) {
    return alternativeMap[normalizedName];
  }
  
  // Default fallback
  return '/logos/airlines/Emirates (airline).svg';
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
function formatTimeToAMPM(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function parseAMPMTimeToMinutes(timeString: string): number {
  const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!match) return 0;
  
  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3];
  
  if (period === 'AM' && hour === 12) {
    hour = 0;
  } else if (period === 'PM' && hour !== 12) {
    hour += 12;
  }
  
  return hour * 60 + minute;
}

function generateFlightTimes(durationString: string, rng?: SeededRandom): { departure: string; arrival: string; arrivalDateOffset: number } {
  const randomValue1 = rng ? rng.random() : Math.random();
  const randomValue2 = rng ? rng.random() : Math.random();
  const departureHour = Math.floor(randomValue1 * 24);
  const departureMinute = Math.floor(randomValue2 * 4) * 15; // 0, 15, 30, 45

  const departure = formatTimeToAMPM(departureHour, departureMinute);

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

  const arrivalHour = arrivalTime.getUTCHours();
  const arrivalMinute = arrivalTime.getUTCMinutes();
  const arrival = formatTimeToAMPM(arrivalHour, arrivalMinute);

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
        rating: airline.rating
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
  
  // Фильтрация Multi-city рейсов по времени, если первый сегмент сегодня
  let filteredMultiCityFlights = multiCityFlights;
  if (segments.length > 0) {
    const firstSegment = segments[0];
    const today = new Date();
    const firstSegmentDate = new Date(firstSegment.date + 'T00:00:00');
    if (firstSegmentDate.toDateString() === today.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      filteredMultiCityFlights = multiCityFlights.filter(flight => {
        if (flight.segments.length > 0) {
          const flightMinutes = parseAMPMTimeToMinutes(flight.segments[0].departure.time);
          return flightMinutes > nowMinutes;
        }
        return true;
      });
    }
  }
  
  return filteredMultiCityFlights.sort((a, b) => a.totalPrice - b.totalPrice);
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
        rating: airline.rating
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
  
  // Special handling for RMO-IAS routes: use only Tarom
  if ((fromCode === 'RMO' && toCode === 'IAS') || (fromCode === 'IAS' && toCode === 'RMO')) {
    const taromAirline = commonAirlines.find(airline => airline.name === 'Tarom');
    if (taromAirline) {
      const selectedAirlines = [taromAirline, taromAirline, taromAirline]; // Use Tarom for all 3 flights
      
      // Create seeded random number generator for consistent daily prices
      const seed = createDailySeed(fromCode, toCode, flightClass);
      const rng = new SeededRandom(seed);
      
      const distance = calculateDistance(
        fromAirport.lat,
        fromAirport.lon,
        toAirport.lat,
        toAirport.lon
      );
      
      const flights: GeneratedFlight[] = [];
      
      for (let i = 0; i < 3; i++) {
        const airline = selectedAirlines[i];
        const stops = calculateStops(distance, rng);
        const duration = calculateDuration(distance, stops, rng);
        const price = calculatePrice(distance, airline.name, flightClass, fromAirport.country, toAirport.country, rng);
        const { departure, arrival } = generateFlightTimes(duration, rng);
        const stopoverAirports = selectStopoverAirports(fromAirport, toAirport, stops, airline.name, rng);
        const amenities = getAmenities(airline.name, distance);
        const seatsLeft = Math.floor(rng.random() * 9) + 1;
        
        const flight: GeneratedFlight = {
          id: i + 1,
          airline: airline.name,
          logo: getAirlineLogo(airline.name),
          flightNumber: `${airline.iata}${Math.floor(rng.random() * 9000) + 1000}`,
          departure: {
            time: departure,
            airport: fromCode,
            city: fromAirport.city,
            date: departureDate
          },
          arrival: {
            time: arrival,
            airport: toCode,
            city: toAirport.city,
            date: departureDate
          },
          duration,
          stops,
          stopoverAirports: stopoverAirports.length > 0 ? stopoverAirports : undefined,
          price,
          class: flightClass,
          amenities,
          rating: airline.rating,
          seatsLeft
        };
        
        flights.push(flight);
      }
      
      return flights;
    }
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
  
  // Determine continents for departure and arrival airports
  const fromContinent = getAirportContinent(fromAirport);
  const toContinent = getAirportContinent(toAirport);
  
  // Filter airlines based on countries and continents with priority for national carriers
  const isDomesticUSA = fromAirport.country === 'United States' && toAirport.country === 'United States';
  
  // Normalize country names for better matching
  const normalizeCountry = (country: string) => {
    const countryMap: { [key: string]: string } = {
      'United States': 'USA',
      'United Kingdom': 'UK'
    };
    return countryMap[country] || country;
  };
  
  const fromCountryNormalized = normalizeCountry(fromAirport.country);
  const toCountryNormalized = normalizeCountry(toAirport.country);
  
  const availableAirlines = commonAirlines.filter(airline => {
    // US airlines only for domestic US routes
    if (airline.country === 'USA') {
      return isDomesticUSA;
    }
    
    // Priority 1: Airlines from departure country
    if (airline.country === fromCountryNormalized) {
      return true;
    }
    
    // Priority 2: Airlines from arrival country
    if (airline.country === toCountryNormalized) {
      return true;
    }
    
    // Priority 3: For international routes, include airlines from relevant continents
    if (!isDomesticUSA) {
      // Include airlines from departure continent
      if (airline.continent === fromContinent) {
        return true;
      }
      
      // Include airlines from arrival continent
      if (airline.continent === toContinent) {
        return true;
      }
      
      // Always include premium Middle Eastern airlines for long-haul routes
      if (airline.continent === 'Middle East' && airline.premium) {
        const distance = calculateDistance(
          fromAirport.lat,
          fromAirport.lon,
          toAirport.lat,
          toAirport.lon
        );
        return distance > 3000; // Only for long-haul flights
      }
      
      // For intercontinental flights, include some premium global carriers
      if (fromContinent !== toContinent) {
        // Include premium Asian carriers for Asia-related routes
        if ((fromContinent === 'Asia' || toContinent === 'Asia') && 
            airline.continent === 'Asia' && airline.premium) {
          return true;
        }
        
        // Include premium European carriers for Europe-related routes
        if ((fromContinent === 'Europe' || toContinent === 'Europe') && 
            airline.continent === 'Europe' && airline.premium) {
          return true;
        }
      }
    }
    
    return false;
  });
  
  // Fallback to all airlines if no airlines match the criteria
  const finalAirlines = availableAirlines.length > 0 ? availableAirlines : commonAirlines;
  
  // Prioritize national airlines (from departure and arrival countries)
  const nationalAirlines = finalAirlines.filter(airline => 
    airline.country === fromCountryNormalized || airline.country === toCountryNormalized
  );
  
  const otherAirlines = finalAirlines.filter(airline => 
    airline.country !== fromCountryNormalized && airline.country !== toCountryNormalized
  );
  
  // Shuffle other airlines
  const shuffledOtherAirlines = [...otherAirlines];
  for (let i = shuffledOtherAirlines.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffledOtherAirlines[i], shuffledOtherAirlines[j]] = [shuffledOtherAirlines[j], shuffledOtherAirlines[i]];
  }
  
  // Combine national airlines first, then other airlines
  const prioritizedAirlines = [...nationalAirlines, ...shuffledOtherAirlines];
  
  // Always select exactly 3 airlines, repeating if we have fewer available
  const selectedAirlines = [];
  for (let i = 0; i < 3; i++) {
    selectedAirlines.push(prioritizedAirlines[i % prioritizedAirlines.length]);
  }
  
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
      seatsLeft: Math.floor(rng.random() * 8) + 8 // Random seats left between 8-15
    };

    // Generate return flight for Round Trip
    if (tripType === 'Round Trip') {
      const returnStopsCount = calculateStops(distance, rng);
      const returnStopoverAirports = selectStopoverAirports(toAirport, fromAirport, returnStopsCount, airline.name, rng);
      const returnDuration = calculateDuration(distance, returnStopsCount, rng);
      const returnTimes = generateFlightTimes(returnDuration, rng);
      const returnAmenities = getAmenities(airline.name, distance);
      
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
        amenities: returnAmenities
      };
    }

    return flight;
  });
  
  // Фильтрация рейсов по времени, если дата вылета сегодня
  let filteredFlights = flights;
  if (departureDate) {
    const today = new Date();
    const depDateObj = new Date(departureDate + 'T00:00:00');
    if (depDateObj.toDateString() === today.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      filteredFlights = flights.filter(flight => {
        const flightMinutes = parseAMPMTimeToMinutes(flight.departure.time);
        return flightMinutes > nowMinutes;
      });
    }
  }
  
  // Если после фильтрации осталось меньше 3 рейсов, дополняем из исходного списка
  if (filteredFlights.length < 3) {
    const sortedFlights = flights.sort((a, b) => a.price - b.price);
    const additionalFlights: GeneratedFlight[] = [];
    
    for (const flight of sortedFlights) {
      if (filteredFlights.length + additionalFlights.length >= 3) break;
      if (!filteredFlights.find(f => f.id === flight.id) && !additionalFlights.find(f => f.id === flight.id)) {
        additionalFlights.push(flight);
      }
    }
    
    filteredFlights = [...filteredFlights, ...additionalFlights];
  }
  
  // Sort by price (cheapest first) and ensure exactly 3 flights
  return filteredFlights.sort((a, b) => a.price - b.price).slice(0, 3);
}