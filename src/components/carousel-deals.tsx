'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';

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
}

const deals: Deal[] = [
  {
    id: 1,
    city: "Amsterdam",
    country: "Netherlands", 
    price: "$299",
    originalPrice: "$450",
    discount: "33% OFF",
    image: "/images/deals/amsterdam.png",
    airline: "KLM",
    duration: "8h 15m"
  },
  {
    id: 2,
    city: "Istanbul",
    country: "Turkey",
    price: "$199",
    originalPrice: "$350",
    discount: "43% OFF", 
    image: "/images/deals/istanbul.png",
    airline: "Turkish Airlines",
    duration: "6h 30m"
  },
  {
    id: 3,
    city: "Dubai",
    country: "UAE",
    price: "$399",
    originalPrice: "$600",
    discount: "33% OFF",
    image: "/images/deals/dubai.png",
    airline: "Emirates",
    duration: "7h 45m"
  },
  {
    id: 4,
    city: "Sydney",
    country: "Australia", 
    price: "$799",
    originalPrice: "$1200",
    discount: "33% OFF",
    image: "/images/deals/sydney.png",
    airline: "Qantas",
    duration: "15h 20m"
  },
  {
    id: 5,
    city: "Paris",
    country: "France",
    price: "$349",
    originalPrice: "$520",
    discount: "33% OFF",
    image: "/images/deals/paris.png", 
    airline: "Air France",
    duration: "9h 10m"
  },
  {
    id: 6,
    city: "London", 
    country: "United Kingdom",
    price: "$289",
    originalPrice: "$450",
    discount: "36% OFF",
    image: "/images/london.jpg",
    airline: "British Airways",
    duration: "8h 45m"
  },
  {
    id: 7,
    city: "Rome",
    country: "Italy",
    price: "$269",
    originalPrice: "$400",
    discount: "33% OFF", 
    image: "/images/rome.jpg",
    airline: "Alitalia",
    duration: "9h 30m"
  },
  {
    id: 8,
    city: "Madrid",
    country: "Spain",
    price: "$249",
    originalPrice: "$380",
    discount: "34% OFF",
    image: "/images/madrid.jpg",
    airline: "Iberia",
    duration: "8h 20m"
  },
  {
    id: 9,
    city: "Athens",
    country: "Greece", 
    price: "$229",
    originalPrice: "$350",
    discount: "35% OFF",
    image: "/images/athens.jpg",
    airline: "Aegean Airlines",
    duration: "10h 15m"
  },
  {
    id: 10,
    city: "Lisbon",
    country: "Portugal",
    price: "$239",
    originalPrice: "$360",
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
const DealCard = ({ deal }: { deal: Deal }) => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer group">
    {/* Background Image */}
    <Image 
      src={deal.image} 
      alt={deal.city} 
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
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
        <p className="text-4xl font-bold font-poppins">$2,500</p>
        <div className="mt-2 inline-flex items-center gap-2 bg-white text-[#0ABAB5] px-4 py-2 rounded-full text-base font-bold font-poppins whitespace-nowrap">
          <Image src="/icons/clock.svg" alt="clock icon" width={24} height={24} className="text-white"/>
          <span className="uppercase">Limited time</span>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function CarouselDeals() {
  const { emblaRef, emblaApi, scrollProgress, scrollPrev, scrollNext, selectedIndex } = useDealsCarousel();
  
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

    if (distance === 0) return 0;      // Center card - no blur
    if (distance === 1) return 2;      // Adjacent cards - slight blur
    if (distance === 2) return 4;      // Side cards - more blur
    return 4; // Default for other slides
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
              <DealCard deal={deal} />
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