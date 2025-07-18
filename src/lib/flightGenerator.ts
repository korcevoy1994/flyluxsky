import airports from './airports.json';

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
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
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

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

interface GeneratedFlight {
  id: number;
  airline: string;
  logo: string;
  flightNumber: string;
  departure: { time: string; airport: string; city: string };
  arrival: { time: string; airport: string; city: string };
  duration: string;
  stops: number;
  price: number;
  class: string;
  amenities: string[];
  rating: number;
  aircraft: string;
  seatsLeft: number;
}

// Common airlines data for client-side usage
const commonAirlines = [
  { name: 'Emirates', iata: 'EK', rating: 4.8, country: 'UAE', premium: true },
  { name: 'Lufthansa', iata: 'LH', rating: 4.6, country: 'Germany', premium: false },
  { name: 'Turkish Airlines', iata: 'TK', rating: 4.7, country: 'Turkey', premium: false },
  { name: 'British Airways', iata: 'BA', rating: 4.5, country: 'UK', premium: false },
  { name: 'Air France', iata: 'AF', rating: 4.4, country: 'France', premium: false },
  { name: 'Singapore Airlines', iata: 'SQ', rating: 4.9, country: 'Singapore', premium: true },
  { name: 'Qatar Airways', iata: 'QR', rating: 4.8, country: 'Qatar', premium: true },
  { name: 'Etihad Airways', iata: 'EY', rating: 4.7, country: 'UAE', premium: true },
  { name: 'Swiss International Air Lines', iata: 'LX', rating: 4.6, country: 'Switzerland', premium: false },
  { name: 'KLM', iata: 'KL', rating: 4.5, country: 'Netherlands', premium: false }
];

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

// Calculate flight duration based on distance
function calculateDuration(distance: number, rng?: SeededRandom): string {
  // Calculate duration based on average aircraft speed of 850 km/h
  const averageSpeed = 850; // km/h
  const flightTimeHours = distance / averageSpeed;
  
  // Add taxi time and other delays (typically 30-60 minutes total)
  const randomValue = rng ? rng.random() : Math.random();
  const taxiAndDelayMinutes = 30 + randomValue * 30;
  const totalMinutes = Math.round(flightTimeHours * 60 + taxiAndDelayMinutes);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
}

// Calculate price based on distance, airline, class and other factors
function calculatePrice(distance: number, airlineName: string, flightClass: string, fromCountry?: string, toCountry?: string, rng?: SeededRandom): number {
  // Base price calculation with different rates for distance ranges
  let basePricePerKm;
  if (distance < 500) {
    basePricePerKm = 0.25; // Short-haul flights are more expensive per km
  } else if (distance < 2000) {
    basePricePerKm = 0.18; // Medium-haul
  } else if (distance < 5000) {
    basePricePerKm = 0.12; // Long-haul
  } else {
    basePricePerKm = 0.08; // Ultra long-haul
  }
  
  let basePrice = distance * basePricePerKm;
  
  // Find airline info
  const airline = commonAirlines.find(a => a.name === airlineName);
  
  // Premium airline surcharge
  if (airline?.premium) {
    basePrice *= 1.4;
  }
  
  // Class multipliers
  if (flightClass === 'First class') {
    basePrice *= 3.2;
  } else if (flightClass === 'Business class') {
    basePrice *= 2.1;
  } else if (flightClass === 'Premium economy') {
    basePrice *= 1.4;
  }
  
  // Add fuel surcharge and taxes (10-25% of base price)
  const randomValue1 = rng ? rng.random() : Math.random();
  const fuelAndTaxes = basePrice * (0.1 + randomValue1 * 0.15);
  basePrice += fuelAndTaxes;
  
  // Special pricing for flights from USA (popular international destinations)
  const isFromUSA = fromCountry === 'United States';
  const isInternational = fromCountry !== toCountry;
  
  // Apply USA international flight premium before market variation
  if (isFromUSA && isInternational) {
    const randomValue2 = rng ? rng.random() : Math.random();
    basePrice *= (1.8 + randomValue2 * 0.6); // 1.8x to 2.4x multiplier for USA international
  }
  
  // Random market variation (±20% for more price diversity)
  const randomValue3 = rng ? rng.random() : Math.random();
  const marketVariation = 0.8 + randomValue3 * 0.4;
  basePrice *= marketVariation;
  
  // Set minimum price thresholds
  let minimumPrice;
  if (isFromUSA && isInternational) {
    // Higher minimum prices for international flights from USA
    minimumPrice = flightClass === 'First class' ? 5000 : 
                   flightClass === 'Business class' ? 2000 : 
                   flightClass === 'Premium economy' ? 800 : 400;
  } else {
    // Standard minimum prices
    minimumPrice = flightClass === 'First class' ? 800 : 
                   flightClass === 'Business class' ? 400 : 
                   flightClass === 'Premium economy' ? 200 : 100;
  }
  
  return Math.round(Math.max(basePrice, minimumPrice));
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
    'KLM': '/logos/lufthansa.svg' // Fallback to lufthansa for missing logos
  };
  
  return logoMap[airlineName] || '/logos/emirates.svg';
}

