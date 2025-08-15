'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import TestimonialModal from './testimonial-modal';
import { ensureReviewsConfigLoaded } from '@/lib/reviewsAdmin';

// Interfaces and Data
interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
}

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
        <Image src={testimonial.avatar} alt={testimonial.name} width={56} height={56} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-[#0ABAB5] flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
      )}
    </div>
    <h3 className="text-lg font-medium text-[#0D2B29] uppercase font-poppins">{testimonial.name}</h3>
    <StarRating rating={testimonial.rating} />
    <p className="text-sm text-[#0D2B29] font-poppins">{testimonial.date}</p>
    <p className="text-sm text-[#0D2B29] font-poppins leading-relaxed line-clamp-3 break-words max-w-full">{testimonial.review}</p>
  </div>
);

// Main Component
export default function TestimonialsSection() {
  const router = useRouter();
  const { emblaRef, scrollProgress, scrollPrev, scrollNext, prevBtnDisabled, nextBtnDisabled, selectedTestimonial, handleOpenModal, handleCloseModal } = useTestimonialCarousel();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const reviews = await ensureReviewsConfigLoaded();
        if (!mounted) return;
        const mapped: Testimonial[] = (reviews as unknown[]).map((row) => {
          const r = row as ApiReviewRow
          return {
            name: r.name || '',
            avatar: (r.avatar ?? r.avatar_url) || '',
            rating: Math.max(1, Math.min(5, Number(r.rating ?? 5))),
            date: r.date || r.review_date || (r.created_at ? r.created_at.slice(0, 10) : '') || '',
            review: (r.review ?? r.text) || ''
          }
        })
        setTestimonials(mapped);
      } catch {
        // Failed to load reviews, showing empty list
        setTestimonials([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
                {testimonials.slice(0, 12).map((testimonial: Testimonial, index: number) => (
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

      <button 
        onClick={() => router.push('/reviews')}
        className="bg-[#0ABAB5] text-white px-8 py-4 rounded-full font-inter font-medium text-lg uppercase hover:bg-[#0ABAB5]/90 transition-colors cursor-pointer"
      >
        view all reviews
      </button>

      {selectedTestimonial && (
        <TestimonialModal testimonial={selectedTestimonial} onClose={handleCloseModal} />
      )}
    </section>
  );
}

// Type for API row to avoid any
interface ApiReviewRow {
  name?: string
  avatar?: string
  avatar_url?: string
  date?: string
  review_date?: string
  created_at?: string
  rating?: number | string
  review?: string
  text?: string
}