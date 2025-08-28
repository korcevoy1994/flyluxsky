'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from "next/image";
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { searchAirportsGrouped, GroupedSearchResult, getNearbyAirports } from '@/lib/utils';

// Interfaces and Data
interface Deal {
  id: number;
  city: string;
  country: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  airline: string;
  duration: string;
  video?: string;
}

const deals: Deal[] = [
  {
    id: 1,
    city: "Amsterdam",
    country: "Netherlands", 
    price: "$1,100",
    originalPrice: "$2,500",
    discount: "33% OFF",
    image: "/images/deals/amsterdam.png",
    airline: "KLM",
    duration: "8h 15m"
  },
  {
    id: 2,
    city: "Istanbul",
    country: "Turkey",
    price: "$977",
    originalPrice: "$1,350",
    discount: "43% OFF", 
    image: "/images/deals/istanbul.png",
    airline: "Turkish Airlines",
    duration: "6h 30m"
  },
  {
    id: 3,
    city: "Dubai",
    country: "UAE",
    price: "$1,100",
    originalPrice: "$2,500",
    discount: "33% OFF",
    image: "/images/deals/dubai.png",
    airline: "Emirates",    
    duration: "7h 45m"
  },
  {
    id: 4,
    city: "Sydney",
    country: "Australia", 
    price: "$1,799",
    originalPrice: "$3,200",
    discount: "33% OFF",
    image: "/images/deals/sydney.png",
    airline: "Qantas",
    duration: "15h 20m"
  },
  {
    id: 5,
    city: "Paris",
    country: "France",
    price: "$1,110",
    originalPrice: "$2,500",
    discount: "33% OFF",
    image: "/images/deals/paris.png", 
    airline: "Air France",
    duration: "9h 10m",
    video: "/video/IMG_4041_1_1.mp4"
  },
  {
    id: 6,
    city: "London", 
    country: "United Kingdom",
    price: "$1,289",
    originalPrice: "$2,450",
    discount: "36% OFF",
    image: "/images/london.jpg",
    airline: "British Airways",
    duration: "8h 45m"
  },
  {
    id: 7,
    city: "Rome",
    country: "Italy",
    price: "$1,269",
    originalPrice: "$2,400",
    discount: "33% OFF", 
    image: "/images/rome.jpg",
    airline: "Alitalia",
    duration: "9h 30m"
  },
  {
    id: 8,
    city: "Madrid",
    country: "Spain",
    price: "$1,249",
    originalPrice: "$2,380",
    discount: "34% OFF",
    image: "/images/madrid.jpg",
    airline: "Iberia",
    duration: "8h 20m"
  },
  {
    id: 9,
    city: "Athens",
    country: "Greece", 
    price: "$1,229",
    originalPrice: "$2,350",
    discount: "35% OFF",
    image: "/images/athens.jpg",
    airline: "Aegean Airlines",
    duration: "10h 15m"
  },
  {
    id: 10,
    city: "Lisbon",
    country: "Portugal",
    price: "$1,239",
    originalPrice: "$2,360",
    discount: "34% OFF",
    image: "/images/lisbon.jpg", 
    airline: "TAP Air Portugal",
    duration: "9h 45m"
  }
];

// Custom Hook for Carousel Logic
function useDealsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    slidesToScroll: 1,
  }, [Autoplay({ stopOnInteraction: false })]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onScroll = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', (api) => {
      onScroll(api);
      onSelect(api);
      setSelectedIndex(api.selectedScrollSnap());
    });
    emblaApi.on('scroll', onScroll);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onScroll, onSelect]);

  return { emblaRef, emblaApi, scrollProgress, scrollPrev, scrollNext, selectedIndex };
}

