'use client';

import { useState } from 'react';

type FaqItemType = {
  question: string;
  answer: string;
};

const faqData: FaqItemType[] = [
  {
    question: "What makes Fly Lux Sky different from other booking platforms?",
    answer: "We specialize in business and first-class travel, offering exclusive fares with discounts up to 70%. With over 130 travel advisors averaging 10+ years of experience, we provide personalized service that surpasses any search engine."
  },
  {
    question: "How do I find the best deals on premium flights?",
    answer: "The best way is to contact our travel advisors. They have access to unpublished fares and can tailor options to your specific needs, ensuring you get the best value."
  },
  {
    question: "Can I book last-minute flights with Fly Lux Sky?",
    answer: "Absolutely. Our team excels at finding last-minute deals and can often secure significant savings even on short notice."
  },
  {
    question: "What if I need to customize my itinerary?",
    answer: "We welcome complex and customized itineraries. Our advisors can handle multi-city trips, specific airline requests, and other personalized travel needs."
  },
  {
    question: "How does Fly Lux Sky support me during my trip?",
    answer: "We offer 24/7 support to assist with any issues that may arise during your travels, from flight changes to any other travel-related concerns."
  },
  {
    question: "Are there any hidden fees when booking with Fly Lux Sky?",
    answer: "No, we believe in full transparency. The price you are quoted is the price you pay, with no hidden fees or surprises."
  }
];

const FaqItem = ({ item, index, isOpen, onClick }: { item: FaqItemType, index: number, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-[#E1F7F7]">
    <div
      className="flex items-center justify-between gap-4 py-6 cursor-pointer group transition-colors duration-200 hover:bg-teal-50/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-[#0ABAB5] rounded-lg flex items-center justify-center">
          <span className="text-white font-medium font-inter">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-lg font-medium text-[#0D2B29] font-poppins transition-colors duration-200 group-hover:text-teal-700">{item.question}</h3>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#1C5E59] flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="1" x2="12" y2="1" stroke="#1C5E59" strokeWidth="2"/>
            </svg>
        </div>
        <div className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0'}`}>
             <svg width="2" height="12" viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="12" x2="1" stroke="#1C5E59" strokeWidth="2"/>
            </svg>
        </div>
      </div>
    </div>
    <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
      <p className="text-[#0D2B29] font-poppins text-sm leading-loose pb-6 pl-14">
        {item.answer}
      </p>
    </div>
  </div>
);

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto px-2 py-12 lg:py-24">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#0D2B29] font-poppins uppercase">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg lg:text-2xl text-[#0D2B29] font-poppins">
          Everything You Need to Know Before You Fly
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {faqData.map((item, index) => (
          <FaqItem
            key={index}
            index={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </section>
  );
} 