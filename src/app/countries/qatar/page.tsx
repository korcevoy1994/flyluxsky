import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'Qatar Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Qatar. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function QatarPage() {
  return <CountryPage slug="qatar" />
}