// Get aircraft type based on distance
function getAircraftType(distance: number): string {
  if (distance < 1000) {
    return ['Airbus A320', 'Boeing 737-800', 'Embraer E190'][Math.floor(Math.random() * 3)];
  } else if (distance < 3000) {
    return ['Airbus A321', 'Boeing 737 MAX', 'Airbus A330'][Math.floor(Math.random() * 3)];
  } else {
    return ['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9'][Math.floor(Math.random() * 3)];
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
function generateFlightTimes(durationString: string, rng?: SeededRandom): { departure: string; arrival: string } {
  const randomValue1 = rng ? rng.random() : Math.random();
  const randomValue2 = rng ? rng.random() : Math.random();
  const departureHour = Math.floor(randomValue1 * 24);
  const departureMinute = Math.floor(randomValue2 * 4) * 15; // 0, 15, 30, 45
  
  const departure = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
  
  // Parse duration string (e.g., "7h 23m")
  const durationMatch = durationString.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) {
    return { departure, arrival: departure };
  }
  
  const durationHours = parseInt(durationMatch[1]);
  const durationMinutes = parseInt(durationMatch[2]);
  
  // Calculate arrival time by adding duration to departure
  const departureDate = new Date();
  departureDate.setHours(departureHour, departureMinute, 0, 0);
  
  const arrivalDate = new Date(departureDate.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000);
  
  const arrival = `${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`;
  
  return { departure, arrival };
}

// Main function to generate flights for client-side usage
function generateMultiCityFlightsFromSegments(segments: {from: string, to: string, date: string}[], flightClass: string): any[] {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  
  if (segments.length === 0) {
    return [];
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
      
      // Select airline for this segment
      const airlineIndex = (optionIndex + i) % commonAirlines.length;
      const airline = commonAirlines[airlineIndex];
      
      const duration = calculateDuration(distance, rng);
      const durationMinutes = parseInt(duration.split('h')[0]) * 60 + parseInt(duration.split('h')[1]?.split('m')[0] || '0');
      totalDurationMinutes += durationMinutes;
      
      const times = generateFlightTimes(duration, rng);
      const price = calculatePrice(distance, airline.name, flightClass, segmentFrom.country, segmentTo.country, rng);
      totalPrice += price;
      
      const amenities = getAmenities(airline.name, distance);
      const aircraft = getAircraftType(distance);
      
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
          date: segment.date
        },
        duration,
        stops: rng.random() > 0.8 ? 1 : 0,
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

function generateMultiCityFlights(fromCode: string, toCode: string, flightClass: string): any[] {
  const airportsMap = new Map(airports.map(a => [a.code, a]));
  const fromAirport = airportsMap.get(fromCode);
  const toAirport = airportsMap.get(toCode);
  
  if (!fromAirport || !toAirport) {
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
      
      // Select airline for this segment
      const airlineIndex = (optionIndex + i) % commonAirlines.length;
      const airline = commonAirlines[airlineIndex];
      
      const duration = calculateDuration(distance, rng);
      const durationMinutes = parseInt(duration.split('h')[0]) * 60 + parseInt(duration.split('h')[1]?.split('m')[0] || '0');
      totalDurationMinutes += durationMinutes;
      
      const times = generateFlightTimes(duration, rng);
      const price = calculatePrice(distance, airline.name, flightClass, segmentFrom.country, segmentTo.country, rng);
      totalPrice += price;
      
      const amenities = getAmenities(airline.name, distance);
      const aircraft = getAircraftType(distance);
      
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
        stops: rng.random() > 0.8 ? 1 : 0,
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

export function generateFlightsClient(fromCode: string, toCode: string, flightClass: string = 'Business class', tripType: string = 'One Way'): GeneratedFlight[] | any[] {
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
  
  // Create seeded random number generator for consistent daily prices
  const seed = createDailySeed(fromCode, toCode, flightClass);
  const rng = new SeededRandom(seed);
  
  const distance = calculateDistance(
    fromAirport.lat,
    fromAirport.lon,
    toAirport.lat,
    toAirport.lon
  );
  
  // Select airlines deterministically based on seed
  const shuffledAirlines = [...commonAirlines];
  for (let i = shuffledAirlines.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffledAirlines[i], shuffledAirlines[j]] = [shuffledAirlines[j], shuffledAirlines[i]];
  }
  const selectedAirlines = shuffledAirlines.slice(0, Math.min(5, commonAirlines.length));
  
  const flights = selectedAirlines.map((airline, index) => {
    const duration = calculateDuration(distance, rng);
    const times = generateFlightTimes(duration, rng);
    let price = calculatePrice(distance, airline.name, flightClass, fromAirport.country, toAirport.country, rng);
    
    // Adjust price based on trip type
    if (tripType === 'Round Trip') {
      price = Math.round(price * 1.8); // Round trip is typically 1.8x one way (not exactly 2x due to discounts)
    } else if (tripType === 'Multi-city') {
      price = Math.round(price * 1.5); // Multi-city pricing per segment
    }
    const amenities = getAmenities(airline.name, distance);
    const aircraft = getAircraftType(distance);
    
    return {
      id: index + 1,
      airline: airline.name,
      logo: getAirlineLogo(airline.name),
      flightNumber: `${airline.iata} ${Math.floor(rng.random() * 9000) + 1000}`,
      departure: {
        time: times.departure,
        airport: fromCode,
        city: fromAirport.city
      },
      arrival: {
        time: times.arrival,
        airport: toCode,
        city: toAirport.city
      },
      duration,
      stops: rng.random() > 0.7 ? 1 : 0, // 30% chance of 1 stop
      price,
      class: flightClass,
      amenities,
      rating: airline.rating,
      aircraft,
      seatsLeft: Math.floor(rng.random() * 8) + 8 // Random seats left between 8-15
    };
  });
  
  // Sort by price (cheapest first) and limit to 3 flights
  return flights.sort((a, b) => a.price - b.price).slice(0, 3);
}