import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'Italy Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Italy. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function ItalyPage() {
  return <CountryPage slug="italy" />
}