import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface City {
  name: string;
  code: string;
  country: string;
}

export const cities: City[] = [
  { name: 'Los Angeles', code: 'LAX', country: 'USA' },
  { name: 'New York', code: 'JFK', country: 'USA' },
  { name: 'London', code: 'LHR', country: 'UK' },
  { name: 'Paris', code: 'CDG', country: 'France' },
  { name: 'Tokyo', code: 'NRT', country: 'Japan' },
  { name: 'Dubai', code: 'DXB', country: 'UAE' },
  { name: 'Singapore', code: 'SIN', country: 'Singapore' },
  { name: 'Sydney', code: 'SYD', country: 'Australia' },
  { name: 'Frankfurt', code: 'FRA', country: 'Germany' },
  { name: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
  { name: 'Hong Kong', code: 'HKG', country: 'Hong Kong' },
  { name: 'Bangkok', code: 'BKK', country: 'Thailand' },
  { name: 'Istanbul', code: 'IST', country: 'Turkey' },
  { name: 'Mumbai', code: 'BOM', country: 'India' },
  { name: 'São Paulo', code: 'GRU', country: 'Brazil' },
  { name: 'Toronto', code: 'YYZ', country: 'Canada' },
  { name: 'Moscow', code: 'SVO', country: 'Russia' },
  { name: 'Beijing', code: 'PEK', country: 'China' },
  { name: 'Seoul', code: 'ICN', country: 'South Korea' },
  { name: 'Cairo', code: 'CAI', country: 'Egypt' },
  { name: 'Mexico City', code: 'MEX', country: 'Mexico' },
  { name: 'Buenos Aires', code: 'EZE', country: 'Argentina' },
  { name: 'Johannesburg', code: 'JNB', country: 'South Africa' },
  { name: 'Madrid', code: 'MAD', country: 'Spain' },
  { name: 'Rome', code: 'FCO', country: 'Italy' },
  { name: 'Vienna', code: 'VIE', country: 'Austria' },
  { name: 'Zurich', code: 'ZUR', country: 'Switzerland' },
  { name: 'Copenhagen', code: 'CPH', country: 'Denmark' },
  { name: 'Stockholm', code: 'ARN', country: 'Sweden' },
  { name: 'Oslo', code: 'OSL', country: 'Norway' },
];
