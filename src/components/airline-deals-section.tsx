"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from "next/legacy/image";
import { Calendar, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateFlightsClient, type GeneratedFlight } from '@/lib/flightGenerator';

type DealCardData = {
  airline: string;
  logo: string;
  duration: string;
  stops: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  price: number;
};

// Airline-specific US departure cities based on actual routes
const airlineOrigins: Record<string, { code: string; city: string }[]> = {
  'Singapore Airlines': [
    { code: 'SFO', city: 'San Francisco' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'JFK', city: 'New York' },
    { code: 'EWR', city: 'Newark' },
    { code: 'SEA', city: 'Seattle' },
    { code: 'BOS', city: 'Boston' },
    { code: 'MCO', city: 'Orlando' }
  ],
  'Lufthansa': [
    { code: 'ORD', city: 'Chicago' },
    { code: 'DEN', city: 'Denver' },
    { code: 'IAD', city: 'Washington, D.C.' },
    { code: 'SFO', city: 'San Francisco' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'JFK', city: 'New York' },
    { code: 'EWR', city: 'Newark' },
    { code: 'BOS', city: 'Boston' },
    { code: 'SEA', city: 'Seattle' },
    { code: 'MIA', city: 'Miami' },
    { code: 'ATL', city: 'Atlanta' },
    { code: 'DFW', city: 'Dallas' },
    { code: 'IAH', city: 'Houston' },
    { code: 'PHX', city: 'Phoenix' },
    { code: 'LAS', city: 'Las Vegas' },
    { code: 'DTW', city: 'Detroit' },
    { code: 'MSP', city: 'Minneapolis' },
    { code: 'CLT', city: 'Charlotte' },
    { code: 'BWI', city: 'Baltimore' },
    { code: 'SLC', city: 'Salt Lake City' }
  ],
  'Emirates': [
    { code: 'JFK', city: 'New York' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'ORD', city: 'Chicago' },
    { code: 'IAH', city: 'Houston' },
    { code: 'SFO', city: 'San Francisco' },
    { code: 'IAD', city: 'Washington, D.C.' },
    { code: 'DFW', city: 'Dallas' },
    { code: 'BOS', city: 'Boston' },
    { code: 'SEA', city: 'Seattle' },
    { code: 'MIA', city: 'Miami' }
  ],
  'Etihad Airways': [
    { code: 'ATL', city: 'Atlanta' },
    { code: 'BOS', city: 'Boston' },
    { code: 'ORD', city: 'Chicago' },
    { code: 'JFK', city: 'New York' },
    { code: 'IAD', city: 'Washington, D.C.' },
    { code: 'CLT', city: 'Charlotte' }
  ],
  'Qatar Airways': [
    { code: 'ATL', city: 'Atlanta' },
    { code: 'BOS', city: 'Boston' },
    { code: 'ORD', city: 'Chicago' },
    { code: 'DFW', city: 'Dallas' },
    { code: 'IAH', city: 'Houston' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'MIA', city: 'Miami' },
    { code: 'JFK', city: 'New York' },
    { code: 'PHL', city: 'Philadelphia' },
    { code: 'PIT', city: 'Pittsburgh' },
    { code: 'SFO', city: 'San Francisco' },
    { code: 'IAD', city: 'Washington, D.C.' }
  ],
  'Qantas Airways': [
    { code: 'DFW', city: 'Dallas' },
    { code: 'HNL', city: 'Honolulu' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'JFK', city: 'New York' },
    { code: 'SFO', city: 'San Francisco' }
  ]
};

// Fallback origins for airlines not specifically configured
const defaultUsOrigins = [
  { code: 'JFK', city: 'New York' },
  { code: 'LAX', city: 'Los Angeles' },
  { code: 'SFO', city: 'San Francisco' },
  { code: 'ORD', city: 'Chicago' },
  { code: 'DFW', city: 'Dallas' },
  { code: 'ATL', city: 'Atlanta' },
  { code: 'MIA', city: 'Miami' },
  { code: 'BOS', city: 'Boston' },
  { code: 'SEA', city: 'Seattle' },
  { code: 'IAD', city: 'Washington, D.C.' }
];

const popularDestinations = [
  { code: 'LHR', city: 'London' },
  { code: 'CDG', city: 'Paris' },
  { code: 'FRA', city: 'Frankfurt' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'HND', city: 'Tokyo' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'SYD', city: 'Sydney' },
  { code: 'MAD', city: 'Madrid' },
  { code: 'FCO', city: 'Rome' },
  { code: 'AMS', city: 'Amsterdam' },
];

