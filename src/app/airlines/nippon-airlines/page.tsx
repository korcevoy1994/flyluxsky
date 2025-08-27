import AirlinePage from '@/components/airline-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ANA All Nippon Airlines Business Class Flights | FlyLuxSky',
  description: 'Book ANA All Nippon Airlines business class flights with FlyLuxSky. Experience Japanese hospitality and premium service on your next journey.',
  keywords: 'ANA, All Nippon Airlines, business class, premium flights, Japanese airline',
  openGraph: {
    title: 'ANA All Nippon Airlines Business Class | FlyLuxSky',
    description: 'Experience Japanese hospitality with ANA All Nippon Airlines business class flights.',
  },
};

export default function NipponAirwaysPage() {
  return <AirlinePage slug="nippon-airlines" />;
}