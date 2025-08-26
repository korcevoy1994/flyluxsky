"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HotelBookingModal from "./hotel-booking-modal";
import CruiseBookingModal from "./cruise-booking-modal";

export default function HotelsCruiseSection() {
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isCruiseModalOpen, setIsCruiseModalOpen] = useState(false);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0D2B29] font-poppins uppercase mb-4">
            Explore More Travel Options
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing hotels and cruise experiences for your perfect getaway
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {/* Hotels Section */}
          <div
            className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-64 md:h-80 bg-center bg-cover bg-transparent cursor-pointer"
            onClick={() => setIsHotelModalOpen(true)}
          >
            {/* Background image layer */}
            <Image
              src="/images/hotel.jpg"
              alt="Luxury hotel"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center z-0 select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
              priority={false}
              quality={85}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-5 transition-opacity duration-300 group-hover:opacity-0"></div>
            
            <div className="relative flex h-full w-full justify-between items-end p-4 md:p-8 bg-transparent z-10">
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  Luxury Hotels
                </h3>
                <p className="text-sm md:text-base text-white/95 drop-shadow-md">
                  Find the perfect accommodation for your stay
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHotelModalOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 text-sm md:text-base text-white font-semibold rounded-lg transition-colors duration-200 w-fit bg-[#EC5E39] hover:brightness-95 cursor-pointer ml-4"
              >
                Book a Hotel
              </button>
            </div>
          </div>

          {/* Cruise Section */}
          <div
            className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-64 md:h-80 bg-center bg-cover bg-transparent cursor-pointer"
            onClick={() => setIsCruiseModalOpen(true)}
          >
            {/* Background image layer */}
            <Image
              src="/images/cruise.jpg"
              alt="Cruise adventure"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center z-0 select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
              priority={false}
              quality={85}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-5 transition-opacity duration-300 group-hover:opacity-0"></div>
            
            <div className="relative flex h-full w-full justify-between items-end p-4 md:p-8 bg-transparent z-10">
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  Cruise Adventures
                </h3>
                <p className="text-sm md:text-base text-white/95 drop-shadow-md">
                  Sail away on unforgettable cruise experiences
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCruiseModalOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 text-sm md:text-base text-white font-semibold rounded-lg transition-colors duration-200 w-fit bg-[#EC5E39] hover:brightness-95 cursor-pointer ml-4"
              >
                Book a Cruise
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hotel Booking Modal */}
      <HotelBookingModal 
        isOpen={isHotelModalOpen} 
        onClose={() => setIsHotelModalOpen(false)} 
      />
      
      {/* Cruise Booking Modal */}
      <CruiseBookingModal 
        isOpen={isCruiseModalOpen} 
        onClose={() => setIsCruiseModalOpen(false)} 
      />
    </section>
  );
}