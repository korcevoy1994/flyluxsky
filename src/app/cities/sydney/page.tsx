import type { Metadata } from 'next'
import CityPage from '@/components/city-page'

export const metadata: Metadata = {
  title: 'Sydney Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Australia. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function SydneyPage() {
  return <CityPage slug="sydney" />
}