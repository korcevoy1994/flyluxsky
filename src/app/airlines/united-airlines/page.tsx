import AirlinePage from '@/components/airline-page';

export default function UnitedAirlinesPage() {
  return <AirlinePage slug="united-airlines" />;
}

export async function generateMetadata() {
  return {
    title: 'United Airlines - Premium Flight Booking | FlyLuxSky',
    description: 'Connect to more destinations across the globe with United Airlines. Experience friendly service and modern amenities.',
    keywords: 'United Airlines, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'United Airlines - Premium Flight Booking',
      description: 'Connect to more destinations across the globe with United Airlines. Experience friendly service and modern amenities.',
      type: 'website',
    },
  };
}