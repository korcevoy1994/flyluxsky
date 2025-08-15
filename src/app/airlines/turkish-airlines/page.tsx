import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Turkish Airlines - Widen Your World | Fly Lux Sky',
  description: 'Discover the bridge between continents with Turkish Airlines. Experience Turkish hospitality while connecting to more countries than any other airline in the world.',
  keywords: 'Turkish Airlines, Istanbul hub, most destinations, Turkish hospitality, bridge between continents',
  openGraph: {
    title: 'Turkish Airlines - Widen Your World | Fly Lux Sky',
    description: 'Discover the bridge between continents with Turkish Airlines. Experience Turkish hospitality while connecting to more countries than any other airline in the world.',
    type: 'website',
  },
};

export default function TurkishAirlinesPage() {
  return <AirlinePage slug="turkish-airlines" />;
}