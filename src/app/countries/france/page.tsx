import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'France Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to France. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function FrancePage() {
  return <CountryPage slug="france" />
}