"use client"

import BestDealsSection from "@/components/best-deals-section";
import BookTripSection from "@/components/book-trip-section";
import CarouselDeals from "@/components/carousel-deals";
import FaqSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import { HeroLogosSection } from "@/components/hero-logos-section";
import NewsletterSection from "@/components/newsletter-section";
import TestimonialsSection from "@/components/testimonials-section";
import { useEffect, useState } from "react";
import { getNearbyAirports, Airport } from "@/lib/utils";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);

  useEffect(() => {
    const fetchLocationAndAirport = async () => {
      try {
        // Switched to a more robust IP geolocation service
        const response = await fetch('/api/geolocation');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const currentCoords = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          setCoords(currentCoords);
          const nearby = getNearbyAirports(currentCoords.latitude, currentCoords.longitude, 1);
          if (nearby.length > 0) {
            setNearestAirport(nearby[0]);
          }
        } else {
          console.error("Failed to get location from IP API:", data.error ? data.reason : "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching IP geolocation:", error);
      }
    };

    fetchLocationAndAirport();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection coords={coords} initialFromAirport={nearestAirport} />
      <CarouselDeals />
      <div className="w-full max-w-[1280px] mx-auto px-2">
        <BookTripSection />
      </div>
      <HeroLogosSection />
      <BestDealsSection />
      <div className="w-full max-w-[1280px] mx-auto px-2">
        <FaqSection />
      </div>
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
