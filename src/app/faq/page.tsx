import type { Metadata } from 'next';
import FaqSection from "@/components/faq-section";
import Navbar from "@/components/navbar";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <section className="relative w-full bg-[#0ABAB5]">
        <div className="absolute inset-0 -z-10 bg-[#0ABAB5]" />
        <Navbar isDarkBackground={true} />
        
        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="text-white text-center">
            <h1 className="font-poppins font-bold text-[34px] md:text-[50px] leading-[1.5] capitalize">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-[16px] leading-[1.5] max-w-[600px] mx-auto">
              Everything You Need to Know Before You Fly
            </p>
          </div>
        </div>
      </section>
      
      <div className="w-full max-w-[1280px] mx-auto px-2 py-12">
        <FaqSection />
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | FlyLuxSky',
  description:
    'Find answers about booking, changes, baggage, refunds, and more. Explore common questions to plan your business-class trip with confidence.',
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I book a flight?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can book a flight by using our search form on the homepage. Enter your departure and destination cities, select your travel dates, and choose your preferred class of service."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit cards including Visa, Mastercard, American Express, and Discover."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel or modify my booking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can cancel or modify your booking subject to the airline's terms and conditions. Additional fees may apply depending on the fare type and timing of changes."
      }
    }
  ]
}