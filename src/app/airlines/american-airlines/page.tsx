import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'American Airlines - Going for Great | Fly Lux Sky',
  description: 'Fly with America\'s largest airline network. American Airlines connects you to more destinations with modern aircraft, premium amenities, and exceptional service.',
  keywords: 'American Airlines, largest network, AAdvantage, Flagship First, Flagship Business, Boeing 787',
  openGraph: {
    title: 'American Airlines - Going for Great | Fly Lux Sky',
    description: 'Fly with America\'s largest airline network. American Airlines connects you to more destinations with modern aircraft, premium amenities, and exceptional service.',
    type: 'website',
  },
};

export default function AmericanAirlinesPage() {
  return <AirlinePage slug="american-airlines" />;
}