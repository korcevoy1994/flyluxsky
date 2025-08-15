'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import FlightSearchForm from '@/components/flight-search-form';
import FlightSearchFormMobile from '@/components/flight-search-form-mobile';
import StickySearchInput from '@/components/sticky-search-input';
import SearchModal from '@/components/search-modal';
import { getNearbyAirports, Airport } from '@/lib/utils';
import { type Coordinates } from '@/app/page';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { loadAirlinesContent, type AirlineContent as AdminAirlineContent } from '@/lib/airlinesAdmin';
import AirlineDealsSection from '@/components/airline-deals-section';

interface AirlinePageProps {
  slug: string;
}

interface AirlineContent {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  ctaTitle: string;
  ctaText: string;
  features: {
    title: string;
    description: string;
  }[];
  routes: {
    from: string;
    to: string;
    duration: string;
    aircraft: string;
  }[];
  classes: {
    name: string;
    description: string;
    features: string[];
  }[];
}

const AIRLINE_CONTENT: Record<string, AirlineContent> = {
  'emirates-airlines': {
    title: 'Emirates Airlines',
    subtitle: 'Fly Better',
    description: 'Experience luxury redefined with Emirates. From our iconic A380 to world-class service, discover why Emirates is the choice of discerning travelers worldwide.',
    heroImage: '/images/emirates-hero.jpg',
    introTitle: 'Luxury Aviation at Its Finest',
    introText: 'Emirates has redefined air travel with unparalleled luxury, cutting-edge technology, and exceptional service. From our spacious cabins to gourmet dining and award-winning entertainment, every journey with Emirates is an experience to remember.',
    ctaTitle: 'Book Your Emirates Flight Today',
    ctaText: 'Join millions of satisfied passengers who choose Emirates for their business and first-class travel. Experience the difference that true luxury makes.',
    features: [
      {
        title: 'Iconic A380 Fleet',
        description: 'Experience the world\'s largest passenger aircraft with onboard lounges, showers, and spacious cabins.'
      },
      {
        title: 'Dubai Hub Connectivity',
        description: 'Connect to over 150 destinations worldwide through our state-of-the-art Dubai International hub.'
      },
      {
        title: 'Award-Winning Service',
        description: 'Our cabin crew delivers personalized service that has earned Emirates numerous international awards.'
      }
    ],
    routes: [
      { from: 'London', to: 'Dubai', duration: '7h 10m', aircraft: 'A380' },
      { from: 'New York', to: 'Dubai', duration: '12h 30m', aircraft: 'B777' },
      { from: 'Dubai', to: 'Tokyo', duration: '8h 35m', aircraft: 'A380' },
      { from: 'Dubai', to: 'Sydney', duration: '14h 25m', aircraft: 'A380' }
    ],
    classes: [
      {
        name: 'First Class',
        description: 'Private suites with shower spa, fine dining, and chauffeur service',
        features: ['Private suite with sliding doors', 'Onboard shower spa', 'Chauffeur drive service', 'Gourmet dining']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats, premium dining, and priority boarding',
        features: ['Lie-flat seats', 'Premium dining', 'Priority boarding', 'Lounge access']
      }
    ]
  },
  'singapore-airlines': {
    title: 'Singapore Airlines',
    subtitle: 'A Great Way to Fly',
    description: 'Experience world-class service and innovation with Singapore Airlines. From our award-winning cabin crew to cutting-edge aircraft, we set the standard for premium air travel.',
    heroImage: '/images/singapore-hero.jpg',
    introTitle: 'Excellence in Every Journey',
    introText: 'Singapore Airlines has been synonymous with exceptional service and innovation for decades. Our commitment to excellence extends from our modern fleet to our world-renowned Singapore Girl service, ensuring every flight is a memorable experience.',
    ctaTitle: 'Discover Singapore Airlines Excellence',
    ctaText: 'Experience the airline that consistently ranks among the world\'s best. Book your premium journey with Singapore Airlines today.',
    features: [
      {
        title: 'Award-Winning Service',
        description: 'Our Singapore Girl cabin crew delivers legendary service that has won countless international awards.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on the latest aircraft including A380 and A350 with state-of-the-art amenities and comfort.'
      },
      {
        title: 'Changi Hub',
        description: 'Connect through Singapore\'s award-winning Changi Airport to destinations across Asia and beyond.'
      }
    ],
    routes: [
      { from: 'London', to: 'Singapore', duration: '13h 25m', aircraft: 'A380' },
      { from: 'New York', to: 'Singapore', duration: '18h 45m', aircraft: 'A350' },
      { from: 'Singapore', to: 'Tokyo', duration: '7h 20m', aircraft: 'A350' },
      { from: 'Singapore', to: 'Sydney', duration: '8h 10m', aircraft: 'A380' }
    ],
    classes: [
      {
        name: 'Suites Class',
        description: 'Private suites with double beds and luxury amenities',
        features: ['Private suite with double bed', 'Personal wardrobe', 'Premium dining', 'Dedicated service']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats with direct aisle access',
        features: ['Lie-flat seats', 'Direct aisle access', 'Premium dining', 'Priority boarding']
      }
    ]
  },
  'lufthansa-airlines': {
    title: 'Lufthansa Airlines',
    subtitle: 'Nonstop You',
    description: 'Discover German precision and hospitality with Lufthansa. As Europe\'s largest airline, we connect you to the world with reliability, comfort, and exceptional service.',
    heroImage: '/images/lufthansa-hero.jpg',
    introTitle: 'German Excellence in Aviation',
    introText: 'Lufthansa combines German engineering precision with warm hospitality to deliver exceptional travel experiences. Our extensive European network and modern fleet ensure you reach your destination in comfort and style.',
    ctaTitle: 'Fly with European Excellence',
    ctaText: 'Choose Lufthansa for reliable connections, premium comfort, and the renowned German standard of service excellence.',
    features: [
      {
        title: 'European Network',
        description: 'Extensive connections across Europe with convenient hubs in Frankfurt and Munich.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on advanced aircraft including A350, A380, and Boeing 747-8 with premium amenities.'
      },
      {
        title: 'Star Alliance',
        description: 'Access to the world\'s largest airline alliance network with seamless connections globally.'
      }
    ],
    routes: [
      { from: 'London', to: 'Frankfurt', duration: '1h 25m', aircraft: 'A320' },
      { from: 'New York', to: 'Frankfurt', duration: '8h 10m', aircraft: 'A380' },
      { from: 'Frankfurt', to: 'Tokyo', duration: '11h 50m', aircraft: 'A350' },
      { from: 'Munich', to: 'Singapore', duration: '12h 30m', aircraft: 'A350' }
    ],
    classes: [
      {
        name: 'First Class',
        description: 'Private cabins with full-flat beds and premium service',
        features: ['Private cabin', 'Full-flat bed', 'Premium dining', 'Personal service']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats with direct aisle access',
        features: ['Lie-flat seats', 'Direct aisle access', 'Premium meals', 'Priority check-in']
      }
    ]
  },
  'american-airlines': {
    title: 'American Airlines',
    subtitle: 'Going for Great',
    description: 'Fly with America\'s largest airline network. American Airlines connects you to more destinations with modern aircraft, premium amenities, and exceptional service.',
    heroImage: '/images/american-hero.jpg',
    introTitle: 'America\'s Premier Airline',
    introText: 'American Airlines offers the most comprehensive network in the Americas, connecting you to over 350 destinations worldwide. Experience modern comfort, premium dining, and award-winning service on every flight.',
    ctaTitle: 'Discover American Excellence',
    ctaText: 'Choose American Airlines for the most extensive network, modern fleet, and premium travel experience across the Americas and beyond.',
    features: [
      {
        title: 'Largest Network',
        description: 'Connect to over 350 destinations with the most comprehensive route network in the Americas.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on the latest aircraft including Boeing 787 Dreamliner and Airbus A321XLR with premium amenities.'
      },
      {
        title: 'AAdvantage Program',
        description: 'Earn and redeem miles with one of the world\'s most valuable frequent flyer programs.'
      }
    ],
    routes: [
      { from: 'New York', to: 'Los Angeles', duration: '6h 15m', aircraft: 'A321T' },
      { from: 'Miami', to: 'London', duration: '8h 45m', aircraft: 'B777' },
      { from: 'Dallas', to: 'Tokyo', duration: '13h 20m', aircraft: 'B787' },
      { from: 'Los Angeles', to: 'Sydney', duration: '15h 30m', aircraft: 'B787' }
    ],
    classes: [
      {
        name: 'Flagship First',
        description: 'Private suites with lie-flat beds and premium dining',
        features: ['Private suite', 'Lie-flat bed', 'Premium dining', 'Flagship Lounge access']
      },
      {
        name: 'Flagship Business',
        description: 'Lie-flat seats with direct aisle access',
        features: ['Lie-flat seats', 'Direct aisle access', 'Premium meals', 'Priority boarding']
      }
    ]
  },
  'nippon-airways': {
    title: 'Nippon Airways (ANA)',
    subtitle: 'Inspiration of Japan',
    description: 'Experience Japanese hospitality and precision with ANA. Discover the art of omotenashi service while flying on one of the world\'s most punctual and reliable airlines.',
    heroImage: '/images/ana-hero.jpg',
    introTitle: 'Japanese Hospitality in the Sky',
    introText: 'ANA brings the essence of Japanese culture and hospitality to every flight. Our commitment to punctuality, service excellence, and passenger comfort has made us one of the world\'s most trusted airlines.',
    ctaTitle: 'Experience Japanese Excellence',
    ctaText: 'Discover the difference of Japanese hospitality and precision. Fly ANA for an unforgettable journey with authentic omotenashi service.',
    features: [
      {
        title: 'Omotenashi Service',
        description: 'Experience authentic Japanese hospitality with our attentive and respectful cabin service.'
      },
      {
        title: 'Punctuality Leader',
        description: 'Consistently ranked among the world\'s most punctual airlines with exceptional on-time performance.'
      },
      {
        title: 'Modern Fleet',
        description: 'Fly on the latest Boeing 787 Dreamliner and Airbus A380 aircraft with advanced comfort features.'
      }
    ],
    routes: [
      { from: 'Tokyo', to: 'London', duration: '12h 35m', aircraft: 'B787' },
      { from: 'Tokyo', to: 'New York', duration: '12h 55m', aircraft: 'B777' },
      { from: 'Tokyo', to: 'Singapore', duration: '7h 20m', aircraft: 'B787' },
      { from: 'Osaka', to: 'Los Angeles', duration: '11h 40m', aircraft: 'B787' }
    ],
    classes: [
      {
        name: 'First Class',
        description: 'Private suites with traditional Japanese service',
        features: ['Private suite', 'Traditional Japanese cuisine', 'Premium amenities', 'Dedicated service']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats with Japanese-inspired comfort',
        features: ['Lie-flat seats', 'Japanese cuisine', 'Premium entertainment', 'Priority service']
      }
    ]
  },
  'qantas-airways': {
    title: 'Qantas Airways',
    subtitle: 'Spirit of Australia',
    description: 'Fly with Australia\'s flag carrier and experience the spirit of the land down under. Qantas combines safety excellence with warm Australian hospitality on every journey.',
    heroImage: '/images/qantas-hero.jpg',
    introTitle: 'Australia\'s Premium Airline',
    introText: 'Qantas has been connecting Australia to the world for nearly a century. Our commitment to safety, innovation, and the famous Australian spirit of service makes every journey memorable.',
    ctaTitle: 'Experience the Spirit of Australia',
    ctaText: 'Choose Qantas for exceptional safety standards, warm Australian hospitality, and connections to the most beautiful destinations in the Pacific.',
    features: [
      {
        title: 'Safety Excellence',
        description: 'Recognized as one of the world\'s safest airlines with an impeccable safety record spanning decades.'
      },
      {
        title: 'Australian Spirit',
        description: 'Experience warm, friendly service that embodies the welcoming spirit of Australia.'
      },
      {
        title: 'Pacific Network',
        description: 'Extensive connections across Australia, Asia-Pacific, and beyond from our Sydney and Melbourne hubs.'
      }
    ],
    routes: [
      { from: 'Sydney', to: 'London', duration: '22h 20m', aircraft: 'A380' },
      { from: 'Melbourne', to: 'Los Angeles', duration: '15h 50m', aircraft: 'A350' },
      { from: 'Sydney', to: 'Tokyo', duration: '9h 25m', aircraft: 'B787' },
      { from: 'Brisbane', to: 'Singapore', duration: '7h 40m', aircraft: 'A330' }
    ],
    classes: [
      {
        name: 'First Class',
        description: 'Private suites with Australian-inspired luxury',
        features: ['Private suite', 'Australian cuisine', 'Premium amenities', 'Dedicated service']
      },
      {
        name: 'Business Class',
        description: 'Lie-flat seats with Pacific comfort',
        features: ['Lie-flat seats', 'Premium dining', 'Entertainment system', 'Priority boarding']
      }
    ]
  },
  'turkish-airlines': {
    title: 'Turkish Airlines',
    subtitle: 'Widen Your World',
    description: 'Discover the bridge between continents with Turkish Airlines. Experience Turkish hospitality while connecting to more countries than any other airline in the world.',
    heroImage: '/images/turkish-hero.jpg',
    introTitle: 'Gateway to the World',
    introText: 'Turkish Airlines connects you to more countries and destinations than any other airline, with Istanbul serving as the perfect bridge between Europe, Asia, and Africa. Experience authentic Turkish hospitality and cuisine at 30,000 feet.',
    ctaTitle: 'Explore the World with Turkish Airlines',
    ctaText: 'Choose Turkish Airlines for the most extensive global network, authentic Turkish hospitality, and seamless connections through our Istanbul hub.',
    features: [
      {
        title: 'Most Destinations',
        description: 'Fly to more countries than any other airline with over 300 destinations across 6 continents.'
      },
      {
        title: 'Istanbul Hub',
        description: 'Connect through our modern Istanbul Airport hub, perfectly positioned between Europe, Asia, and Africa.'
      },
      {
        title: 'Turkish Hospitality',
        description: 'Experience warm Turkish culture and authentic cuisine with our renowned cabin service.'
      }
    ],
    routes: [
      { from: 'Istanbul', to: 'London', duration: '4h 10m', aircraft: 'A350' },
      { from: 'Istanbul', to: 'New York', duration: '11h 15m', aircraft: 'B777' },
      { from: 'Istanbul', to: 'Tokyo', duration: '9h 50m', aircraft: 'A350' },
      { from: 'Istanbul', to: 'Cape Town', duration: '8h 45m', aircraft: 'A330' }
    ],
    classes: [
      {
        name: 'Business Class',
        description: 'Lie-flat seats with Turkish-inspired luxury',
        features: ['Lie-flat seats', 'Turkish cuisine', 'Premium entertainment', 'Priority service']
      },
      {
        name: 'Comfort Class',
        description: 'Enhanced comfort with extra legroom',
        features: ['Extra legroom', 'Premium meals', 'Priority boarding', 'Enhanced service']
      }
    ]
  }
};

