import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'Spain Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Spain. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function SpainPage() {
  return <CountryPage slug="spain" />
}