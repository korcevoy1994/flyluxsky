'use client'

import { Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "./ui/arrow-right-icon"


const NAVBAR_PHONE = "+1 888 830 7444"

interface NavbarProps {
  isDarkBackground?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkBackground = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)


  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  // Smooth close with slight delay for better UX
  const handleSmoothMenuClose = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="w-full px-2 pt-6 pb-2 flex items-center justify-between rounded-3xl max-w-[1280px] mx-auto relative z-50 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center select-none cursor-pointer" tabIndex={0} aria-label="fls logo">
          <Image 
            src={isMenuOpen || !isDarkBackground ? "/logos/fls-teal.svg" : "/logos/fls.svg"}
            alt="FLS Logo" 
            width={90} 
            height={60} 
            className="w-[70px] h-[47px] sm:w-[90px] sm:h-[60px]"
            style={{height: 'auto'}}
            priority
          />
        </Link>
        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Phone CTA */}
          <Button
            variant="default"
            className="flex items-center gap-2 px-5 py-3 bg-[#D44A26] text-white font-bold text-[14px] font-poppins uppercase leading-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#D44A26] cursor-pointer transition-all duration-200 hover:brightness-95"
            tabIndex={0}
            aria-label={`Call us at ${NAVBAR_PHONE}`}
            onClick={() => window.open(`tel:${NAVBAR_PHONE}`, '_self')}
          >
            <Phone size={16} />
            <span>{NAVBAR_PHONE}</span>
          </Button>
          {/* Menu button */}
          <button
            onClick={handleMenuClick}
            tabIndex={0}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] group cursor-pointer"
          >
            {isMenuOpen ? (
              <X size={20} className="text-[#0ABAB5]" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded"></span>
                <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded"></span>
                <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded"></span>
              </div>
            )}
            <span className="font-bold text-[14px] font-poppins uppercase text-[#0ABAB5]">MENU</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={(e) => {
          // Close menu if clicking on the overlay background
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div 
          className={`flex flex-col h-full transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            e.currentTarget.dataset.startY = touch.clientY.toString();
          }}
          onTouchEnd={(e) => {
            const startY = parseFloat(e.currentTarget.dataset.startY || '0');
            const endY = e.changedTouches[0].clientY;
            const deltaY = endY - startY;
            
            // Close menu if swiped down more than 100px
            if (deltaY > 100) {
              setIsMenuOpen(false);
            }
          }}
        >
          {/* Top spacing for navbar */}
          <div className="h-20 sm:h-24 flex-shrink-0"></div>
          
          {/* Divider */}
          <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 flex-shrink-0">
            <div className="border-t border-[#E5E5E5]"></div>
          </div>
          
          {/* Scrollable Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row max-w-[1280px] mx-auto w-full min-h-full">
            {/* Left Side - Navigation */}
            <div className="flex-1 flex flex-col justify-start px-4 sm:px-8 py-6 sm:py-8 lg:border-r border-[#E5E5E5]">
                <nav className="space-y-4 sm:space-y-6">
                    {/* Main Navigation Items */}
                    <div className="space-y-2 sm:space-y-4">
                        <Link href="/#best-deal-of-the-day" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-2 border-b border-transparent group-hover:border-[#0ABAB5]/20 transition-all duration-300">
                                <span className="font-bold text-[24px] sm:text-[32px] lg:text-[40px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300 transform group-hover:translate-x-2">
                                    BEST DEALS
                                </span>
                                <div className="ml-2 sm:ml-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/all-airlines" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-2 border-b border-transparent group-hover:border-[#0ABAB5]/20 transition-all duration-300">
                                <span className="font-bold text-[24px] sm:text-[32px] lg:text-[40px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300 transform group-hover:translate-x-2">
                                    TOP AIRLINES
                                </span>
                                <div className="ml-2 sm:ml-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/top-cities" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-2 border-b border-transparent group-hover:border-[#0ABAB5]/20 transition-all duration-300">
                                <span className="font-bold text-[24px] sm:text-[32px] lg:text-[40px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300 transform group-hover:translate-x-2">
                                    TOP CITIES
                                </span>
                                <div className="ml-2 sm:ml-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/top-countries" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-2 border-b border-transparent group-hover:border-[#0ABAB5]/20 transition-all duration-300">
                                <span className="font-bold text-[24px] sm:text-[32px] lg:text-[40px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300 transform group-hover:translate-x-2">
                                    TOP COUNTRIES
                                </span>
                                <div className="ml-2 sm:ml-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </Link>
                    </div>
                    
                    {/* Secondary Navigation */}
                    <div className="pt-4 space-y-2 border-t border-[#E5E5E5]/50">
                        <Link href="/reviews" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-1">
                                <span className="font-semibold text-[16px] sm:text-[20px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300">
                                    REVIEWS
                                </span>
                                <div className="ml-2 transition-all duration-300 group-hover:translate-x-1 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/contact" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-1">
                                <span className="font-semibold text-[16px] sm:text-[20px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300">
                                    CONTACT
                                </span>
                                <div className="ml-2 transition-all duration-300 group-hover:translate-x-1 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/faq" onClick={handleMenuClose} className="group block cursor-pointer">
                            <div className="flex items-center justify-between py-1">
                                <span className="font-semibold text-[16px] sm:text-[20px] font-poppins uppercase text-[#2C3E50] leading-tight tracking-tight group-hover:text-[#0ABAB5] transition-all duration-300">
                                    FAQ
                                </span>
                                <div className="ml-2 transition-all duration-300 group-hover:translate-x-1 text-[#2C3E50] group-hover:text-[#0ABAB5]">
                                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Right Side - Contact Info */}
            <div className="flex-1 flex flex-col justify-between items-start text-left px-4 sm:px-8 py-4 sm:py-6 border-t lg:border-t-0 lg:border-l border-[#E5E5E5]">
              <div className="space-y-4">
                {/* Phone */}
                <div className="space-y-1">
                  <div className="flex items-center justify-start gap-2">
                    <Phone size={16} className="sm:w-5 sm:h-5 text-[#EC5E39]" />
                    <span className="font-bold text-[12px] sm:text-[14px] font-poppins text-[#2C3E50]">Call us 24/7</span>
                  </div>
                  <a href="tel:+18888307444" className="block text-[20px] sm:text-[24px] font-normal font-poppins text-[#2C3E50] transition-all duration-300 cursor-pointer hover:[text-shadow:0_0_0.5px_#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:ring-offset-2 rounded">
                    +1 (888) 830-7444
                  </a>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <div className="flex items-center justify-start gap-2">
                    <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33333 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5.00001C1.66667 4.08334 2.41667 3.33334 3.33333 3.33334Z" stroke="#EC5E39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.3333 5L10 10.8333L1.66667 5" stroke="#EC5E39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-bold text-[12px] sm:text-[14px] font-poppins text-[#2C3E50]">E-mail</span>
                  </div>
                  <a href="mailto:support@luxeskies.com" className="block text-[16px] sm:text-[18px] font-normal font-poppins text-[#2C3E50] transition-all duration-300 cursor-pointer hover:[text-shadow:0_0_0.5px_#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:ring-offset-2 rounded">
                    support@luxeskies.com
                  </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-start gap-2 sm:gap-3 pt-2">
                  <a href="#" className="cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:ring-offset-2 rounded" aria-label="Facebook">
                    <svg width="28" height="28" className="sm:w-8 sm:h-8" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="30" rx="8" fill="#F8F8F8"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.6075 22V16.5785H19.4275L19.6998 14.4659H17.6068V13.117C17.6068 12.5052 17.7769 12.088 18.6547 12.088H19.7733V10.198C19.2316 10.1398 18.6871 10.1118 18.1423 10.114C16.5295 10.114 15.4256 11.0989 15.4256 12.907V14.4659H13.6V16.5785H15.4249V22H8.7728C8.3458 22 8 21.6542 8 8.7728V21.2272C8 21.6542 8.3458 22 8.7728 22H21.2272C21.6542 22 22 21.6542 22 21.2272V8.7728C22 8.3458 21.6542 8 21.2272 8H8.7728C8.3458 8 8 8.3458 8 8.7728V21.2272C8 21.6542 8.3458 22 8.7728 22H17.6075Z" fill="#0D2B29"/>
                    </svg>
                  </a>
                  <a href="#" className="cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:ring-offset-2 rounded" aria-label="Twitter">
                    <svg width="28" height="28" className="sm:w-8 sm:h-8" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="30" rx="8" fill="#F8F8F8"/>
                      <mask id="mask0_638_7318" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="8" y="8" width="14" height="14">
                        <path d="M8 8H22V22H8V8Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask0_638_7318)">
                        <path d="M19.025 8.65601H21.172L16.482 14.03L22 21.344H17.68L14.294 16.909L10.424 21.344H8.275L13.291 15.594L8 8.65701H12.43L15.486 12.71L19.025 8.65601ZM18.27 20.056H19.46L11.78 9.87701H10.504L18.27 20.056Z" fill="#0D2B29"/>
                      </g>
                    </svg>
                  </a>
                  <a href="#" className="cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:ring-offset-2 rounded" aria-label="Instagram">
                    <svg width="28" height="28" className="sm:w-8 sm:h-8" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="30" rx="8" fill="#F8F8F8"/>
                      <path d="M15.7196 8C16.5071 8.0021 16.9067 8.0063 17.2518 8.0161L17.3876 8.021C17.5444 8.0266 17.6991 8.0336 17.886 8.042C18.6308 8.077 19.1389 8.1946 19.5848 8.36749C20.0468 8.54529 20.436 8.78608 20.8252 9.17457C21.1812 9.52438 21.4566 9.94768 21.6322 10.4149C21.8051 10.8608 21.9227 11.369 21.9577 12.1145C21.9661 12.3007 21.9731 12.4554 21.9787 12.6129L21.9829 12.7487C21.9934 13.0931 21.9976 13.4928 21.999 14.2802L21.9997 14.8024V15.7194C22.0014 16.23 21.996 16.7406 21.9836 17.251L21.9794 17.3868C21.9738 17.5443 21.9668 17.699 21.9584 17.8852C21.9234 18.6306 21.8044 19.1381 21.6322 19.5847C21.4566 20.052 21.1812 20.4753 20.8252 20.8251C20.4754 21.1812 20.0521 21.4566 19.5848 21.6322C19.1389 21.8051 18.6308 21.9227 17.886 21.9577L17.3876 21.9787L17.2518 21.9829C16.9067 21.9927 16.5071 21.9976 15.7196 21.999L15.1974 21.9997H14.2812C13.7704 22.0015 13.2596 21.9961 12.749 21.9836L12.6132 21.9794C12.447 21.9731 12.2809 21.9658 12.1148 21.9577C11.37 21.9227 10.8619 21.8051 10.4153 21.6322C9.94828 21.4565 9.52523 21.1811 9.17564 20.8251C8.81932 20.4754 8.54365 20.052 8.36788 19.5847C8.19499 19.1388 8.07739 18.6306 8.0424 17.8852L8.0214 17.3868L8.0179 17.251C8.00499 16.7406 7.99916 16.23 8.0004 15.7194V14.2802C7.99846 13.7697 8.00359 13.2591 8.0158 12.7487L8.0207 12.6129C8.0263 12.4554 8.0333 12.3007 8.0417 12.1145C8.07669 11.369 8.19429 10.8615 8.36718 10.4149C8.54336 9.94749 8.81951 9.52417 9.17634 9.17457C9.52573 8.81866 9.94853 8.54324 10.4153 8.36749C10.8619 8.1946 11.3693 8.077 12.1148 8.042C12.301 8.0336 12.4564 8.0266 12.6132 8.021L12.749 8.0168C13.2594 8.00436 13.7699 7.999 14.2805 8.0007L15.7196 8ZM15 11.4999C14.0718 11.4999 13.1816 11.8687 12.5253 12.525C11.869 13.1814 11.5002 14.0716 11.5002 14.9998C11.5002 15.9281 11.869 16.8183 12.5253 17.4746C13.1816 18.131 14.0718 18.4997 15 18.4997C15.9283 18.4997 16.8184 18.131 17.4748 17.4746C18.1311 16.8183 18.4999 15.9281 18.4999 14.9998C18.4999 14.0716 18.1311 13.1814 17.4748 12.525C16.8184 11.8687 15.9283 11.4999 15 11.4999ZM15 12.8999C15.2758 12.8998 15.5489 12.9541 15.8037 13.0596C16.0585 13.1651 16.29 13.3197 16.485 13.5147C16.68 13.7097 16.8347 13.9411 16.9403 14.1959C17.0459 14.4507 17.1002 14.7237 17.1003 14.9995C17.1003 15.2753 17.0461 15.5483 16.9406 15.8031C16.8351 16.0579 16.6805 16.2894 16.4855 16.4845C16.2905 16.6795 16.0591 16.8342 15.8043 16.9398C15.5496 17.0454 15.2765 17.0997 15.0007 17.0998C14.4438 17.0998 13.9097 16.8785 13.5159 16.4847C13.1221 16.0909 12.9009 15.5568 12.9009 14.9998C12.9009 14.4429 13.1221 13.9088 13.5159 13.5149C13.9097 13.1211 14.4438 12.8999 15.0007 12.8999M18.6756 10.4499C18.4435 10.4499 18.221 10.5421 18.0569 10.7062C17.8928 10.8703 17.8006 11.0929 17.8006 11.3249C17.8006 11.557 17.8928 11.7795 18.0569 11.9436C18.221 12.1077 18.4435 12.1999 18.6756 12.1999C18.9076 12.1999 19.1302 12.1077 19.2942 11.9436C19.4583 11.7795 19.5505 11.557 19.5505 11.3249C19.5505 11.0929 19.4583 10.8703 19.2942 10.7062C19.1302 10.5421 18.9076 10.4499 18.6756 10.4499Z" fill="#0D2B29"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <div className="pt-4 sm:pt-6">
                  <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4">
                    <Image src="/icons/logo-white 1.svg" alt="Trustpilot" width={70} height={18} className="sm:w-[90px] sm:h-[23px]" style={{height: 'auto'}} />
                    <Image src="/icons/cdnlogo.com_discover 1.svg" alt="Discover" width={60} height={11} className="sm:w-[80px] sm:h-[14px]" style={{height: 'auto'}} />
                    <Image src="/icons/mas.svg" alt="Mastercard" width={30} height={18} className="sm:w-[40px] sm:h-[24px]" style={{height: 'auto'}} />
                    <Image src="/icons/American-Express-logo.svg" alt="American Express" width={55} height={19} className="sm:w-[70px] sm:h-[24px]" style={{height: 'auto'}} />
                    <Image src="/icons/Visa_2021.svg" alt="Visa" width={35} height={12} className="sm:w-[45px] sm:h-[15px]" style={{height: 'auto'}} />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <p className="text-[10px] sm:text-[12px] lg:text-[14px] text-[#7A7A7A] font-poppins">
                      © 2025 FlyLuxSky. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </>
  )
}

export default Navbar