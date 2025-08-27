import AirlinePage from '@/components/airline-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'British Airways Business Class Flights | FlyLuxSky',
  description: 'Book British Airways business class flights with FlyLuxSky. Experience British elegance and premium service on your journey.',
  keywords: 'British Airways, business class, premium flights, UK airline',
  openGraph: {
    title: 'British Airways Business Class | FlyLuxSky',
    description: 'Experience British elegance with British Airways business class flights.',
  },
};

export default function BritishAirwaysPage() {
  return <AirlinePage slug="british-airlines" />;
}