// Components
const DealCard = ({ deal, onClick, isCenter }: { deal: Deal, onClick: () => void, isCenter: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (deal.video && videoRef.current) {
      if (isCenter) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isCenter, deal.video]);

  return (
    <div 
      className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer group" 
      onClick={onClick}
    >
      {/* Background Video or Image */}
      {deal.video ? (
        <>
          <video
            ref={videoRef}
            src={deal.video}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isCenter ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
          />
          <Image 
            src={deal.image} 
            alt={deal.city} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              isCenter ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
            }`}
          />
        </>
      ) : (
        <Image 
          src={deal.image} 
          alt={deal.city} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between items-center text-center py-10 px-6 text-white">
        {/* Top Content */}
        <div>
          <h3 className="text-4xl font-bold font-poppins">{deal.city}</h3>
          <p className="text-lg font-poppins">{deal.country}</p>
        </div>

        {/* Bottom Content */}
        <div>
          <p className="text-sm font-poppins uppercase">Save up to</p>
          <p className="text-4xl font-bold font-poppins">{deal.price}</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-white text-[#0ABAB5] px-4 py-2 rounded-full text-base font-bold font-poppins whitespace-nowrap">
            <Image src="/icons/clock.svg" alt="clock icon" width={24} height={24} className="text-white h-auto w-auto"/>
            <span className="uppercase">Limited time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CarouselDeals() {
  const { emblaRef, emblaApi, scrollProgress, scrollPrev, scrollNext, selectedIndex } = useDealsCarousel();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const cityCodeMap: Record<string, string> = {
    Amsterdam: 'AMS',
    Istanbul: 'IST',
    Dubai: 'DXB',
    Sydney: 'SYD',
    Paris: 'CDG',
    London: 'LHR',
    Rome: 'FCO',
    Madrid: 'MAD',
    Athens: 'ATH',
    Lisbon: 'LIS',
  };

  const pickDestinationCode = (city: string, country: string): string => {
    // Prefer hard map for reliability
    if (cityCodeMap[city]) return cityCodeMap[city];
    const results: GroupedSearchResult[] = searchAirportsGrouped(city, 10);
    const byCity = results.find(r => r.type === 'city' && r.country?.toLowerCase() === country.toLowerCase());
    if (byCity && byCity.airports && byCity.airports.length > 0) return byCity.airports[0].code;
    const byCountry = results.find(r => r.country?.toLowerCase() === country.toLowerCase());
    if (byCountry) return byCountry.code || 'MUC';
    // Fallback to first result airport if exists
    if (results.length > 0) {
      if (results[0].type === 'city' && results[0].airports && results[0].airports.length > 0) return results[0].airports[0].code;
      return results[0].code || 'MUC';
    }
    return 'MUC';
  };

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDealClick = async (deal: Deal) => {
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      // Determine origin via geolocation API
      let originCode = 'LHR';
      try {
        const res = await fetch('/api/geolocation');
        if (res.ok) {
          const data = await res.json();
          if (data?.latitude && data?.longitude) {
            const nearest = getNearbyAirports(data.latitude, data.longitude, 1);
            if (nearest && nearest.length > 0) originCode = nearest[0].code;
          }
        }
      } catch {
        // ignore, fallback stays
      }

      const destinationCode = pickDestinationCode(deal.city, deal.country);
      const departure = new Date();
      const query = new URLSearchParams({
        from: originCode,
        to: destinationCode,
        tripType: 'One-way',
        passengers: '1',
        class: 'Business class',
        departureDate: formatDate(departure),
      });
      router.push(`/searching?${query.toString()}`);
    } finally {
      setIsNavigating(false);
    }
  };
  
  const getScale = (index: number) => {
    const diff = Math.abs(index - selectedIndex);
    const distance = Math.min(diff, deals.length - diff);

    if (distance === 0) return 1;      // Active slide
    if (distance === 1) return 0.9;    // Adjacent slides (10% smaller)
    if (distance === 2) return 0.85;   // Edge slides (15% smaller)
    return 0.85; // Default for other slides
  };

  const getBlur = (index: number) => {
    const diff = Math.abs(index - selectedIndex);
    const distance = Math.min(diff, deals.length - diff);

    if (distance === 0) return 0;        // Center card - no blur
    if (distance === 1) return 0.5;      // Adjacent cards - minimal blur
    if (distance === 2) return 1;        // Side cards - very small blur
    return 1; // Default for other slides
  };

  const onMouseEnter = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop()
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.play()
  }, [emblaApi]);

  return (
    <div className="w-full py-6 relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Previous Button */}
      <button 
        onClick={scrollPrev} 
        className="hidden lg:flex absolute left-48 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        aria-label="Previous deals"
      >
        <Image src="/icons/arrow-left.svg" alt="Previous" width={30} height={30} />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-center" style={{ height: '60vh' }}>
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              className="flex-shrink-0 w-[80vw] lg:w-[20vw] px-2"
              animate={{ 
                height: `${getScale(index) * 100}%`,
                filter: `blur(${getBlur(index)}px)`
              }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <DealCard deal={deal} onClick={() => handleDealClick(deal)} isCenter={index === selectedIndex} />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Next Button */}
      <button 
        onClick={scrollNext} 
        className="hidden lg:flex absolute right-48 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        aria-label="Next deals"
      >
        <Image src="/icons/arrow-right.svg" alt="Next" width={30} height={30} />
      </button>

      {/* Progress Bar */}
      <div className="w-full flex justify-center mt-6 px-4">
        <div className="w-full max-w-[1280px] h-1 bg-white rounded-2xl relative">
          <div
            className="h-full bg-[#EC5E39] rounded-2xl"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}