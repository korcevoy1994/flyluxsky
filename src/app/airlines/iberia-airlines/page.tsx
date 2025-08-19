import AirlinePage from '@/components/airline-page';

export default function IberiaAirlinesPage() {
  return <AirlinePage slug="iberia-airlines" />;
}

export async function generateMetadata() {
  return {
    title: 'Iberia Airlines - Premium Flight Booking | FlyLuxSky',
    description: 'Discover Spain and beyond with Iberia Airlines. Experience Spanish warmth and hospitality on every journey.',
    keywords: 'Iberia Airlines, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'Iberia Airlines - Premium Flight Booking',
      description: 'Discover Spain and beyond with Iberia Airlines. Experience Spanish warmth and hospitality on every journey.',
      type: 'website',
    },
  };
}