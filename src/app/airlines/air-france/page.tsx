import AirlinePage from '@/components/airline-page';

export default function AirFrancePage() {
  return <AirlinePage slug="air-france" />;
}

export async function generateMetadata() {
  return {
    title: 'Air France - Premium Flight Booking | FlyLuxSky',
    description: 'Experience French elegance and sophistication with Air France. Discover the world with style and exceptional service.',
    keywords: 'Air France, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'Air France - Premium Flight Booking',
      description: 'Experience French elegance and sophistication with Air France. Discover the world with style and exceptional service.',
      type: 'website',
    },
  };
}