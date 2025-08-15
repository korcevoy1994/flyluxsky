import airports from './airports.json';
import type { Airport } from './utils';
import { pricingConfig } from './pricingConfig';
import { loadPricingConfig, type PricingConfiguration, ensurePricingConfigLoaded } from './pricingAdmin';


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


function createDailySeed(fromCode: string, toCode: string, flightClass: string): number {

  const dateString = '2024-01-15';
  const routeString = `${fromCode}-${toCode}-${flightClass}`;
  

  let hash = 0;
  const fullString = dateString + routeString;
  for (let i = 0; i < fullString.length; i++) {
    const char = fullString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
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


const commonAirlines = [

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
  { name: 'Turkish Airlines', iata: 'TK', rating: 4.3, country: 'Turkey', premium: false, hubs: ['IST'], continent: 'Europe' },


  // North America Airlines
  { name: 'American Airlines', iata: 'AA', rating: 4.2, country: 'USA', premium: true, hubs: ['DFW', 'CLT', 'PHX', 'MIA'], domestic: true, continent: 'North America' },
  { name: 'Delta Air Lines', iata: 'DL', rating: 4.3, country: 'USA', premium: true, hubs: ['ATL', 'DTW', 'MSP', 'SEA'], domestic: true, continent: 'North America' },
  { name: 'United Airlines', iata: 'UA', rating: 4.1, country: 'USA', premium: true, hubs: ['ORD', 'DEN', 'IAH', 'SFO'], domestic: true, continent: 'North America' },
  { name: 'Air Canada', iata: 'AC', rating: 4.4, country: 'Canada', premium: false, hubs: ['YYZ', 'YVR', 'YUL'], continent: 'North America' },
  { name: 'Alaska Airlines', iata: 'AS', rating: 4.4, country: 'USA', premium: false, hubs: ['SEA', 'ANC', 'PDX', 'LAX'], domestic: true, continent: 'North America' },


  { name: 'LATAM Airlines', iata: 'LA', rating: 4.3, country: 'Chile', premium: false, hubs: ['SCL', 'GRU', 'LIM'], continent: 'South America' },
  { name: 'Avianca', iata: 'AV', rating: 4.2, country: 'Colombia', premium: false, hubs: ['BOG', 'UIO', 'SAL'], continent: 'South America' },
  { name: 'GOL Linhas Aéreas', iata: 'G3', rating: 4.0, country: 'Brazil', premium: false, hubs: ['GRU', 'CGH'], continent: 'South America' },
  { name: 'Azul Brazilian Airlines', iata: 'AD', rating: 4.1, country: 'Brazil', premium: false, hubs: ['VCP', 'CNF'], continent: 'South America' },
  { name: 'SKY Airline', iata: 'H2', rating: 3.9, country: 'Chile', premium: false, hubs: ['SCL'], continent: 'South America' },
  { name: 'Aerolíneas Argentinas', iata: 'AR', rating: 3.8, country: 'Argentina', premium: false, hubs: ['EZE', 'AEP'], continent: 'South America' },


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


  { name: 'Emirates', iata: 'EK', rating: 4.8, country: 'UAE', premium: true, hubs: ['DXB', 'DWC'], continent: 'Middle East' },
  { name: 'Qatar Airways', iata: 'QR', rating: 4.8, country: 'Qatar', premium: true, hubs: ['DOH'], continent: 'Middle East' },
  { name: 'Etihad Airways', iata: 'EY', rating: 4.7, country: 'UAE', premium: true, hubs: ['AUH'], continent: 'Middle East' },
  { name: 'Saudia', iata: 'SV', rating: 4.2, country: 'Saudi Arabia', premium: false, hubs: ['RUH', 'JED'], continent: 'Middle East' },
  { name: 'El Al', iata: 'LY', rating: 4.3, country: 'Israel', premium: false, hubs: ['TLV'], continent: 'Middle East' },
  { name: 'Royal Jordanian', iata: 'RJ', rating: 4.1, country: 'Jordan', premium: false, hubs: ['AMM'], continent: 'Middle East' },
  { name: 'Kuwait Airways', iata: 'KU', rating: 3.9, country: 'Kuwait', premium: false, hubs: ['KWI'], continent: 'Middle East' },
  { name: 'Oman Air', iata: 'WY', rating: 4.2, country: 'Oman', premium: false, hubs: ['MCT'], continent: 'Middle East' },


  { name: 'Ethiopian Airlines', iata: 'ET', rating: 4.3, country: 'Ethiopia', premium: false, hubs: ['ADD'], continent: 'Africa' },
  { name: 'EgyptAir', iata: 'MS', rating: 3.9, country: 'Egypt', premium: false, hubs: ['CAI'], continent: 'Africa' },
  { name: 'Kenya Airways', iata: 'KQ', rating: 4.0, country: 'Kenya', premium: false, hubs: ['NBO'], continent: 'Africa' },
  { name: 'Royal Air Maroc', iata: 'AT', rating: 4.0, country: 'Morocco', premium: false, hubs: ['CMN'], continent: 'Africa' },
  { name: 'South African Airways', iata: 'SA', rating: 3.8, country: 'South Africa', premium: false, hubs: ['JNB'], continent: 'Africa' },
  { name: 'Air Mauritius', iata: 'MK', rating: 4.1, country: 'Mauritius', premium: false, hubs: ['MRU'], continent: 'Africa' },
  { name: 'RwandAir', iata: 'WB', rating: 4.2, country: 'Rwanda', premium: false, hubs: ['KGL'], continent: 'Africa' },


  { name: 'Qantas', iata: 'QF', rating: 4.6, country: 'Australia', premium: true, hubs: ['SYD', 'MEL'], continent: 'Oceania' },
  { name: 'Virgin Australia', iata: 'VA', rating: 4.3, country: 'Australia', premium: false, hubs: ['SYD', 'MEL', 'BNE'], continent: 'Oceania' },
  { name: 'Air New Zealand', iata: 'NZ', rating: 4.5, country: 'New Zealand', premium: false, hubs: ['AKL', 'CHC'], continent: 'Oceania' },
  { name: 'Jetstar Airways', iata: 'JQ', rating: 3.8, country: 'Australia', premium: false, hubs: ['MEL', 'SYD'], continent: 'Oceania' },
  { name: 'Fiji Airways', iata: 'FJ', rating: 4.1, country: 'Fiji', premium: false, hubs: ['NAN'], continent: 'Oceania' }
];


const majorHubs = {
  'North America': ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'DEN', 'SEA', 'YYZ', 'YVR'],
  'Europe': ['LHR', 'CDG', 'FRA', 'AMS', 'IST', 'MUC', 'ZUR', 'VIE', 'CPH', 'ARN'],
  'Asia': ['NRT', 'ICN', 'SIN', 'HKG', 'BKK', 'KUL', 'DEL', 'BOM', 'PVG', 'PEK'],
  'Middle East': ['DXB', 'DOH', 'AUH', 'KWI', 'RUH'],
  'South America': ['MEX', 'GRU', 'EZE', 'LIM', 'BOG', 'SCL', 'PTY'],
  'Africa': ['CAI', 'JNB', 'ADD', 'LOS', 'CMN'],
  'Oceania': ['SYD', 'MEL', 'AKL']
};


function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateStops(distance: number, rng?: SeededRandom): number {
  
  if (distance < 500) {

    return 0;
  } else if (distance < 2000) {

    return (rng?.random() || Math.random()) > 0.9 ? 1 : 0;
  } else if (distance < 6000) {

    return (rng?.random() || Math.random()) > 0.7 ? 1 : 0;
  } else {

    return (rng?.random() || Math.random()) > 0.4 ? 1 : 0;
  }
}


function getAirportRegion(airportCode: string): string | null {
  for (const [region, codes] of Object.entries(majorHubs)) {
    if (codes.includes(airportCode)) {
      return region;
    }
  }
  return null;
}


function getAirportContinent(airport: Airport): string {
  const countryToContinentMap: { [key: string]: string } = {

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
    

    'United States': 'North America',
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    

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


function getRealisticStopovers(
  fromAirport: Airport,
  toAirport: Airport,
  airlineName: string
): string[] {
  const airline = commonAirlines.find(a => a.name === airlineName);
  const fromRegion = getAirportRegion(fromAirport.code);
  const toRegion = getAirportRegion(toAirport.code);
  
  const potentialHubs: string[] = [];
  

  if (airline?.hubs) {
    potentialHubs.push(...airline.hubs);
  }
  

  if (fromRegion && toRegion && fromRegion !== toRegion) {

    if ((fromRegion === 'North America' && toRegion === 'Europe') || 
        (fromRegion === 'Europe' && toRegion === 'North America')) {
      potentialHubs.push('LHR', 'CDG', 'FRA', 'AMS', 'JFK', 'ORD', 'ATL');
    }

    else if (fromRegion === 'North America' && toRegion === 'Asia') {
      potentialHubs.push('NRT', 'ICN', 'SIN', 'HKG', 'SEA', 'LAX', 'SFO');
    }
    else if (fromRegion === 'Europe' && toRegion === 'Asia') {
      potentialHubs.push('IST', 'DXB', 'DOH', 'SIN', 'HKG', 'FRA', 'AMS');
    }

    else if ((fromRegion === 'Europe' || fromRegion === 'North America') && 
             (toRegion === 'Asia' || toRegion === 'Africa')) {
      potentialHubs.push('DXB', 'DOH', 'AUH', 'IST');
    }

    else if (fromRegion === 'North America' && toRegion === 'Latin America') {
      potentialHubs.push('MEX', 'PTY', 'DFW', 'MIA');
    }
  }
  

  if (fromRegion && fromRegion in majorHubs) {
    potentialHubs.push(...majorHubs[fromRegion as keyof typeof majorHubs].slice(0, 3));
  }
  if (toRegion && toRegion in majorHubs) {
    potentialHubs.push(...majorHubs[toRegion as keyof typeof majorHubs].slice(0, 3));
  }
  

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
  

  const availableHubs = realisticHubs
    .map(code => airportsMap.get(code))
    .filter(airport => airport !== undefined);
  
  if (availableHubs.length === 0) {

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
  

  const selectedStopovers: { code: string; city: string; country: string }[] = [];
  
  for (let i = 0; i < stopsCount && availableHubs.length > 0; i++) {
    const randomIndex = Math.floor((rng?.random() || Math.random()) * availableHubs.length);
    const selectedAirport = availableHubs[randomIndex];
    
    selectedStopovers.push({
      code: selectedAirport.code,
      city: selectedAirport.city,
      country: selectedAirport.country
    });
    
    // Remove selected airport from the list
    availableHubs.splice(randomIndex, 1);
  }
  
  return selectedStopovers;
}


function calculateDuration(distance: number, stopsCount: number = 0, rng?: SeededRandom): string {

  const averageSpeed = 850;
  const flightTimeHours = distance / averageSpeed;
  

  const randomValue = rng ? rng.random() : Math.random();
  const taxiAndDelayMinutes = 30 + randomValue * 30;
  

  const layoverMinutes = stopsCount * (60 + randomValue * 120);
  
  const totalMinutes = Math.round(flightTimeHours * 60 + taxiAndDelayMinutes + layoverMinutes);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
}


// Helper function to determine route region and category
function getRouteInfo(fromCountry: string, toCountry: string, distance: number): { region: string; category: 'shortHaul' | 'mediumHaul' | 'longHaul' } {
  const isFromUSA = fromCountry === 'United States';
  const isInternational = fromCountry !== toCountry;
  
  let category: 'shortHaul' | 'mediumHaul' | 'longHaul';
  if (distance < 1500) {
    category = 'shortHaul';
  } else if (distance < 4000) {
    category = 'mediumHaul';
  } else {
    category = 'longHaul';
  }
  
  let region: string;
  if (isFromUSA && !isInternational) {
    region = 'USA Domestic';
  } else if (isFromUSA && isInternational) {
    // Determine destination region
    if (toCountry === 'United Kingdom' || toCountry === 'France' || toCountry === 'Germany' || 
        toCountry === 'Spain' || toCountry === 'Italy' || toCountry === 'Netherlands' || 
        toCountry === 'Switzerland' || toCountry === 'Austria' || toCountry === 'Belgium' ||
        toCountry === 'Portugal' || toCountry === 'Greece' || toCountry === 'Sweden' ||
        toCountry === 'Norway' || toCountry === 'Denmark' || toCountry === 'Finland') {
      region = 'USA to Europe';
    } else if (toCountry === 'United Arab Emirates' || toCountry === 'Qatar' || toCountry === 'Saudi Arabia' ||
               toCountry === 'Israel' || toCountry === 'Jordan' || toCountry === 'Kuwait' || toCountry === 'Oman') {
      region = 'USA to Middle East';
    } else if (toCountry === 'South Africa' || toCountry === 'Egypt' || toCountry === 'Kenya' ||
               toCountry === 'Morocco' || toCountry === 'Ethiopia' || toCountry === 'Nigeria') {
      region = 'USA to Africa';
    } else if (toCountry === 'China' || toCountry === 'South Korea' || toCountry === 'Thailand' ||
               toCountry === 'Singapore' || toCountry === 'Malaysia' || toCountry === 'Indonesia' ||
               toCountry === 'Philippines' || toCountry === 'Vietnam') {
      region = 'USA to Asia';
    } else if (toCountry === 'India' || toCountry === 'Japan') {
      region = 'USA to India/Japan';
    } else if (toCountry === 'Australia') {
      region = 'USA to Australia';
    } else if (toCountry === 'New Zealand' || toCountry === 'Fiji') {
      region = 'USA to Oceania';
    } else {
      region = 'USA to Asia'; // Default fallback
    }
  } else {
    // European and other international routes
    region = 'Europe to Asia'; // Default fallback for non-USA routes
  }
  
  return { region, category };
}

function calculatePriceWithAdminConfig(distance: number, airlineName: string, flightClass: string, fromCountry?: string, toCountry?: string, rng?: SeededRandom): number {
  try {
    const adminConfig = loadPricingConfig();
    
    if (fromCountry && toCountry) {
      const { region, category } = getRouteInfo(fromCountry, toCountry, distance);
      
      // Find matching region in admin config
      const regionConfig = adminConfig.regionPricing.find(r => r.region === region);
      if (regionConfig && regionConfig[category].length > 0) {
        const routeConfig = regionConfig[category][0]; // Use first route config for the category
        
        // Calculate base price with fluctuation
        const randomValue1 = rng ? rng.random() : Math.random();
        const priceRange = routeConfig.maxPrice - routeConfig.minPrice;
        const fluctuationAmount = (routeConfig.fluctuation / 100) * routeConfig.minPrice;
        const basePrice = routeConfig.minPrice + (randomValue1 * priceRange) + 
                         ((rng ? rng.random() : Math.random()) - 0.5) * 2 * fluctuationAmount;
        
        // Apply service class multiplier
        const serviceClass = adminConfig.serviceClasses.find(sc => 
          sc.name === flightClass || 
          (flightClass === 'Business class' && sc.name === 'Business') ||
          (flightClass === 'First class' && sc.name === 'First')
        );
        const classMultiplier = serviceClass ? serviceClass.multiplier : 1.0;
        
        let finalPrice = basePrice * classMultiplier;
        
        // Apply airline premium if applicable
        const airline = commonAirlines.find(a => a.name === airlineName);
        if (airline?.premium) {
          finalPrice *= 1.2; // 20% premium for premium airlines
        }
        
        return Math.round(finalPrice);
      }
    }
  } catch (error) {
    // Failed to load admin pricing config, falling back to default
  }
  
  // Fallback to original pricing logic
  return calculatePriceOriginal(distance, airlineName, flightClass, fromCountry, toCountry, rng);
}

function calculatePriceOriginal(distance: number, airlineName: string, flightClass: string, fromCountry?: string, toCountry?: string, rng?: SeededRandom): number {

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
  

  const airline = commonAirlines.find(a => a.name === airlineName);
  

  if (airline?.premium) {
    basePrice *= pricingConfig.premiumAirlineSurcharge;
  }
  

  const classMultiplier = pricingConfig.classMultipliers[flightClass as keyof typeof pricingConfig.classMultipliers] || 1.0;
  basePrice *= classMultiplier;
  

  const randomValue1 = rng ? rng.random() : Math.random();
  const fuelAndTaxesPercentage = pricingConfig.fuelAndTaxes.min + randomValue1 * (pricingConfig.fuelAndTaxes.max - pricingConfig.fuelAndTaxes.min);
  const fuelAndTaxes = basePrice * fuelAndTaxesPercentage;
  basePrice += fuelAndTaxes;
  

  const isFromUSA = fromCountry === 'United States';
  const isInternational = fromCountry !== toCountry;
  

  if (isFromUSA && isInternational) {
    const randomValue2 = rng ? rng.random() : Math.random();
    const usaPremium = pricingConfig.usaInternationalPremium.min + randomValue2 * (pricingConfig.usaInternationalPremium.max - pricingConfig.usaInternationalPremium.min);
    basePrice *= usaPremium;
  }
  

  const randomValue3 = rng ? rng.random() : Math.random();
  const marketVariation = pricingConfig.marketVariation.min + randomValue3 * (pricingConfig.marketVariation.max - pricingConfig.marketVariation.min);
  basePrice *= marketVariation;
  

  let minimumPrice;
  const flightClassKey = flightClass as keyof typeof pricingConfig.minimumPrice.standard;
  if (isFromUSA && isInternational) {
    minimumPrice = pricingConfig.minimumPrice.internationalFromUsa[flightClassKey];
  } else {
    minimumPrice = pricingConfig.minimumPrice.standard[flightClassKey];
  }
  

  const randomValue4 = rng ? rng.random() : Math.random();
  const randomizedMinimumPrice = minimumPrice * (1 + (randomValue4 * 0.15));
  
  return Math.round(Math.max(basePrice, randomizedMinimumPrice));
}

// Main price calculation function that uses admin config
function calculatePrice(distance: number, airlineName: string, flightClass: string, fromCountry?: string, toCountry?: string, rng?: SeededRandom): number {
  return calculatePriceWithAdminConfig(distance, airlineName, flightClass, fromCountry, toCountry, rng);
}


function getAirlineLogo(airlineName: string): string {

  const alternativeNameMap: { [key: string]: string } = {

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
    

    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'AC': 'Air Canada',
    'AS': 'Alaska Airlines',
    

    'LA': 'LATAM Airlines',
    'AV': 'Avianca',
    'G3': 'GOL Linhas Aéreas',
    'AD': 'Azul Brazilian Airlines',
    'H2': 'SKY Airline',
    'AR': 'Aerolíneas Argentinas',
    

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
    

    'ET': 'Ethiopian Airlines',
    'MS': 'EgyptAir',
    'KQ': 'Kenya Airways',
    'AT': 'Royal Air Maroc',
    'SA': 'South African Airways',
    'MK': 'Air Mauritius',
    'WB': 'RwandAir',
    

    'QF': 'Qantas',
    'VA': 'Virgin Australia',
    'NZ': 'Air New Zealand',
    'JQ': 'Jetstar Airways',
    'FJ': 'Fiji Airways',
    'Qantas Airways': 'Qantas',
    'Turkish': 'Turkish Airlines',
    'TK': 'Turkish Airlines'
  };
  
  
  const resolvedAirlineName = alternativeNameMap[airlineName] || airlineName;
  

  const logoMap: { [key: string]: string } = {

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
    'Tarom': '/logos/airlines/TAROM.svg',
    

    'American Airlines': '/logos/airlines/American Airlines.svg',
    'Delta Air Lines': '/logos/airlines/Delta Air Lines.svg',
    'United Airlines': '/logos/airlines/United Airlines.svg',
    'Air Canada': '/logos/airlines/Air Canada.svg',
    'Alaska Airlines': '/logos/airlines/Alaska Airlines.svg',
    

    'LATAM Airlines': '/logos/airlines/LATAM Airlines.svg',
    'Avianca': '/logos/airlines/Avianca.svg',
    'GOL Linhas Aéreas': '/logos/airlines/GOL Linhas Aéreas.svg',
    'Azul Brazilian Airlines': '/logos/airlines/Azul Brazilian Airlines.svg',
    'SKY Airline': '/logos/airlines/SKY Airline.svg',
    'Aerolíneas Argentinas': '/logos/airlines/Aerolíneas Argentinas.svg',
    

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
    

    'Emirates': '/logos/airlines/Emirates.svg',
    'Qatar Airways': '/logos/airlines/Qatar Airways.svg',
    'Etihad Airways': '/logos/airlines/Etihad Airways.svg',
    'Saudia': '/logos/airlines/Saudia.svg',
    'El Al': '/logos/airlines/El Al.svg',
    'Royal Jordanian': '/logos/airlines/Royal Jordanian.svg',
    'Kuwait Airways': '/logos/airlines/Kuwait Airways.svg',
    'Oman Air': '/logos/airlines/Oman Air.svg',
    

    'Ethiopian Airlines': '/logos/airlines/Ethiopian Airlines.svg',
    'EgyptAir': '/logos/airlines/EgyptAir.svg',
    'Kenya Airways': '/logos/airlines/Kenya Airways.svg',
    'Royal Air Maroc': '/logos/airlines/Royal Air Maroc.svg',
    'South African Airways': '/logos/airlines/South African Airways.svg',
    'Air Mauritius': '/logos/airlines/Air Mauritius.svg',
    'RwandAir': '/logos/airlines/RwandAir.svg',
    

    'Qantas': '/logos/airlines/Qantas.svg',
    'Virgin Australia': '/logos/airlines/Virgin Australia.svg',
    'Air New Zealand': '/logos/airlines/Air New Zealand.svg',
    'Jetstar Airways': '/logos/airlines/Jetstar Airways.svg',
    'Fiji Airways': '/logos/airlines/Fiji Airways.svg',
    'Turkish Airlines': '/logos/airlines/Turkish Airlines.svg'
  };
  
  
  if (logoMap[resolvedAirlineName]) {
    return logoMap[resolvedAirlineName];
  }
  

  const normalizedName = resolvedAirlineName.toLowerCase().replace(/[^a-z0-9]/g, '');
  

  const alternativeMap: { [key: string]: string } = {

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
    

    'american': '/logos/airlines/American Airlines.svg',
    'delta': '/logos/airlines/Delta Air Lines.svg',
    'united': '/logos/airlines/United Airlines.svg',
    'aircanada': '/logos/airlines/Air Canada.svg',
    'alaska': '/logos/airlines/Alaska Airlines.svg',
    

    'latam': '/logos/airlines/LATAM Airlines.svg',
    'avianca': '/logos/airlines/Avianca.svg',
    'gol': '/logos/airlines/GOL Linhas Aéreas.svg',
    'azul': '/logos/airlines/Azul Brazilian Airlines.svg',
    'sky': '/logos/airlines/SKY Airline.svg',
    'aerolineas': '/logos/airlines/Aerolíneas Argentinas.svg',
    

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
    

    'emirates': '/logos/airlines/Emirates.svg',
    'qatar': '/logos/airlines/Qatar Airways.svg',
    'etihad': '/logos/airlines/Etihad Airways.svg',
    'saudia': '/logos/airlines/Saudia.svg',
    'elal': '/logos/airlines/El Al.svg',
    'royaljordanian': '/logos/airlines/Royal Jordanian.svg',
    'kuwait': '/logos/airlines/Kuwait Airways.svg',
    'oman': '/logos/airlines/Oman Air.svg',
    

    'ethiopian': '/logos/airlines/Ethiopian Airlines.svg',
    'egyptair': '/logos/airlines/EgyptAir.svg',
    'kenya': '/logos/airlines/Kenya Airways.svg',
    'royalairmaroc': '/logos/airlines/Royal Air Maroc.svg',
    'southafrican': '/logos/airlines/South African Airways.svg',
    'airmauritius': '/logos/airlines/Air Mauritius.svg',
    'rwandair': '/logos/airlines/RwandAir.svg',
    

    'qantas': '/logos/airlines/Qantas.svg',
    'virgin': '/logos/airlines/Virgin Australia.svg',
    'airnewzealand': '/logos/airlines/Air New Zealand.svg',
    'jetstar': '/logos/airlines/Jetstar Airways.svg',
    'fiji': '/logos/airlines/Fiji Airways.svg',
    'turkishairlines': '/logos/airlines/Turkish Airlines.svg',
    'turkish': '/logos/airlines/Turkish Airlines.svg'
  };
  
  
  if (alternativeMap[normalizedName]) {
    return alternativeMap[normalizedName];
  }
  

  return '/logos/airlines/Emirates.svg';
}


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


  const durationMatch = durationString.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) {
    return { departure, arrival: departure, arrivalDateOffset: 0 };
  }

  const durationHours = parseInt(durationMatch[1]);
  const durationMinutes = parseInt(durationMatch[2]);


  const departureTime = new Date(0);
  departureTime.setUTCHours(departureHour, departureMinute, 0, 0);

  const arrivalTime = new Date(departureTime.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000);

  const arrivalHour = arrivalTime.getUTCHours();
  const arrivalMinute = arrivalTime.getUTCMinutes();
  const arrival = formatTimeToAMPM(arrivalHour, arrivalMinute);


  const arrivalDateOffset = Math.floor(arrivalTime.getTime() / (24 * 60 * 60 * 1000));

  return { departure, arrival, arrivalDateOffset };
}


function generateMultiCityFlightsFromSegments(segments: {from: string, to: string, date: string}[], flightClass: string): MultiCityFlight[] {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  
  if (segments.length === 0) {
    return [];
  }
  

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


  const routeString = segments.map(s => `${s.from}-${s.to}`).join('|');
  const seed = createDailySeed(routeString, flightClass, 'multi');
  const rng = new SeededRandom(seed);


  const multiCityFlights = [];
  
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const flightSegments = [];
    let totalPrice = 0;
    let totalDurationMinutes = 0;
    

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
      

      const isDomesticUSA = segmentFrom.country === 'United States' && segmentTo.country === 'United States';
      const availableAirlines = commonAirlines.filter(airline => {

        if (airline.country === 'USA') {
          return isDomesticUSA;
        }

        return true;
      });
      

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
    

    const totalHours = Math.floor(totalDurationMinutes / 60);
    const totalMinutes = totalDurationMinutes % 60;
    const totalDuration = `${totalHours}h ${totalMinutes}m`;
    
    multiCityFlights.push({
      id: optionIndex + 1,
      segments: flightSegments,
      totalPrice: (() => {
        try {
          const adminConfig = loadPricingConfig();
          const multiCityConfig = adminConfig.tripTypes.find(tt => tt.name === 'Multi-city');
          return Math.round(totalPrice * (multiCityConfig?.multiplier || 1.2));
        } catch (error) {
          return Math.round(totalPrice * 1.2); // Fallback
        }
      })(),
      totalDuration,
      class: flightClass,
      seatsLeft: Math.floor(rng.random() * 8) + 8
    });
  }
  

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

async function generateMultiCityFlights(fromCode: string, toCode: string, flightClass: string): Promise<MultiCityFlight[]> {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const fromAirport = airportsMap.get(fromCode);
  const toAirport = airportsMap.get(toCode);
  
  if (!fromAirport || !toAirport) {
    return [];
  }
  

  if (fromAirport.city === toAirport.city) {
    return [];
  }


  const seed = createDailySeed(fromCode, toCode, flightClass);
  const rng = new SeededRandom(seed);


  const allAirports = airports.filter(a => a.code !== fromCode && a.code !== toCode);
  const intermediateCount = Math.floor(rng.random() * 2) + 1;
  const intermediateAirports = [];
  
  for (let i = 0; i < intermediateCount; i++) {
    const randomIndex = Math.floor(rng.random() * allAirports.length);
    intermediateAirports.push(allAirports[randomIndex]);
  }


  const route = [fromAirport, ...intermediateAirports, toAirport];
  

  const multiCityFlights = [];
  
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const segments = [];
    let totalPrice = 0;
    let totalDurationMinutes = 0;
    

    for (let i = 0; i < route.length - 1; i++) {
      const segmentFrom = route[i];
      const segmentTo = route[i + 1];
      
      const distance = calculateDistance(
        segmentFrom.lat,
        segmentFrom.lon,
        segmentTo.lat,
        segmentTo.lon
      );
      

      const isDomesticUSA = segmentFrom.country === 'United States' && segmentTo.country === 'United States';
      const availableAirlines = commonAirlines.filter(airline => {

        if (airline.country === 'USA') {
          return isDomesticUSA;
        }

        return true;
      });
      

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
    

    const totalHours = Math.floor(totalDurationMinutes / 60);
    const totalMinutes = totalDurationMinutes % 60;
    const totalDuration = `${totalHours}h ${totalMinutes}m`;
    
    // Load trip type multiplier from admin config
    let tripMultiplier = 1.5; // fallback
    try {
      const adminConfig = await loadPricingConfig();
      const multiCityConfig = adminConfig.tripTypes.find(t => t.name === 'Multi-city');
      if (multiCityConfig) {
        tripMultiplier = multiCityConfig.multiplier;
      }
    } catch (error) {
      // Failed to load admin config for trip multiplier, using fallback
    }
    
    multiCityFlights.push({
      id: optionIndex + 1,
      segments,
      totalPrice: Math.round(totalPrice * tripMultiplier),
      totalDuration,
      class: flightClass,
      seatsLeft: Math.floor(rng.random() * 8) + 8
    });
  }
  
  return multiCityFlights.sort((a, b) => a.totalPrice - b.totalPrice);
}

export { generateMultiCityFlightsFromSegments };

export async function generateFlightsClient(fromCode: string, toCode: string, flightClass: string = 'Business class', tripType: string = 'One-way', departureDate?: string, returnDate?: string, selectedFlight?: { airline: string; price: number; duration: string }): Promise<(GeneratedFlight | MultiCityFlight)[]> {
  // generateFlightsClient called

  // Ensure pricing config is available even on first visit/incognito before any calculation happens
  try {
    await ensurePricingConfigLoaded();
  } catch {}

  if (tripType === 'Multi-city') {
    return await generateMultiCityFlights(fromCode, toCode, flightClass);
  }
  
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const fromAirport = airportsMap.get(fromCode);
  const toAirport = airportsMap.get(toCode);
  
  if (!fromAirport || !toAirport) {
    // Airport not found
    return [];
  }
  
  // Airports found
  

  if (fromAirport.city === toAirport.city) {
    return [];
  }
  

  if ((fromCode === 'RMO' && toCode === 'IAS') || (fromCode === 'IAS' && toCode === 'RMO')) {
    const taromAirline = commonAirlines.find(airline => airline.name === 'Tarom');
    if (taromAirline) {
      const selectedAirlines = [taromAirline, taromAirline, taromAirline];
      

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
  

  const seed = createDailySeed(fromCode, toCode, flightClass);
  const rng = new SeededRandom(seed);
  
  const distance = calculateDistance(
    fromAirport.lat,
    fromAirport.lon,
    toAirport.lat,
    toAirport.lon
  );
  

  const fromContinent = getAirportContinent(fromAirport);
  const toContinent = getAirportContinent(toAirport);
  

  const isDomesticUSA = fromAirport.country === 'United States' && toAirport.country === 'United States';
  

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

    if (airline.country === 'USA') {
      return isDomesticUSA;
    }
    

    if (airline.country === fromCountryNormalized) {
      return true;
    }
    

    if (airline.country === toCountryNormalized) {
      return true;
    }
    

    if (!isDomesticUSA) {

      if (airline.continent === fromContinent) {
        return true;
      }
      

      if (airline.continent === toContinent) {
        return true;
      }
      

      if (airline.continent === 'Middle East' && airline.premium) {
        const distance = calculateDistance(
          fromAirport.lat,
          fromAirport.lon,
          toAirport.lat,
          toAirport.lon
        );
        return distance > 3000;
      }
      

      if (fromContinent !== toContinent) {

        if ((fromContinent === 'Asia' || toContinent === 'Asia') && 
            airline.continent === 'Asia' && airline.premium) {
          return true;
        }
        

        if ((fromContinent === 'Europe' || toContinent === 'Europe') && 
            airline.continent === 'Europe' && airline.premium) {
          return true;
        }
      }
    }
    
    return false;
  });
  

  const finalAirlines = availableAirlines.length > 0 ? availableAirlines : commonAirlines;
  

  const nationalAirlines = finalAirlines.filter(airline => 
    airline.country === fromCountryNormalized || airline.country === toCountryNormalized
  );
  
  const otherAirlines = finalAirlines.filter(airline => 
    airline.country !== fromCountryNormalized && airline.country !== toCountryNormalized
  );
  

  const shuffledOtherAirlines = [...otherAirlines];
  for (let i = shuffledOtherAirlines.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffledOtherAirlines[i], shuffledOtherAirlines[j]] = [shuffledOtherAirlines[j], shuffledOtherAirlines[i]];
  }
  

  const prioritizedAirlines = [...nationalAirlines, ...shuffledOtherAirlines];
  

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
    

    // Apply trip type multiplier from admin config
    try {
      const adminConfig = loadPricingConfig();
      const tripTypeConfig = adminConfig.tripTypes.find(tt => tt.name === tripType);
      if (tripTypeConfig) {
        price = Math.round(price * tripTypeConfig.multiplier);
      } else {
        // Fallback to hardcoded values if not found in config
        if (tripType === 'Round Trip') {
          price = Math.round(price * 1.8);
        } else if (tripType === 'Multi-city') {
          price = Math.round(price * 1.5);
        }
      }
    } catch (error) {
      // Failed to load trip type multipliers from admin config, using defaults
      // Fallback to hardcoded values
      if (tripType === 'Round Trip') {
        price = Math.round(price * 1.8);
      } else if (tripType === 'Multi-city') {
        price = Math.round(price * 1.5);
      }
    }
    const amenities = getAmenities(airline.name, distance);
    

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
      seatsLeft: Math.floor(rng.random() * 8) + 8
    };


    if (tripType === 'Round Trip') {
      const returnStopsCount = calculateStops(distance, rng);
      const returnStopoverAirports = selectStopoverAirports(toAirport, fromAirport, returnStopsCount, airline.name, rng);
      const returnDuration = calculateDuration(distance, returnStopsCount, rng);
      const returnTimes = generateFlightTimes(returnDuration, rng);
      const returnAmenities = getAmenities(airline.name, distance);
      

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
  
  let finalFlights = filteredFlights.sort((a, b) => a.price - b.price).slice(0, 3);
  
  // If a specific flight was selected, ensure it's included in the results
  if (selectedFlight) {
    // Looking for selected flight

    // Normalize airline name (e.g., 'Qantas Airways' -> 'Qantas') for matching
    const normalizedAirlineName = (() => {
      switch (selectedFlight.airline) {
        case 'Qantas Airways':
          return 'Qantas';
        case 'SWISS':
        case 'Swiss':
          return 'Swiss International Air Lines';
        case 'JAL':
          return 'Japan Airlines';
        case 'ANA':
        case 'Nippon Airways':
        case 'All Nippon':
          return 'All Nippon Airways';
        case 'Qatar':
          return 'Qatar Airways';
        case 'Etihad':
          return 'Etihad Airways';
        default:
          return selectedFlight.airline;
      }
    })();

    const targetAirline = commonAirlines.find(airline => airline.name === normalizedAirlineName);
    if (targetAirline) {
      // Check if the selected flight is already in the results with more lenient criteria
      const existingFlight = finalFlights.find(f => {
        const priceMatch = Math.abs(f.price - selectedFlight.price) <= 100; // Increased tolerance
        const airlineMatch = f.airline === normalizedAirlineName;
        // More lenient duration matching - extract numbers and compare
        const extractHours = (duration: string) => {
          const match = duration.match(/(\d+)h/);
          return match ? parseInt(match[1]) : 0;
        };
        const durationMatch = Math.abs(extractHours(f.duration) - extractHours(selectedFlight.duration)) <= 2; // 2 hour tolerance
        
        // Checking existing flight
        
        return airlineMatch && priceMatch && durationMatch;
      });
      
      if (!existingFlight) {
        // Creating exact selected flight to ensure it appears in results
        // Create the selected flight with exact parameters
        const seed = createDailySeed(fromCode + normalizedAirlineName, toCode, flightClass);
        const rng = new SeededRandom(seed);
        
        const stopsCount = calculateStops(distance, rng);
        const stopoverAirports = selectStopoverAirports(fromAirport, toAirport, stopsCount, targetAirline.name, rng);
        const times = generateFlightTimes(selectedFlight.duration, rng);
        const amenities = getAmenities(targetAirline.name, distance);
        
        const arrivalDate = departureDate ? (() => {
          const depDate = new Date(departureDate + 'T00:00:00Z');
          depDate.setUTCDate(depDate.getUTCDate() + times.arrivalDateOffset);
          return depDate.toISOString().split('T')[0];
        })() : undefined;
        
        const selectedFlightObj: GeneratedFlight = {
          id: 999, // Special ID for selected flight
          airline: targetAirline.name,
          logo: getAirlineLogo(targetAirline.name),
          flightNumber: `${targetAirline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
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
          duration: selectedFlight.duration,
          stops: stopsCount,
          stopoverAirports,
          price: selectedFlight.price,
          class: flightClass,
          amenities,
          rating: targetAirline.rating,
          seatsLeft: Math.floor(rng.random() * 8) + 8
        };
        
        // Place the selected flight first and keep the original top-3 intact after it
        finalFlights = [selectedFlightObj, ...finalFlights];
        // Added selected flight as 1st result
      } else {
        // Move the existing matching flight to the first position
        finalFlights = [existingFlight, ...finalFlights.filter(f => f.id !== existingFlight.id)];
        // Selected flight already exists — moved to 1st position
      }
    } else {
      // Target airline not found
    }
  }
  
  // Generated flights

  return finalFlights;
}