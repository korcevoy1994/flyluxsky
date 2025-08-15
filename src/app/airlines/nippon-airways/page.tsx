import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Nippon Airways (ANA) - Inspiration of Japan | Fly Lux Sky',
  description: 'Experience Japanese hospitality and precision with ANA. Discover the art of omotenashi service while flying on one of the world\'s most punctual and reliable airlines.',
  keywords: 'ANA, Nippon Airways, Japanese airline, omotenashi, punctuality, Boeing 787, Japanese hospitality',
  openGraph: {
    title: 'Nippon Airways (ANA) - Inspiration of Japan | Fly Lux Sky',
    description: 'Experience Japanese hospitality and precision with ANA. Discover the art of omotenashi service while flying on one of the world\'s most punctual and reliable airlines.',
    type: 'website',
  },
};

export default function NipponAirwaysPage() {
  return <AirlinePage slug="nippon-airways" />;
}