import AirlinePage from '@/components/airline-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qatar Airways Business Class Flights | FlyLuxSky',
  description: 'Book Qatar Airways business class flights with FlyLuxSky. Experience world-class service and luxury on your journey.',
  keywords: 'Qatar Airways, business class, premium flights, Middle East airline',
  openGraph: {
    title: 'Qatar Airways Business Class | FlyLuxSky',
    description: 'Experience world-class service with Qatar Airways business class flights.',
  },
};

export default function QatarAirwaysPage() {
  return <AirlinePage slug="qatar-airlines" />;
}