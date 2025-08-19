import AirlinePage from '@/components/airline-page';

export default function EtihadAirlinesPage() {
  return <AirlinePage slug="etihad-airlines" />;
}

export async function generateMetadata() {
  return {
    title: 'Etihad Airlines - Premium Flight Booking | FlyLuxSky',
    description: 'Experience Arabian hospitality with Etihad Airlines. Luxury, comfort, and service excellence from the heart of the UAE.',
    keywords: 'Etihad Airlines, flights, booking, premium travel, business class, first class',
    openGraph: {
      title: 'Etihad Airlines - Premium Flight Booking',
      description: 'Experience Arabian hospitality with Etihad Airlines. Luxury, comfort, and service excellence from the heart of the UAE.',
      type: 'website',
    },
  };
}