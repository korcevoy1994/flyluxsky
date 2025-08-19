import AirlinePage from '@/components/airline-page';

export default function QatarAirwaysPage() {
  return <AirlinePage slug="qatar-airways" />;
}

export async function generateMetadata() {
  return {
    title: 'Qatar Airways - Premium Flight Booking | FlyLuxSky',
    description: 'Experience world-class service with Qatar Airways. Award-winning airline connecting you to over 160 destinations worldwide.',
    keywords: 'Qatar Airways, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'Qatar Airways - Premium Flight Booking',
      description: 'Experience world-class service with Qatar Airways. Award-winning airline connecting you to over 160 destinations worldwide.',
      type: 'website',
    },
  };
}