const airlineLogoMap: Record<string, string> = {
  'Emirates': '/logos/airlines/Emirates.svg',
  'Qatar Airways': '/logos/airlines/Qatar Airways.svg',
  'Singapore Airlines': '/logos/airlines/Singapore Airlines.svg',
  'Lufthansa': '/logos/airlines/Lufthansa.svg',
  'British Airways': '/logos/airlines/British Airways.svg',
  'Air France': '/logos/airlines/Air France.svg',
  'Turkish Airlines': '/logos/airlines/Turkish Airlines.svg',
  'KLM': '/logos/airlines/KLM.svg',
  'Swiss International Air Lines': '/logos/airlines/Swiss International Air Lines.svg',
  'Etihad Airways': '/logos/airlines/Etihad Airways.svg',
  'Cathay Pacific': '/logos/airlines/Cathay Pacific.svg',
  'ANA All Nippon Airways': '/logos/airlines/All Nippon Airways.svg',
  'Japan Airlines': '/logos/airlines/Japan Airlines.svg',
  'United Airlines': '/logos/airlines/United Airlines.svg',
  'Delta Air Lines': '/logos/airlines/Delta Air Lines.svg',
  'American Airlines': '/logos/airlines/American Airlines.svg',
  'Qantas': '/logos/airlines/Qantas.svg',
  'Qantas Airways': '/logos/airlines/Qantas.svg',
  'Virgin Atlantic': '/logos/airlines/Virgin Atlantic.svg',
  'Air Canada': '/logos/airlines/Air Canada.svg',
  'Finnair': '/logos/airlines/Finnair.svg',
  'SAS Scandinavian Airlines': '/logos/airlines/SAS Scandinavian Airlines.svg',
  'Austrian Airlines': '/logos/airlines/Austrian Airlines.svg',
  'Brussels Airlines': '/logos/airlines/Brussels Airlines.svg',
  'TAP Air Portugal': '/logos/airlines/TAP Air Portugal.svg',
  'Alitalia': '/logos/airlines/Alitalia.svg',
  'Iberia': '/logos/airlines/Iberia.svg',
  'LOT Polish Airlines': '/logos/airlines/LOT Polish Airlines.svg',
};

// Mapping from slug to airline name
const slugToAirlineName: Record<string, string> = {
  'emirates-airlines': 'Emirates',
  'singapore-airlines': 'Singapore Airlines',
  'lufthansa-airlines': 'Lufthansa',
  'american-airlines': 'American Airlines',
  'nippon-airways': 'ANA All Nippon Airways',
  'qantas-airways': 'Qantas Airways',
  'turkish-airlines': 'Turkish Airlines',
  'etihad-airways': 'Etihad Airways',
  'qatar-airways': 'Qatar Airways'
};

interface AirlineDealsProps {
  airlineSlug: string;
  airlineName: string;
}

