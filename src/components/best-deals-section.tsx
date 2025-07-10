"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from "next/legacy/image";
import { Calendar, Plane } from 'lucide-react';

const deals = [
  {
    airline: 'Lufthansa',
    logo: '/logos/lufthansa.svg', 
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
  {
    airline: 'Singapore Airlines',
    logo: '/logos/singapore-airlines.png',
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
  {
    airline: 'Etihad Airways',
    logo: '/logos/etihad-airways.svg',
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
  {
    airline: 'Swiss',
    logo: '/logos/swiss.png',
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
  {
    airline: 'Emirates',
    logo: '/logos/emirates.svg',
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
  {
    airline: 'Turkish Airlines',
    logo: '/logos/turkish-airlines.png',
    duration: '12h 0m',
    stops: 'Non stop',
    from: 'DXB',
    fromCity: 'Dubai',
    fromTime: '10:30 pm',
    to: 'JFK',
    toCity: 'New York',
    toTime: '10:30 pm',
  },
];

const BestDealsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <section className="w-full overflow-x-hidden bg-[#F0FBFA] md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-12 px-4">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0D2B29] font-poppins capitalize">
              Best Deal From Top Airlines
            </h2>
            <div className="bg-[#0D2B29] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm md:text-base">
              <Calendar size={20} className="text-[#F0FBFA]" />
              <span className="font-medium font-poppins">April 29, 2025</span>
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
              className="relative flex-shrink-0 w-[309px] aspect-[309/190] h-auto md:w-full"
              style={{ 
                filter: 'drop-shadow(0px 4px 4px rgba(28, 94, 89, 0.05))'
              }}
            >
              <div 
                className="w-full h-full bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: 'url(/Subtract.svg)' }}
              >
                <div className="grid grid-cols-2 grid-rows-2 h-full p-1" style={{fontFamily: "'Inter', sans-serif"}}>
                  {/* Top-Left: Airline */}
                  <div className="flex items-center justify-center">
                    <Image src={deal.logo} alt={`${deal.airline} logo`} width={120} height={30} className="h-auto max-h-[40px] object-contain" />
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
                      <p className="text-sm text-[#0D2B29] mt-1">{deal.fromTime}</p>
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
                      <p className="text-sm text-[#0D2B29] mt-1">{deal.toTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="relative flex-shrink-0 w-[309px] h-[190px] bg-[#0ABAB5] rounded-[24px] p-4 flex items-center justify-center text-center shadow-[0px_4px_4px_0px_rgba(28,94,89,0.05)] md:hidden">
            <p className="text-white uppercase font-medium text-sm">more deals from top airlines</p>
          </div>
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

        <div className="text-center mt-12 hidden md:block">
            <button className="bg-[#0ABAB5] text-white font-semibold uppercase py-4 px-8 rounded-full hover:bg-teal-600 transition-colors text-lg font-inter">
                View All Airlines
            </button>
        </div>
        
      </div>
    </section>
  );
};

export default BestDealsSection; 