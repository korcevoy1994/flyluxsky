import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Lufthansa Airlines - Nonstop You | Fly Lux Sky',
  description: 'Discover German precision and hospitality with Lufthansa. As Europe\'s largest airline, we connect you to the world with reliability, comfort, and exceptional service.',
  keywords: 'Lufthansa Airlines, German airline, Frankfurt hub, Munich hub, Star Alliance, European network',
  openGraph: {
    title: 'Lufthansa Airlines - Nonstop You | Fly Lux Sky',
    description: 'Discover German precision and hospitality with Lufthansa. As Europe\'s largest airline, we connect you to the world with reliability, comfort, and exceptional service.',
    type: 'website',
  },
};

export default function LufthansaAirlinesPage() {
  return <AirlinePage slug="lufthansa-airlines" />;
}