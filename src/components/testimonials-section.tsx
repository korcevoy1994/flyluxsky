'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import TestimonialModal from './testimonial-modal';

// Interfaces and Data
interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
}

const testimonials: Testimonial[] = [
    {
        name: "John Cirillo",
        avatar: "/images/avatars/avatar-john-cirillo.png",
        rating: 5,
        date: "Mar 6, 2025",
        review: "Daniel Hoffman provided excellent customer service for my recent inquiry. He was quick to respond and is certainly an asset for his company..."
      },
      {
        name: "Mrs. Deborah Rydberg",
        avatar: "/images/avatars/avatar-deborah-rydberg.png",
        rating: 5,
        date: "Mar 6, 2025",
        review: "Anthony was able to get us last minute flights to Paris. The ones we originally chose were sold out by the time I got the forms completed..."
      },
      {
        name: "denise",
        avatar: "/images/avatars/avatar-denise.png",
        rating: 5,
        date: "Mar 6, 2025",
        review: "Daniel is extremely helpful at finding us the flight we wanted at the price we never expected! He is responsive and thorough and will walk you..."
      },
      {
        name: "earl gress",
        avatar: "/images/avatars/avatar-earl-gress.png",
        rating: 5,
        date: "Mar 6, 2025",
        review: "Sergio our personal customer service representative was able to make our Buck List trip to Ireland a reality. His professionalism and attention..."
      },
      {
        name: "Sarah Mitchell",
        avatar: "", 
        rating: 5,
        date: "Mar 5, 2025",
        review: "Amazing service! They found me the perfect flight within my budget and the booking process was seamless. Highly recommend for all your travel needs."
      },
      {
        name: "Michael Johnson",
        avatar: "", 
        rating: 5,
        date: "Mar 4, 2025",
        review: "The team went above and beyond to help me change my flight dates. Professional, efficient, and genuinely caring customer service. Thank you!"
      },
      {
        name: "Emily Davis",
        avatar: "", 
        rating: 5,
        date: "Mar 3, 2025",
        review: "Best travel booking experience I've ever had. The staff was knowledgeable, friendly, and helped me save hundreds on my international flight."
      },
      {
        name: "Robert Wilson",
        avatar: "", 
        rating: 5,
        date: "Mar 2, 2025",
        review: "Outstanding service from start to finish. They made my complex multi-city trip planning effortless and stress-free. Will definitely use again!"
      }
];

// Custom Hook for Carousel Logic
function useTestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const handleOpenModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedTestimonial(null);
    document.body.style.overflow = 'auto';
  };

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
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
    });
    emblaApi.on('scroll', onScroll);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onScroll, onSelect]);

  return { emblaRef, scrollProgress, scrollPrev, scrollNext, prevBtnDisabled, nextBtnDisabled, selectedTestimonial, handleOpenModal, handleCloseModal };
}


// Components
const StarRating = ({ rating }: { rating: number }) => {
  const getStarImage = () => `/icons/testimonials/${rating} star.svg`;
  return (
    <div className="flex-shrink-0">
      <Image src={getStarImage()} alt={`${rating} star rating`} width={105} height={20} />
    </div>
  );
};

const TestimonialCard = ({ testimonial, onClick }: { testimonial: Testimonial, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="relative flex-shrink-0 w-[224px] lg:w-[270px] bg-white border border-[#F0FBFA] rounded-3xl p-4 flex flex-col items-center text-center gap-4 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
  >
    <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative">
      {testimonial.avatar ? (
        <Image src={testimonial.avatar} alt={testimonial.name} fill style={{ objectFit: 'cover' }} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
      )}
    </div>
    <h3 className="text-lg font-medium text-[#0D2B29] uppercase font-poppins">{testimonial.name}</h3>
    <StarRating rating={testimonial.rating} />
    <p className="text-sm text-[#0D2B29] font-poppins">{testimonial.date}</p>
    <p className="text-sm text-[#0D2B29] font-poppins leading-relaxed line-clamp-3">{testimonial.review}</p>
  </div>
);

// Main Component
export default function TestimonialsSection() {
  const { emblaRef, scrollProgress, scrollPrev, scrollNext, prevBtnDisabled, nextBtnDisabled, selectedTestimonial, handleOpenModal, handleCloseModal } = useTestimonialCarousel();

  return (
    <section className="w-full max-w-[1280px] mx-auto bg-white rounded-3xl py-8 px-2 lg:p-12 flex flex-col items-center gap-8 lg:gap-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 text-center pl-2">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0D2B29] font-poppins uppercase">
          Trusted by Travelers Worldwide
        </h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-[#0ABAB5] rounded-full py-2 px-6 text-lg sm:text-xl font-bold uppercase font-ubuntu whitespace-nowrap text-white">
              98% OF TRAVELERS
            </div>
            <p className="text-lg sm:text-2xl text-[#0D2B29] font-ubuntu">Love Us on Trustpilot</p>
          </div>
          <div className="relative">
            <Image src="/icons/testimonials/trustpilot-rating.png" alt="Trustpilot Rating" width={126} height={24} style={{ objectFit: 'contain' }} />
          </div>
          <p className="text-sm text-[#0D2B29] font-ubuntu mt-2">
            Excellent, Rated 4.9 out of 5. Based on 1101 reviews on Trustpilot
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="w-full bg-[#F0FBFA] rounded-3xl py-6 relative">
         <button onClick={scrollPrev} disabled={prevBtnDisabled} className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50">
            <Image src="/icons/testimonials/arrow-left-black.svg" alt="Previous" width={10} height={16} />
        </button>

        <div className="overflow-hidden py-4" ref={emblaRef}>
            <div className="flex gap-6 pl-6 lg:pl-10">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} onClick={() => handleOpenModal(testimonial)} />
                ))}
            </div>
        </div>
        
        <button onClick={scrollNext} disabled={nextBtnDisabled} className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50">
            <Image src="/icons/testimonials/arrow-right-orange.svg" alt="Next" width={10} height={16} />
        </button>

        <div className="w-full flex justify-center mt-6 px-4">
            <div className="w-full max-w-[335px] lg:max-w-[1136px] h-1 bg-white rounded-2xl relative">
                <div
                    className="h-full bg-[#EC5E39] rounded-2xl"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
        </div>
      </div>

      <button className="bg-[#0ABAB5] text-white px-8 py-4 rounded-full font-inter font-medium text-lg uppercase hover:bg-[#0ABAB5]/90 transition-colors cursor-pointer">
        view all reviews
      </button>

      {selectedTestimonial && (
        <TestimonialModal testimonial={selectedTestimonial} onClose={handleCloseModal} />
      )}
    </section>
  );
} 