const IMAGE_FALLBACKS: Record<string, string> = {
  'emirates-airlines': '/images/london-big.jpg',
  'singapore-airlines': '/images/paris.jpg',
  'lufthansa-airlines': '/images/rome.jpg',
  'american-airlines': '/images/madrid.jpg',
  'nippon-airways': '/images/athens.jpg',
  'qantas-airways': '/images/lisbon.jpg',
  'turkish-airlines': '/images/london.jpg'
};

const getHeroImage = (slug: string, airlineContent: AirlineContent): string => {
  // Use heroImage from airline content if available, otherwise fallback
  if (airlineContent.heroImage && airlineContent.heroImage !== '/images/emirates-hero.jpg' && airlineContent.heroImage !== '/images/singapore-hero.jpg' && airlineContent.heroImage !== '/images/lufthansa-hero.jpg' && airlineContent.heroImage !== '/images/american-hero.jpg' && airlineContent.heroImage !== '/images/ana-hero.jpg' && airlineContent.heroImage !== '/images/qantas-hero.jpg' && airlineContent.heroImage !== '/images/turkish-hero.jpg') {
    return airlineContent.heroImage;
  }
  // For default hero images that don't exist, use airline-specific images from /images/airlines/
  const airlineImages: Record<string, string> = {
    'emirates-airlines': '/images/airlines/emirates.jpg',
    'singapore-airlines': '/images/airlines/singapore.jpg',
    'lufthansa-airlines': '/images/airlines/lufthansa.jpg',
    'american-airlines': '/images/airlines/american.jpg',
    'nippon-airways': '/images/airlines/nippon.jpg',
    'qantas-airways': '/images/airlines/qantas.jpg',
    'turkish-airlines': '/images/airlines/turkish.jpg'
  };
  return airlineImages[slug] || '/images/london-big.jpg';
};

