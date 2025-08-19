import type { Metadata } from 'next'
import CityPage from '@/components/city-page'

export const metadata: Metadata = {
  title: 'Tokyo Business & First Class Flights | FlyLuxSky',
  description:
    'Discover the best First & Business Class travel deals to Japan. Enjoy spacious seating, priority boarding, and excellent service with Fly Lux Sky.',
}

export default function TokyoPage() {
  return <CityPage slug="tokyo" />
}