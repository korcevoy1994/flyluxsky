import { Metadata } from 'next';
import AirlinePage from '@/components/airline-page';

export const metadata: Metadata = {
  title: 'Qantas Airways - Spirit of Australia | Fly Lux Sky',
  description: 'Fly with Australia\'s flag carrier and experience the spirit of the land down under. Qantas combines safety excellence with warm Australian hospitality on every journey.',
  keywords: 'Qantas Airways, Australian airline, safety excellence, Australian spirit, Pacific network, A380',
  openGraph: {
    title: 'Qantas Airways - Spirit of Australia | Fly Lux Sky',
    description: 'Fly with Australia\'s flag carrier and experience the spirit of the land down under. Qantas combines safety excellence with warm Australian hospitality on every journey.',
    type: 'website',
  },
};

export default function QantasAirwaysPage() {
  return <AirlinePage slug="qantas-airways" />;
}