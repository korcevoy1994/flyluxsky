'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import { X } from 'lucide-react';

interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
}

const StarRating = ({ rating }: { rating: number }) => {
    const getStarImage = () => `/icons/testimonials/${rating} star.svg`;
    return (
      <div className="flex-shrink-0">
        <Image src={getStarImage()} alt={`${rating} star rating`} width={105} height={20} />
      </div>
    );
};

interface TestimonialModalProps {
  testimonial: Testimonial;
  onClose: () => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ testimonial, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!testimonial) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
    >
        <div 
            className="bg-white rounded-3xl p-8 max-w-lg w-full relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full"
                aria-label="Close modal"
            >
                <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden relative">
                    {testimonial.avatar ? (
                        <Image src={testimonial.avatar} alt={testimonial.name} fill style={{ objectFit: 'cover' }} loading="lazy" />
                    ) : (
                        <div className="w-full h-full bg-[#0ABAB5] flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                            {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold text-[#0D2B29] uppercase font-poppins">{testimonial.name}</h3>
                <StarRating rating={testimonial.rating} />
                <p className="text-sm text-[#0D2B29]/80 font-poppins">{testimonial.date}</p>
                <div className="max-h-60 w-full text-left overflow-y-auto pr-2">
                    <p className="text-base text-[#0D2B29] font-poppins leading-relaxed">{testimonial.review}</p>
                </div>
            </div>
        </div>
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          .animate-slide-up {
            animation: slide-up 0.4s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default TestimonialModal;