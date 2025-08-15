import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'Greece Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Greece. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function GreecePage() {
  return <CountryPage slug="greece" />
}