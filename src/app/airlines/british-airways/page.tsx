import AirlinePage from '@/components/airline-page';
import { notFound } from 'next/navigation';

export default function BritishAirwaysPage() {
  return <AirlinePage slug="british-airways" />;
}

export async function generateMetadata() {
  return {
    title: 'British Airways - Premium Flight Booking | FlyLuxSky',
    description: 'Experience British elegance and service excellence. British Airways connects you to the world with style and sophistication.',
    keywords: 'British Airways, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'British Airways - Premium Flight Booking',
      description: 'Experience British elegance and service excellence. British Airways connects you to the world with style and sophistication.',
      type: 'website',
    },
  };
}