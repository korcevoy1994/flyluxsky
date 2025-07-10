'use client'

import React from 'react'
import { MapPin, CreditCard, Calendar } from 'lucide-react'

const BookTripSection = () => {
  return (
    <section className="w-full py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-2">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-14 max-w-sm mx-auto">
          {/* Content */}
          <div className="flex flex-col gap-6 w-full">
            {/* Subheading */}
            <p 
              className="text-left text-lg font-semibold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#0D2B29'
              }}
            >
              Easy and Fast
            </p>

            {/* Main Heading */}
            <h2 
              className="text-left text-3xl font-bold leading-tight capitalize"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#0D2B29'
              }}
            >
              Book your next trip in 3 easy steps
            </h2>

            {/* Steps */}
            <div className="flex flex-col gap-6 w-full">
              {/* Step 1 - Choose Destination */}
              <div className="flex items-start gap-2 w-full">
                <div className="flex-shrink-0">
                  <div 
                    className="relative flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: '#F0BB1F' }}
                  >
                    <MapPin size={24} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h3 
                    className="text-left font-bold text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Choose Destination
                  </h3>
                  <p 
                    className="text-left text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.
                  </p>
                </div>
              </div>

              {/* Step 2 - Make Payment */}
              <div className="flex items-start gap-2 w-full">
                <div className="flex-shrink-0">
                  <div 
                    className="relative flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: '#EC5E39' }}
                  >
                    <CreditCard size={24} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 
                    className="text-left font-bold text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Make Payment
                  </h3>
                  <p 
                    className="text-left text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.
                  </p>
                </div>
              </div>

              {/* Step 3 - Reach Airport */}
              <div className="flex items-start gap-2 w-full">
                <div className="flex-shrink-0">
                  <div 
                    className="relative flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: '#0ABAB5' }}
                  >
                    <Calendar size={24} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h3 
                    className="text-left font-bold text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Reach Airport on Selected Date
                  </h3>
                  <p 
                    className="text-left text-base"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#0D2B29' }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Container - Mobile */}
          <div className="relative w-full max-w-xs">
            <div className="relative">
              <div 
                className="w-full relative rounded-3xl overflow-hidden bg-cover bg-center"
                style={{
                  height: '356px',
                  backgroundImage: 'url(/images/paris.jpg)'
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Stat Cards - Mobile */}
              <div 
                className="absolute bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center gap-1 px-4 py-1"
                style={{
                  top: '143px',
                  left: '-40px',
                  width: '131px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  250+
                </span>
                <span 
                  className="text-center text-xs"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  Destinations
                </span>
              </div>

              <div 
                className="absolute bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center gap-1 px-4 py-1"
                style={{
                  top: '63px',
                  left: '-40px',
                  width: '131px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  10,000+
                </span>
                <span 
                  className="text-center text-xs"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  travelers served
                </span>
              </div>

              <div 
                className="absolute bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center gap-1 px-4 py-1"
                style={{
                  top: '223px',
                  left: '-40px',
                  width: '131px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  50+
                </span>
                <span 
                  className="text-center text-xs"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  Airline partnered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div 
          className="hidden lg:flex items-stretch gap-12"
          style={{ 
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Subheading */}
            <p 
              className="text-left text-lg font-semibold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#0D2B29'
              }}
            >
              Easy and Fast
            </p>

            {/* Main Heading */}
            <h2 
              className="text-left text-5xl font-bold leading-tight"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#0D2B29',
                textTransform: 'capitalize'
              }}
            >
              Book your next trip<br />in 3 easy steps
            </h2>

            {/* Steps */}
            <div className="flex flex-col gap-12 w-full">
              {/* Step 1 - Choose Destination */}
              <div className="flex items-start gap-5" style={{ width: '395px' }}>
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="relative flex items-center justify-center"
                    style={{
                      width: '47px',
                      height: '48px',
                      backgroundColor: '#F0BB1F',
                      borderRadius: '13px'
                    }}
                  >
                    <MapPin 
                      size={24} 
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col gap-1" style={{ width: '327px' }}>
                  <h3 
                    className="text-left"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '1.245em',
                      color: '#0D2B29'
                    }}
                  >
                    Choose Destination
                  </h3>
                  <p 
                    className="text-left"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.245em',
                      color: '#0D2B29'
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetur<br />
                    adipiscing elit. Urna, tortor tempus.
                  </p>
                </div>
              </div>

              {/* Step 2 - Make Payment */}
              <div className="flex items-start gap-6 pl-12">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="relative flex items-center justify-center"
                    style={{
                      width: '47px',
                      height: '48px',
                      backgroundColor: '#EC5E39',
                      borderRadius: '13px'
                    }}
                  >
                    <CreditCard 
                      size={24} 
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 
                    className="text-center"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '1.245em',
                      color: '#0D2B29',
                      width: 'fit-content'
                    }}
                  >
                    Make Payment
                  </h3>
                  <p 
                    className="text-left"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.245em',
                      color: '#0D2B29'
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetur<br />
                    adipiscing elit. Urna, tortor tempus.
                  </p>
                </div>
              </div>

              {/* Step 3 - Reach Airport */}
              <div className="flex flex-col gap-2 pl-24">
                <div className="flex items-start gap-6" style={{ width: '395px' }}>
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div 
                      className="relative flex items-center justify-center"
                      style={{
                        width: '47px',
                        height: '48px',
                        backgroundColor: '#0ABAB5',
                        borderRadius: '13px'
                      }}
                    >
                      <Calendar 
                        size={24} 
                        className="text-white"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-1" style={{ width: '327px' }}>
                    <h3 
                      className="text-left"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '1.245em',
                      color: '#0D2B29'
                      }}
                    >
                      Reach Airport on Selected Date
                    </h3>
                    <p 
                      className="text-left"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '1.245em',
                        color: '#0D2B29'
                      }}
                    >
                      Lorem ipsum dolor sit amet, consectetur<br />
                      adipiscing elit. Urna, tortor tempus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative" style={{ width: '600px' }}>
            <div className="relative">
              {/* Main Image */}
              <div 
                className="w-full relative rounded-3xl overflow-hidden bg-cover bg-center"
                style={{
                  height: '452px',
                  backgroundImage: 'url(/images/paris.jpg)'
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* 250+ Destinations */}
              <div 
                className="absolute bg-white rounded-3xl lg:rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-2 px-4 py-2 w-48"
                style={{
                  top: '121px',
                  left: '-72px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg lg:text-2xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  250+
                </span>
                <span 
                  className="text-center text-xs lg:text-base"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  Destinations
                </span>
              </div>

              {/* 50+ Airline Partnered */}
              <div 
                className="absolute bg-white rounded-3xl lg:rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-2 px-4 py-2 w-48"
                style={{
                  top: '220px',
                  left: '-72px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg lg:text-2xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  50+
                </span>
                <span 
                  className="text-center text-xs lg:text-base"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  Airline partnered
                </span>
              </div>

              {/* 10,000+ Travelers Served */}
              <div 
                className="absolute bg-white rounded-3xl lg:rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-2 px-4 py-2 w-48"
                style={{
                  top: '319px',
                  left: '-72px',
                  boxShadow: '0px 4px 4px 0px rgba(28, 94, 89, 0.02)'
                }}
              >
                <span 
                  className="text-center font-bold text-lg lg:text-2xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0ABAB5',
                    textTransform: 'capitalize'
                  }}
                >
                  10,000+
                </span>
                <span 
                  className="text-center text-xs lg:text-base"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#0D2B29',
                    textTransform: 'capitalize'
                  }}
                >
                  travelers served
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookTripSection 