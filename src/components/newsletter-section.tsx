
"use client";

import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setEmail('');
        setTimeout(() => {
          setSubmissionStatus(null);
        }, 3000);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting newsletter subscription:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
          <div className="w-full md:w-[350px] relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full px-4 py-4 rounded-3xl border border-[#1C5E59] bg-white focus:outline-none focus:ring-2 focus:ring-[#1C5E59] text-[#0D2B29] text-sm"
              required
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
            disabled={isSubmitting}
            className={`w-full md:w-[200px] font-medium font-poppins py-4 px-8 rounded-full transition-colors cursor-pointer text-lg ${
              submissionStatus === 'success'
                ? 'bg-green-500 text-white'
                : submissionStatus === 'error'
                ? 'bg-red-500 text-white'
                : isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#EC5E39] text-white hover:bg-[#d54e2e]'
            }`}
          >
            {submissionStatus === 'success'
              ? 'Subscribed!'
              : submissionStatus === 'error'
              ? 'Error - Try Again'
              : isSubmitting
              ? 'Subscribing...'
              : 'Subscribe'}
          </button>
        </form>
        
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