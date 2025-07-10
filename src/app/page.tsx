import BestDealsSection from "@/components/best-deals-section";
import BookTripSection from "@/components/book-trip-section";
import CarouselDeals from "@/components/carousel-deals";
import FaqSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import { HeroLogosSection } from "@/components/hero-logos-section";
import NewsletterSection from "@/components/newsletter-section";
import TestimonialsSection from "@/components/testimonials-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
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
