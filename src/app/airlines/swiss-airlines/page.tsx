import AirlinePage from '@/components/airline-page';

export default function SwissAirlinesPage() {
  return <AirlinePage slug="swiss-airlines" />;
}

export async function generateMetadata() {
  return {
    title: 'Swiss Airlines - Premium Flight Booking | FlyLuxSky',
    description: 'Experience Swiss precision and quality with Swiss Airlines. Connecting you to the world with reliability and comfort.',
    keywords: 'Swiss Airlines, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'Swiss Airlines - Premium Flight Booking',
      description: 'Experience Swiss precision and quality with Swiss Airlines. Connecting you to the world with reliability and comfort.',
      type: 'website',
    },
  };
}