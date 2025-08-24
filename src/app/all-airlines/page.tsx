import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'All Airlines - Business Class Flights | FlyLuxSky',
  description: 'Discover premium business class flights with top airlines worldwide. Compare prices and book luxury travel with Singapore Airlines, Emirates, Lufthansa and more.',
  keywords: 'business class flights, premium airlines, luxury travel, Singapore Airlines, Emirates, Lufthansa, Qatar Airways',
};

const airlines = [
  {
    name: 'Singapore Airlines',
    slug: 'singapore-airlines',
    logo: '/logos/airlines/Singapore Airlines.svg',
    description: 'Experience world-class service and luxury with Singapore Airlines business class flights.',
    destinations: ['London', 'Tokyo', 'Sydney', 'New York'],
    rating: 5.0
  },
  {
    name: 'Emirates Airlines',
    slug: 'emirates-airlines',
    logo: '/logos/airlines/Emirates.svg',
    description: 'Fly in comfort and style with Emirates premium business class service.',
    destinations: ['Dubai', 'London', 'New York', 'Sydney'],
    rating: 4.9
  },
  {
    name: 'Lufthansa Airlines',
    slug: 'lufthansa-airlines',
    logo: '/logos/airlines/Lufthansa.svg',
    description: 'Discover European excellence with Lufthansa business class flights.',
    destinations: ['Frankfurt', 'Munich', 'London', 'New York'],
    rating: 4.8
  },
  {
    name: 'Qatar Airways',
    slug: 'qatar-airways',
    logo: '/logos/airlines/Qatar Airways.svg',
    description: 'Experience award-winning service with Qatar Airways business class.',
    destinations: ['Doha', 'London', 'New York', 'Singapore'],
    rating: 4.9
  },
  {
    name: 'Etihad Airlines',
    slug: 'etihad-airlines',
    logo: '/logos/airlines/EtihadAirways.svg',
    description: 'Luxury redefined with Etihad Airways premium business class experience.',
    destinations: ['Abu Dhabi', 'London', 'New York', 'Sydney'],
    rating: 4.7
  },
  {
    name: 'British Airways',
    slug: 'british-airways',
    logo: '/logos/airlines/British Airways.svg',
    description: 'Fly with Britain\'s flag carrier in premium business class comfort.',
    destinations: ['London', 'New York', 'Dubai', 'Singapore'],
    rating: 4.6
  },
  {
    name: 'American Airlines',
    slug: 'american-airlines',
    logo: '/logos/airlines/American Airlines.svg',
    description: 'Experience premium travel across America and beyond.',
    destinations: ['New York', 'Los Angeles', 'London', 'Tokyo'],
    rating: 4.5
  },
  {
    name: 'United Airlines',
    slug: 'united-airlines',
    logo: '/logos/airlines/United Airlines.svg',
    description: 'Fly United business class for premium comfort and service.',
    destinations: ['New York', 'San Francisco', 'London', 'Tokyo'],
    rating: 4.4
  },
  {
    name: 'Turkish Airlines',
    slug: 'turkish-airlines',
    logo: '/logos/airlines/Turkish Airlines.svg',
    description: 'Connect the world with Turkish Airlines business class flights.',
    destinations: ['Istanbul', 'London', 'New York', 'Dubai'],
    rating: 4.6
  },
  {
    name: 'Swiss Airlines',
    slug: 'swiss-airlines',
    logo: '/logos/airlines/Swiss International Air Lines.svg',
    description: 'Experience Swiss precision and comfort in business class.',
    destinations: ['Zurich', 'Geneva', 'London', 'New York'],
    rating: 4.7
  },
  {
    name: 'Air France',
    slug: 'air-france',
    logo: '/logos/airlines/Air France.svg',
    description: 'Discover French elegance with Air France business class service.',
    destinations: ['Paris', 'London', 'New York', 'Tokyo'],
    rating: 4.5
  },
  {
    name: 'Qantas Airways',
    slug: 'qantas-airways',
    logo: '/logos/airlines/Qantas.svg',
    description: 'Experience the spirit of Australia with Qantas business class.',
    destinations: ['Sydney', 'Melbourne', 'London', 'Los Angeles'],
    rating: 4.6
  },
  {
    name: 'Nippon Airways',
    slug: 'nippon-airways',
    logo: '/logos/airlines/All Nippon Airways.svg',
    description: 'Discover Japanese hospitality with ANA business class flights.',
    destinations: ['Tokyo', 'Osaka', 'London', 'New York'],
    rating: 4.8
  },
  {
    name: 'Iberia Airlines',
    slug: 'iberia-airlines',
    logo: '/logos/airlines/Iberia (airline).svg',
    description: 'Experience Spanish warmth with Iberia business class service.',
    destinations: ['Madrid', 'Barcelona', 'London', 'New York'],
    rating: 4.4
  }
];

const AirlineCard = ({ airline }: { airline: typeof airlines[0] }) => {
  return (
    <Link href={`/airlines/${airline.slug}`} className="group h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#0ABAB5]/20 h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 mb-4">
            <Image
              src={airline.logo}
              alt={`${airline.name} logo`}
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
          
          {/* Airline Name */}
          <h3 className="text-xl font-semibold text-[#0D2B29] text-center mb-3 group-hover:text-[#0ABAB5] transition-colors">
            {airline.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
            {airline.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(airline.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-1">{airline.rating}</span>
            </div>
          </div>
          
          {/* Popular Destinations */}
          <div className="text-center mt-auto">
            <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-1">
              {airline.destinations.slice(0, 3).map((dest, index) => (
                <span key={dest} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {dest}
                </span>
              ))}
              {airline.destinations.length > 3 && (
                <span className="text-xs text-gray-500">+{airline.destinations.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gray-50 px-6 py-4 group-hover:bg-[#0ABAB5]/5 transition-colors">
          <div className="text-center">
            <span className="text-sm font-medium text-[#0ABAB5] group-hover:text-[#0D2B29] transition-colors">
              View Airline →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function AllAirlinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
       <div className="bg-[#0ABAB5] px-4 sm:px-6 lg:px-8 py-4">
         <Navbar isDarkBackground={true} />
       </div>
      
      {/* Hero Section */}
      <section className="bg-[#0ABAB5] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Premium Airlines
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover world-class business class flights with top airlines. 
            Experience luxury, comfort, and exceptional service.
          </p>
        </div>
      </section>

      {/* Airlines Grid */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D2B29] mb-4">
              Choose Your Preferred Airline
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our selection of premium airlines offering business class flights 
              to destinations worldwide. Each airline provides unique amenities and services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {airlines.map((airline) => (
              <AirlineCard key={airline.slug} airline={airline} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0D2B29] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Book Your Business Class Flight?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact our travel experts to find the best deals and customize your luxury travel experience.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#0ABAB5] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0ABAB5]/90 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}