import type { Metadata } from 'next'
import CountryPage from '@/components/country-page'

export const metadata: Metadata = {
  title: 'United Kingdom Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to the United Kingdom. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function UKPage() {
  return <CountryPage slug="united-kingdom" />
}