export default function AirlinePage({ slug }: AirlinePageProps) {
  const [airlineContent, setAirlineContent] = useState<AirlineContent>(AIRLINE_CONTENT[slug] || AIRLINE_CONTENT['emirates-airlines']);

  // Load content from admin panel if available
  useEffect(() => {
    const loadAdminContent = async () => {
      const adminContent = await loadAirlinesContent();
      if (adminContent[slug]) {
        const content = adminContent[slug];
        // Convert admin content to component format
       const convertedContent: AirlineContent = {
         title: content.title,
         subtitle: content.subtitle,
         description: content.description,
         heroImage: content.heroImage,
         introTitle: content.introTitle || '',
         introText: content.introText || '',
         ctaTitle: content.ctaTitle || '',
         ctaText: content.ctaText || '',
         features: content.features || [],
         routes: content.popularRoutes?.map(route => ({
           from: route.from,
           to: route.to,
           duration: '8h 30m', // Default duration since admin doesn't have this field
           aircraft: 'A380' // Default aircraft since admin doesn't have this field
         })) || [],
         classes: content.travelClasses?.map(travelClass => ({
           name: travelClass.name,
           description: travelClass.description,
           features: travelClass.features
         })) || []
       };
        setAirlineContent(convertedContent);
      }
    };
    loadAdminContent();
  }, [slug]);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);
  const [isSticky, setSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const searchState = useFlightSearch(nearestAirport);

  useEffect(() => {
    const fetchLocationAndAirport = async () => {
      try {
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
          // Failed to get location from IP API
        }
      } catch (error) {
        // Error fetching IP geolocation
      }
    };

    fetchLocationAndAirport();
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { rootMargin: '0px', threshold: 0 }
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const heroSrc = getHeroImage(slug, airlineContent);

  return (
    <main className="min-h-screen w-full bg-white">
      {/* Hero */}
      <section className="relative w-full min-h-[700px] pb-8 md:pb-12">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt={`${airlineContent.title} aircraft`}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0ABAB5]/45 via-[#0ABAB5]/25 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col min-h-[700px]">
          <Navbar isDarkBackground={true} />
          <div className="flex-1 w-full max-w-[1280px] mx-auto px-2 flex flex-col items-center justify-start pt-16">
            <div className="text-white text-center w-full">
              <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight">{airlineContent.title}</h1>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold">{airlineContent.subtitle}</p>
              <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-white/90">
                {airlineContent.description}
              </p>
            </div>
            <div className="mt-8 w-full text-left">
              <AnimatePresence>
                {isSticky && (
                <motion.div
                    className="fixed top-0 left-0 right-0 z-40 shadow-lg"
                    style={{ backgroundColor: '#0ABAB5' }}
                    initial={{ y: -120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -120, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="max-w-[1280px] mx-auto py-2 px-2">
                        <div className="hidden md:block w-full">
                            <FlightSearchForm 
                              isSticky={isSticky}
                              {...searchState}
                            />
                        </div>
                        <div className="block md:hidden w-full">
                            <StickySearchInput 
                              fromSelection={searchState.fromSelection}
                              toSelection={searchState.toSelection}
                              onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </div>
                </motion.div>
                )}
              </AnimatePresence>

              <div ref={formRef} className={`w-full transition-opacity duration-300 ${isSticky ? 'opacity-0' : 'opacity-100'}`}>
                <div className="hidden md:block w-full">
                  <FlightSearchForm 
                    isSticky={isSticky}
                    {...searchState}
                  />
                </div>
                
                <div className="block md:hidden w-full">
                  <FlightSearchFormMobile 
                    {...searchState}
                    coords={coords}
                  />
                </div>
              </div>

              <SearchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <FlightSearchFormMobile 
                  {...searchState}
                  coords={coords}
                />
              </SearchModal>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-[1280px] mx-auto px-2 py-10 sm:py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {airlineContent.introTitle}
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {airlineContent.introText}
        </p>
      </section>

      {/* Features */}
      <section className="max-w-[1280px] mx-auto px-2 pb-4 sm:pb-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Why Choose {airlineContent.title}?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {airlineContent.features.map((feature, index) => (
            <div key={index} className="rounded-2xl bg-[#0ABAB5] p-6 text-white text-center">
              <h4 className="text-lg font-semibold">{feature.title}</h4>
              <p className="mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Airline Deals */}
      <AirlineDealsSection airlineSlug={slug} airlineName={airlineContent.title} />

      {/* Classes */}
      <section className="max-w-[1280px] mx-auto px-2 pb-10 sm:pb-14">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Travel Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {airlineContent.classes.map((travelClass, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{travelClass.name}</h4>
              <p className="text-gray-600 mb-4">{travelClass.description}</p>
              <ul className="space-y-2">
                {travelClass.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-[#0ABAB5] rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-2 py-10 sm:py-14 text-center">
        <h3 className="sr-only">Book your flight</h3>
        <p className="text-gray-900 text-lg sm:text-xl font-semibold max-w-4xl mx-auto">
          {airlineContent.ctaTitle}
        </p>
        <p className="mt-3 text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
          {airlineContent.ctaText}
        </p>
      </section>
    </main>
  );
}