import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import airports from './airports.json';
import metropolis from './metropolis.json';
import Fuse from 'fuse.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { airports };

// Types for airports
export interface Airport {
  name: string;
  code: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

// Interface for grouped results
export interface GroupedSearchResult {
  type: 'city' | 'airport';
  id: string;
  name: string;
  code?: string;
  city?: string;
  country: string;
  countryCode?: string;
  airports?: Airport[];
  lat?: number;
  lon?: number;
}

const allSearchableItems = [
  ...airports,
  ...metropolis.map(m => ({
    ...m,
    isMetropolis: true,
    city: m.name,
    country: airports.find(a => a.code === m.airports[0])?.country || '',
    countryCode: airports.find(a => a.code === m.airports[0])?.countryCode || ''
  }))
];

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.4,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'city', weight: 0.6 },
    { name: 'code', weight: 0.9 },
    { name: 'country', weight: 0.5 },
    { name: 'countryCode', weight: 0.8 }
  ]
};

const fuse = new Fuse(allSearchableItems, fuseOptions);

// Function for grouped airport search
export function searchAirportsGrouped(query: string, limit = 10): GroupedSearchResult[] {
  if (!query || query.length < 2) return [];

  const fuseResults = fuse.search(query, { limit: 20 });
  const cityGroups = new Map<string, Airport[]>();
  const metropolisResults: GroupedSearchResult[] = [];
  const metropolisCityNames = new Set<string>();

  // First, process and collect all metropolis results
  fuseResults.forEach(result => {
    const item = result.item as Airport & { isMetropolis?: boolean; airports?: string[] };
    if (item.isMetropolis) {
      if (!metropolisCityNames.has(item.name)) {
        metropolisResults.push({
          type: 'city',
          id: `metropolis-${item.code}`,
          name: item.name,
          country: item.country,
          airports: item.airports!.map((code: string) => airports.find(a => a.code === code)).filter(Boolean) as Airport[],
        });
        metropolisCityNames.add(item.name);
      }
    }
  });

  // Then, process all airport results, excluding those in metropolis cities.
  fuseResults.forEach(result => {
    const item = result.item as Airport & { isMetropolis?: boolean };
    if (!item.isMetropolis) {
      const airport = item;
      if (!metropolisCityNames.has(airport.city)) {
        const cityKey = `${airport.city}, ${airport.country}`;
        if (!cityGroups.has(cityKey)) {
          cityGroups.set(cityKey, []);
        }
        cityGroups.get(cityKey)!.push(airport);
      }
    }
  });

  const results: GroupedSearchResult[] = [...metropolisResults];
  
  // Sort cities by relevance
  const sortedCities = Array.from(cityGroups.entries()).sort(([, airportsA], [, airportsB]) => {
    return airportsB.length - airportsA.length;
  });
  
  // Add cities with airports
  for (const [cityName, cityAirports] of sortedCities) {
    if (results.length >= limit) break;
    
    const firstAirport = cityAirports[0];
    
    if (cityAirports.length > 1) {
      results.push({
        type: 'city',
        id: `city-${cityName}`,
        name: firstAirport.city,
        country: firstAirport.country,
        countryCode: firstAirport.countryCode,
        airports: cityAirports,
      })
    } else {
      results.push({
        type: 'airport',
        id: `airport-${firstAirport.code}`,
        name: firstAirport.name,
        code: firstAirport.code,
        city: firstAirport.city,
        country: firstAirport.country,
        countryCode: firstAirport.countryCode,
        lat: firstAirport.lat,
        lon: firstAirport.lon,
      })
    }
  }
  
  return results.slice(0, limit);
}

// Get popular airports
export function getPopularAirports(limit = 20): Airport[] {
  const popularCodes = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'NRT', 'SIN', 'FRA', 'AMS', 'ICN', 'BKK', 'HND', 'BCN', 'MAD', 'FCO'];
  
  return airports
    .filter(airport => popularCodes.includes(airport.code))
    .sort((a, b) => popularCodes.indexOf(a.code) - popularCodes.indexOf(b.code))
    .slice(0, limit);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export function getNearbyAirports(lat: number, lon: number, limit = 5): Airport[] {
  return airports
    .map(airport => ({
      ...airport,
      distance: getDistance(lat, lon, airport.lat, airport.lon)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, waitFor: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as T;
}

export function formatAirportName(name: string): string {
  return name.replace(/\s+(Airport|International|Intl)\s*$/i, '').trim();
}

// Interface for city-only search results
export interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
}

// Function for searching cities only (without airports)
export function searchCitiesOnly(query: string, limit = 10): CitySearchResult[] {
  if (!query || query.length < 2) return [];

  const fuseResults = fuse.search(query, { limit: 30 });
  const citySet = new Set<string>();
  const results: CitySearchResult[] = [];

  // Process metropolis cities first
  fuseResults.forEach(result => {
    const item = result.item as Airport & { isMetropolis?: boolean; airports?: string[] };
    if (item.isMetropolis && !citySet.has(item.name)) {
      citySet.add(item.name);
      results.push({
        id: `metropolis-${item.code}`,
        name: item.name,
        country: item.country,
        countryCode: item.countryCode,
      });
    }
  });

  // Then process regular cities from airports
  fuseResults.forEach(result => {
    const item = result.item as Airport & { isMetropolis?: boolean };
    if (!item.isMetropolis) {
      const cityKey = `${item.city}, ${item.country}`;
      if (!citySet.has(cityKey)) {
        citySet.add(cityKey);
        results.push({
          id: `city-${item.city}-${item.countryCode}`,
          name: item.city,
          country: item.country,
          countryCode: item.countryCode,
          lat: item.lat,
          lon: item.lon,
        });
      }
    }
  });

  return results.slice(0, limit);
}