const AirlineDealsSection = ({ airlineSlug, airlineName }: AirlineDealsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [deals, setDeals] = useState<DealCardData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Track viewport to decide how many cards to render (mobile shows all)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const buildDeals = async () => {
      const today = new Date();
      const dep = new Date(today);
      dep.setDate(dep.getDate() + 21);
      const departureDate = `${dep.getFullYear()}-${String(dep.getMonth() + 1).padStart(2, '0')}-${String(dep.getDate()).padStart(2, '0')}`;

      const pickRandom = <T,>(arr: T[], n: number) => {
        const copy = [...arr];
        const res: T[] = [];
        while (res.length < n && copy.length) {
          const idx = Math.floor(Math.random() * copy.length);
          res.push(copy.splice(idx, 1)[0]);
        }
        return res;
      };

      const targetAirline = slugToAirlineName[airlineSlug] || airlineName;
      const airlineSpecificOrigins = airlineOrigins[targetAirline] || defaultUsOrigins;
      const selectedOrigins = pickRandom(airlineSpecificOrigins, Math.min(8, airlineSpecificOrigins.length));
      const selectedDestinations = pickRandom(popularDestinations, 6);
      
      // Build combos in a round-robin fashion
      const combos: { from: { code: string; city: string }; to: { code: string; city: string } }[] = [];
      const rounds = selectedDestinations.length;
      for (let r = 0; r < rounds; r++) {
        for (let oi = 0; oi < selectedOrigins.length; oi++) {
          const o = selectedOrigins[oi];
          const d = selectedDestinations[(oi + r) % selectedDestinations.length];
          combos.push({ from: o, to: d });
        }
      }
      const out: DealCardData[] = [];
      
      for (const combo of combos.slice(0, 12)) {
        try {
          const flights = await generateFlightsClient(combo.from.code, combo.to.code, 'Business class', 'One-way', departureDate);
          if (flights && flights.length > 0) {
            const generatedFlights = flights.filter((f): f is GeneratedFlight => 'flightNumber' in f);
            if (generatedFlights.length === 0) continue;
            
            // Filter flights for the specific airline first
            const airlineFlights = generatedFlights.filter(f => f.airline === targetAirline);
            
            if (airlineFlights.length > 0) {
              // Use flights from the target airline
              const sortedByPrice = [...airlineFlights].sort((a, b) => ((a.totalPrice ?? a.price) - (b.totalPrice ?? b.price)));
              const f = sortedByPrice[0];
              const price = (f.totalPrice ?? f.price);
              
              out.push({
                airline: f.airline || targetAirline,
                logo: f.logo || airlineLogoMap[f.airline] || airlineLogoMap[targetAirline] || '/logos/airlines/Emirates.svg',
                duration: f.duration || '—',
                stops: f.stops === 0 ? 'Non stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`,
                from: combo.from.code,
                fromCity: combo.from.city,
                to: combo.to.code,
                toCity: combo.to.city,
                price: price,
              });
            }
          }
        } catch {
          // ignore failures silently
        }
      }
      
      // Ensure we have at least 6 deals, if not enough, fill with mock data
      while (out.length < 6) {
        const randomOrigin = airlineSpecificOrigins[Math.floor(Math.random() * airlineSpecificOrigins.length)];
        const randomDestination = popularDestinations[Math.floor(Math.random() * popularDestinations.length)];
        const mockPrice = Math.floor(Math.random() * 2000) + 500;
        const mockDuration = `${Math.floor(Math.random() * 15) + 5}h ${Math.floor(Math.random() * 60)}m`;
        
        out.push({
          airline: targetAirline,
          logo: airlineLogoMap[targetAirline] || '/logos/airlines/Emirates.svg',
          duration: mockDuration,
          stops: Math.random() > 0.5 ? 'Non stop' : '1 stop',
          from: randomOrigin.code,
          fromCity: randomOrigin.city,
          to: randomDestination.code,
          toCity: randomDestination.city,
          price: mockPrice,
        });
      }
      
      setDeals(out.slice(0, 6));
    };
    
    buildDeals();
  }, [airlineSlug, airlineName]);

  const handleCardClick = (deal: DealCardData) => {
    const today = new Date();
    const departureDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const q = new URLSearchParams({
      from: deal.from,
      to: deal.to,
      tripType: 'One-way',
      passengers: '1',
      class: 'Business class',
      departureDate,
      selectedAirline: deal.airline,
      selectedPrice: String(deal.price),
      selectedDuration: deal.duration === '—' ? '8h 30m' : deal.duration,
    });
    router.push(`/searching?${q.toString()}`);
  };

  return (
    <section className="w-full overflow-x-hidden bg-[#F0FBFA] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-12 px-4">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2B29] font-poppins capitalize">
              Best {airlineName} Deals
            </h2>
            <div className="bg-[#0D2B29] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm md:text-base">
              <Calendar size={20} className="text-[#F0FBFA]" />
              {currentDate && <span className="font-medium font-poppins">{currentDate}</span>}
            </div>
          </div>
        </div>

        {/* Cards container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 pl-4 md:pl-0 hide-scrollbar"
        >
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[309px] aspect-[309/190] h-auto md:w-full cursor-pointer group"
              style={{ 
                filter: 'drop-shadow(0px 4px 4px rgba(28, 94, 89, 0.05))'
              }}
              onClick={() => handleCardClick(deal)}
            >
              <div 
                className="w-full h-full bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: 'url(/Subtract.svg)' }}
              >
                <div className="grid grid-cols-2 grid-rows-2 h-full p-1 transition-opacity duration-300 group-hover:opacity-40" style={{fontFamily: "'Poppins', sans-serif"}}>
                  {/* Top-Left: Airline */}
                  <div className="flex items-center justify-center px-2">
                    <Image src={deal.logo} alt={`${deal.airline} logo`} width={500} height={300} className="h-auto max-h-[150px] w-full object-contain" />
                  </div>

                  {/* Top-Right: Duration */}
                  <div className="flex items-center justify-center">
                    <div className="bg-[#F0FBFA] text-sm px-4 py-2 rounded-full text-[#0D2B29] font-medium">
                      <span>{deal.duration}</span>
                      <span className="mx-1">•</span>
                      <span>{deal.stops}</span>
                    </div>
                  </div>

                  {/* Bottom Row: Full flight path */}
                  <div className="col-span-2 flex items-center justify-between self-center px-6">
                    {/* Departure */}
                    <div className="text-left">
                      <p className="text-2xl md:text-3xl font-bold text-[#0D2B29]">{deal.from}</p>
                      <p className="text-sm text-[#1C5E59] mt-1">{deal.fromCity}</p>
                      <p className="text-sm text-[#0D2B29] mt-1">&nbsp;</p>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="flex-shrink-0 flex items-center text-[#1C5E59] mx-2">
                        <div className="w-2 h-2 bg-current rounded-full" />
                        <div className="flex-1 border-t-2 border-dashed border-current w-6 mx-1" />
                        <Plane size={20} className="text-current" />
                        <div className="flex-1 border-t-2 border-dashed border-current w-6 mx-1" />
                        <div className="w-2 h-2 bg-current rounded-full" />
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <p className="text-2xl md:text-3xl font-bold text-[#0D2B29]">{deal.to}</p>
                      <p className="text-sm text-[#1C5E59] mt-1">{deal.toCity}</p>
                      <p className="text-sm text-[#0D2B29] mt-1">&nbsp;</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0ABAB5] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg flex items-baseline gap-1 md:gap-1.5 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xs md:text-sm font-normal">from</span>
                <span className="font-bold text-base md:text-lg">${deal.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar for mobile */}
        <div className="w-full flex justify-center mt-4 px-4 md:hidden">
          <div className="w-full max-w-[335px] h-1 bg-white rounded-2xl relative">
            <div
              className="h-full bg-[#EC5E39] rounded-2xl"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirlineDealsSection;