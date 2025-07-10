'use client';

import React, { useState } from 'react';
import Image from "next/legacy/image";

const popularDestinations = [
  { 
    city: 'London', 
    country: 'United Kingdom',
    flights: [
      { from: 'Paris', to: 'London', savings: 977 },
      { from: 'Lyon', to: 'London', savings: 977 },
      { from: 'Marseille', to: 'London', savings: 977 },
    ]
  },
  { city: 'Paris', country: 'France', flights: [] },
  { city: 'Rome', country: 'Italy', flights: [] },
  { city: 'Tokyo', country: 'Japan', flights: [] },
  { city: 'Seoul', country: 'South Korea', flights: [] },
  { city: 'Bangkok', country: 'Thailand', flights: [] },
  { city: 'Nassau', country: 'Bahamas', flights: [] },
  { city: 'Punta Cana', country: 'Dominican Republic', flights: [] },
  { city: 'Dubai', country: 'UAE', flights: [] },
  { city: 'Cancún', country: 'Mexico', flights: [] },
  { city: 'Sydney', country: 'Australia', flights: [] },
  { city: 'Auckland', country: 'New Zealand', flights: [] },
];

const topAirlines = [
  'Singapore Airlines', 'Lufthansa Airlines', 'American Airlines', 'Emirates Airlines',
  'Nippon Airways', 'Qantas Airways', 'Turkish Airlines'
];

const topCountries = [
  'United Arab Emirates Business Class Flights', 'United Kingdom Business Class Flights',
  'Netherlands Business Class Flights', 'Singapore Business Class Flights',
  'Germany Business Class Flights', 'Australia Business Class Flights',
  'Portugal Business Class Flights'
];

const topCities = [
  'Amsterdam Business Class Flights', 'Singapore Business Class Flights',
  'Barcelona Business Class Flights', 'Frankfurt Business Class Flights',
  'Istanbul Business Class Flights', 'London Business Class Flights',
  'Sydney Business Class Flights'
];

const socialLinks = [
  { name: 'instagram', icon: '/icons/footer/instagram.svg' },
  { name: 'facebook', icon: '/icons/footer/facebook.svg' },
  { name: 'twitter', icon: '/icons/footer/twitter.svg' },
];

const paymentMethods = [
  { name: 'mastercard', logo: '/logos/payment/mastercard.svg' },
  { name: 'discover', logo: '/logos/payment/discover.svg' },
  { name: 'generic-card', logo: '/logos/payment/generic-card.svg' },
  { name: 'amex', logo: '/logos/payment/amex.svg' },
  { name: 'visa', logo: '/logos/payment/visa.svg' },
];

const DestinationAccordion = ({ dest, isOpen, onToggle }: { dest: typeof popularDestinations[0], isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200/50 shadow-sm transition-all duration-300 ${isOpen ? 'pb-4' : ''}`}>
      <button 
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <p className="font-poppins font-normal text-sm text-[#0D2B29]">{dest.city}</p>
          <p className="font-poppins text-sm text-[#1C5E59]">{dest.country}</p>
        </div>
        <Image 
          src="/icons/footer/chevron-down.svg" 
          alt="chevron" 
          width={12} 
          height={7} 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && dest.flights.length > 0 && (
        <div className="px-4 pt-2 space-y-2">
          {dest.flights.map((flight, index) => (
            <a href="#" key={index} className="flex justify-between items-center text-xs hover:bg-gray-100 p-2 rounded-lg">
              <span className="text-[#0D2B29]">{flight.from} – {flight.to}</span>
              <span className="text-[#1C5E59]">save up to ${flight.savings}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}


const Footer = () => {
  const [openDestination, setOpenDestination] = useState<string | null>(null);

  return (
    <footer className="relative bg-white text-[#0D2B29] pt-12 overflow-hidden font-poppins">
      <Image
        src="/images/footer-bg.png"
        alt="Footer background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 opacity-10 z-0"
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Popular Destinations */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold uppercase text-[#033836] mb-6 tracking-wide">popular destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {popularDestinations.map(dest => (
              <DestinationAccordion 
                key={dest.city} 
                dest={dest}
                isOpen={openDestination === dest.city}
                onToggle={() => setOpenDestination(prev => prev === dest.city ? null : dest.city)}
              />
            ))}
          </div>
        </section>

        {/* Contact Info & Links */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-8 lg:flex lg:flex-col lg:items-start lg:space-y-8 lg:gap-0">
              <ContactMethod icon="/icons/footer/whatsapp.svg" title="WhatsApp" description="Start a Conversation" href="#" iconBgColor="bg-green-100" />
              <ContactMethod icon="/icons/footer/phone.svg" title="Call us 24/7" description="+1 (888) 830-7444" href="tel:+18888307444" />
              <ContactMethod icon="/icons/footer/mail.svg" title="E-mail" description="support@luxeskies.com" href="mailto:support@luxeskies.com" />
              <ContactMethod icon="/icons/footer/map-pin.svg" title="Address" description="Saint Petersburg, Florida" />
            </div>
          </div>

          {/* Link Lists - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:col-span-3 gap-8">
            <LinkList title="top airlines" links={topAirlines} />
            <LinkList title="top countries" links={topCountries} />
            <LinkList title="top cities" links={topCities} />
          </div>
        </section>

        <hr className="border-black/10 my-8" />

        {/* Main Footer */}
        <section className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 py-6">
            <div className='flex flex-col items-center md:items-start gap-6 max-w-xs'>
                <h3 className="text-2xl font-bold text-[#0ABAB5] font-ubuntu lowercase">flyLUXsky</h3>
                <div className="flex space-x-3">
                    {socialLinks.map(social => (
                        <a key={social.name} href="#" className="bg-[#F8F8F8] hover:bg-gray-200 p-2 rounded-lg transition-colors">
                            <Image src={social.icon} alt={social.name} width={20} height={20} />
                        </a>
                    ))}
                </div>
            </div>

            <div className="text-center text-xs text-[#0D2B29]/90 max-w-3xl flex-1">
                <p>
                    All prices are in USD, including taxes, fees, and surcharges, based on seat availability in the cheapest booking inventory. Availability is limited, not guaranteed, and subject to restrictions like advance booking, stay durations, weekday travel, seasonal variations, and blackout dates. More flexible fares are available at higher prices—contact our travel managers for details. Fares are nonrefundable, nonexchangeable, nontransferable, and rules may change without notice. Prices for Europe, Africa, Middle East, and India are from US east coast hubs (e.g., New York, Washington, Boston); for Asia and Oceania, from west coast hubs (e.g., Seattle, San Francisco, Los Angeles). Savings up to 70% off are from full unrestricted airline fares and vary by fare rules, departure, destination, dates, duration, and season.
                </p>
            </div>

            <div className="space-y-2 text-center md:text-left">
                <a href="#" className="block bg-white py-2 px-4 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors border border-gray-200/80 text-center text-[#0D2B29]">Reviews</a>
                <a href="#" className="block bg-white py-2 px-4 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors border border-gray-200/80 text-center text-[#0D2B29]">Contacts</a>
            </div>
        </section>

        {/* Bottom Bar */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 mt-8 border-t border-black/10">
            <div className="text-sm text-black/75 order-2 md:order-1 text-center md:text-left">© 2025 FlyLuxSky . All rights reserved.</div>
            
            <div className="flex items-center gap-4 order-1 md:order-2">
                {paymentMethods.map(method => (
                    <div key={method.name} className="relative h-6 w-12 flex items-center justify-center">
                        <Image src={method.logo} alt={method.name} layout="fill" objectFit="contain" />
                    </div>
                ))}
            </div>

            <div className="flex gap-4 text-sm uppercase text-black font-medium order-3">
                <a href="#" className="hover:text-black/70 transition-colors">Privacy policy</a>
                <a href="#" className="hover:text-black/70 transition-colors">Terms of Use</a>
            </div>
        </section>
      </div>
    </footer>
  );
};

const ContactMethod = ({ icon, title, description, href, iconBgColor = 'bg-transparent' }: { icon: string, title: string, description: string, href?: string, iconBgColor?: string }) => {
    const descriptionClasses = "text-sm text-[#1C5E59]";
    const descriptionContent = href ? (
        <a href={href} className={`${descriptionClasses} underline hover:text-[#033836]`}>{description}</a>
    ) : (
        <p className={descriptionClasses}>{description}</p>
    );

    return (
        <div className="flex flex-col items-center text-center gap-2 lg:flex-row lg:text-left lg:items-start lg:gap-3">
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${iconBgColor}`}>
                <Image src={icon} alt={title} width={24} height={24} />
            </div>
            <div>
                <h4 className="text-base text-[#0D2B29]">{title}</h4>
                {descriptionContent}
            </div>
        </div>
    );
};

const LinkList = ({ title, links }: { title: string, links: string[] }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold uppercase text-[#033836] tracking-wide">{title}</h3>
        <ul className="space-y-2">
            {links.map(link => (
                <li key={link}>
                    <a href="#" className="text-sm text-[#0D2B29]/75 hover:text-[#0D2B29] transition-colors leading-tight block">
                        {link}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);


export default Footer; 