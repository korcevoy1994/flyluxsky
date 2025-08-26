
"use client";

import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto bg-white rounded-3xl py-12 px-6 my-10 md:my-20">
      <div className="max-w-[700px] mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0D2B29] font-poppins leading-[1.1em] uppercase">
          Unlock Exclusive Offers
        </h2>
        <h3 className="text-2xl font-medium text-[#0D2B29] leading-[1.5em]">
          Be the First to Access Luxury Deals
        </h3>
        <p className="text-sm text-[#0D2B29] leading-[1.5em] max-w-[500px] mx-auto">
          Stay informed about our best business and first-class fares. Subscribe now to receive exclusive offers and travel updates tailored for you.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
          <div className="w-full md:w-[350px] relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              className="peer w-full px-4 py-4 rounded-3xl border border-[#1C5E59] bg-white focus:outline-none focus:ring-2 focus:ring-[#1C5E59] text-[#0D2B29] text-sm"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-4 text-[#0D2B29] text-sm transition-all duration-300 pointer-events-none 
                         peer-focus:-top-2 peer-focus:text-xs peer-focus:left-3 peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#1C5E59]
                         peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-[#1C5E59]"
            >
              E-mail
            </label>
          </div>
          <button
            type="submit"
            className="w-full md:w-[200px] bg-[#EC5E39] text-white font-medium font-poppins py-4 px-8 rounded-full hover:bg-[#d54e2e] transition-colors cursor-pointer text-lg"
          >
            Subscribe
          </button>
        </div>
        
        {/* Privacy Policy Agreement */}
        <p className="text-xs text-[#0D2B29]/70 leading-relaxed max-w-[600px] mx-auto pt-4">
          By submitting my details, I agree to be contacted regarding my travel plans. See our{' '}
          <a href="/privacy" className="text-[#0ABAB5] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;