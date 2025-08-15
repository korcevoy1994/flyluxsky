import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Singapore Airlines - A Great Way to Fly | Fly Lux Sky',
  description: 'Experience world-class service and innovation with Singapore Airlines. From award-winning cabin crew to cutting-edge aircraft, we set the standard for premium air travel.',
  keywords: 'Singapore Airlines, A380, A350, Changi Airport, Singapore Girl, premium airline, business class',
  openGraph: {
    title: 'Singapore Airlines - A Great Way to Fly | Fly Lux Sky',
    description: 'Experience world-class service and innovation with Singapore Airlines. From award-winning cabin crew to cutting-edge aircraft, we set the standard for premium air travel.',
    type: 'website',
  },
};

export default function SingaporeAirlinesPage() {
  return <AirlinePage slug="singapore-airlines" />;
}