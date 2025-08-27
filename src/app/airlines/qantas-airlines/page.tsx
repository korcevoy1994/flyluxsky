import AirlinePage from '@/components/airline-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qantas Airways Business Class Flights | FlyLuxSky',
  description: 'Book Qantas Airways business class flights with FlyLuxSky. Experience the spirit of Australia with premium service and comfort.',
  keywords: 'Qantas, Airways, business class, premium flights, Australian airline',
  openGraph: {
    title: 'Qantas Airways Business Class | FlyLuxSky',
    description: 'Experience the spirit of Australia with Qantas Airways business class flights.',
  },
};

export default function QantasAirwaysPage() {
  return <AirlinePage slug="qantas-airlines" />;
}