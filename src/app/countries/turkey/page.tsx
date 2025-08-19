import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'Turkey Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Turkey. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function TurkeyPage() {
  return <CountryPage slug="turkey" />
}