import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Emirates Airlines - Fly Better | Fly Lux Sky',
  description: 'Experience luxury redefined with Emirates Airlines. Book flights with the world\'s largest passenger aircraft A380, enjoy onboard lounges, showers, and award-winning service.',
  keywords: 'Emirates Airlines, A380, luxury flights, Dubai hub, first class, business class, premium airline',
  openGraph: {
    title: 'Emirates Airlines - Fly Better | Fly Lux Sky',
    description: 'Experience luxury redefined with Emirates Airlines. Book flights with the world\'s largest passenger aircraft A380, enjoy onboard lounges, showers, and award-winning service.',
    type: 'website',
  },
};

export default function EmiratesAirlinesPage() {
  return <AirlinePage slug="emirates-airlines" />;
}