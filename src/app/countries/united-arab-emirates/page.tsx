import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'United Arab Emirates Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to the United Arab Emirates. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function UAEPage() {
  return <CountryPage slug="united-arab-emirates" />
}