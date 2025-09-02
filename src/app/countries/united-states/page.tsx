import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'United States Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to the United States. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function UnitedStatesPage() {
  return <CountryPage slug="united-states" />
}