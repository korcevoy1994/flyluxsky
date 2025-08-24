"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, MapPin, Users, Minus, Plus, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { searchCitiesOnly, CitySearchResult } from '@/lib/utils';
import CustomPhoneInput from './custom-phone-input';

// Custom Calendar Component
const CustomCalendar: React.FC<{
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  minDate?: Date
}> = ({ selectedDate, onDateSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }
  
  const isDisabled = (date: Date) => {
    if (!minDate) return false
    const startOfMinDate = new Date(minDate)
    startOfMinDate.setHours(0, 0, 0, 0)
    
    return date < startOfMinDate
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  const days = getDaysInMonth(currentMonth)
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[240px] max-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0FBFA] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} className="text-[#0ABAB5]" />
        </button>
        
        <h2 className="font-poppins font-bold text-base text-[#0D2B29]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0FBFA] transition-colors cursor-pointer"
        >
          <ChevronRight size={16} className="text-[#0ABAB5]" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="h-6 flex items-center justify-center">
            <span className="font-poppins font-semibold text-xs text-gray-500 uppercase">
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, index) => (
          <div key={index} className="h-7 flex items-center justify-center">
            {date ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDisabled(date)) {
                    onDateSelect(date)
                  }
                }}
                disabled={isDisabled(date)}
                className={`
                  w-7 h-7 flex items-center justify-center rounded-lg font-poppins font-medium text-xs transition-all enabled:cursor-pointer
                  ${isSelected(date) 
                    ? 'bg-[#0ABAB5] text-white shadow-lg scale-105' 
                    : isToday(date)
                    ? 'bg-[#E8F4F8] text-[#0ABAB5] border border-[#0ABAB5]'
                    : isDisabled(date)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-[#0D2B29] hover:bg-[#F0FBFA] hover:scale-105'
                  }
                `}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-7 h-7"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HotelBookingModal({ isOpen, onClose }: HotelBookingModalProps) {
  const [formData, setFormData] = useState({
    city: "",
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    adults: 1,
    children: 0,
    name: "",
    phone: "",
    email: "",
    needsFlight: false,
    needsCruise: false
  });

  // States for city search
  const [citySelection, setCitySelection] = useState<CitySearchResult | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<CitySearchResult[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [guestDropdownPosition, setGuestDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const guestButtonRef = useRef<HTMLButtonElement | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<{top?: number; left?: number; width?: number; maxHeight?: number}>({});
  // Refs and styles for calendar popovers
  const checkInRef = useRef<HTMLDivElement | null>(null);
  const checkOutRef = useRef<HTMLDivElement | null>(null);
  const [checkInStyle, setCheckInStyle] = useState<{ top?: number; left?: number; maxHeight?: number }>({});
  const [checkOutStyle, setCheckOutStyle] = useState<{ top?: number; left?: number; maxHeight?: number }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.checkIn || !formData.checkOut) {
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/hotel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          destination: formData.city,
          checkIn: formData.checkIn?.toISOString(),
          checkOut: formData.checkOut?.toISOString(),
          guests: formData.adults + formData.children,
          adults: formData.adults,
          children: formData.children,
          rooms: 1, // Default to 1 room
          needsFlight: formData.needsFlight,
          needsCruise: formData.needsCruise,
        }),
      });

      if (response.ok) {
        console.log('Hotel booking submitted successfully');
        setSubmissionStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.text();
        console.error('Hotel booking submission failed:', response.status, errorData);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting hotel booking:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getMinCheckOutDate = () => {
    if (formData.checkIn) {
      const checkIn = new Date(formData.checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
      return checkIn;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // City search functions
  const handleCityInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, city: value }));
    setCitySelection(null);
    
    if (value.length > 0) {
      const filtered = searchCitiesOnly(value, 8);
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city: CitySearchResult) => {
    setFormData(prev => ({ ...prev, city: city.name }));
    setCitySelection(city);
    setShowCitySuggestions(false);
  };

  const handleClearCity = () => {
    setFormData(prev => ({ ...prev, city: '' }));
    setCitySelection(null);
    setCitySuggestions([]);
    setShowCitySuggestions(false);
    if (cityInputRef.current) {
      cityInputRef.current.focus();
    }
  };

  // Close calendars and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.calendar-container')) {
        setShowCheckInCalendar(false)
        setShowCheckOutCalendar(false)
      }
      if (!target.closest('.guest-selector-container')) {
        setShowGuestSelector(false)
      }
      if (!target.closest('.city-autocomplete-container')) {
        setShowCitySuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ensure portal available on client
  useEffect(() => {
    setPortalReady(true)
  }, [])

  // Recalculate dropdown position when shown or on resize/scroll
  useEffect(() => {
    if (!showGuestSelector || !guestButtonRef.current) return;
    const compute = () => {
      const rect = guestButtonRef.current!.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const buffer = 12;
      const estimatedHeight = 320;
      const spaceBelow = viewportH - rect.bottom - buffer;
      const spaceAbove = rect.top - buffer;
      const openTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      setGuestDropdownPosition(openTop ? 'top' : 'bottom');
      const top = openTop ? rect.top - Math.min(estimatedHeight, spaceAbove) - 8 : rect.bottom + 8;
      const maxHeight = openTop ? Math.max(180, spaceAbove - 16) : Math.max(180, spaceBelow - 16);
      setDropdownStyle({
        top: Math.max(8, top),
        left: rect.left,
        width: rect.width,
        maxHeight,
      });
    };
    compute();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('resize', compute, opts);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [showGuestSelector]);

  // Compute calendar popover position helpers
  useEffect(() => {
    const computeFrom = (el: HTMLElement, setStyle: (s: { top: number; left: number; maxHeight: number }) => void) => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const buffer = 12;
      const estimatedHeight = 300;
      const spaceBelow = viewportH - rect.bottom - buffer;
      const spaceAbove = rect.top - buffer;
      const openTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      const top = openTop ? rect.top - Math.min(estimatedHeight, spaceAbove) - 8 : rect.bottom + 8;
      const maxHeight = openTop ? Math.max(180, spaceAbove - 16) : Math.max(180, spaceBelow - 16);
      setStyle({ top: Math.max(8, top), left: rect.left, maxHeight });
    };

    const compute = () => {
      if (showCheckInCalendar && checkInRef.current) {
        computeFrom(checkInRef.current, (s) => setCheckInStyle(s));
      }
      if (showCheckOutCalendar && checkOutRef.current) {
        computeFrom(checkOutRef.current, (s) => setCheckOutStyle(s));
      }
    };

    compute();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('resize', compute, opts);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [showCheckInCalendar, showCheckOutCalendar]);

  const updateGuests = (type: 'adults' | 'children', operation: 'increment' | 'decrement') => {
    setFormData(prev => {
      const newValue = operation === 'increment' 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  const getTotalGuests = () => {
    return formData.adults + formData.children;
  };

  const getGuestText = () => {
    const total = getTotalGuests();
    return total === 1 ? "1 Guest" : `${total} Guests`;
  };

  const handleGuestSelectorToggle = (event: React.MouseEvent) => {
    if (!showGuestSelector) {
      // Calculate available space with more precision
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 20; // 20px buffer
      const spaceAbove = rect.top - 20; // 20px buffer
      
      // Dropdown height is approximately 320px (including padding and margins)
      const dropdownHeight = 320;
      
      // Prefer bottom position, but switch to top if insufficient space below
      // and there's more space above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setGuestDropdownPosition('top');
      } else {
        setGuestDropdownPosition('bottom');
      }
    }
    setShowGuestSelector(!showGuestSelector);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b rounded-t-2xl">
          <h2 className="font-poppins text-xl sm:text-2xl font-bold text-[#0D2B29]">Book a Hotel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)] overflow-y-auto rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-stretch rounded-b-2xl">
          {/* Booking Form */}
          <div className="w-full lg:w-1/2 bg-white lg:border-r border-gray-200">
          {/* Form Content */}
          <div className="w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="font-poppins text-xl sm:text-2xl font-bold text-[#0D2B29] mb-2">Book Your Stay</h2>
              <p className="font-poppins text-sm sm:text-base text-gray-600">Complete your reservation details</p>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                DESTINATION
              </label>
              <div className="relative group city-autocomplete-container">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-5 w-5 transition-colors group-focus-within:text-[#0D2B29] z-10" />
                <input
                  ref={cityInputRef}
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleCityInputChange(e.target.value)}
                  onFocus={() => {
                    if (formData.city.length > 0 && citySuggestions.length > 0) {
                      setShowCitySuggestions(true);
                    }
                  }}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Where would you like to stay?"
                  required
                />
                {formData.city && (
                  <button
                      type="button"
                      onClick={handleClearCity}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* City Suggestions Dropdown */}
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    {citySuggestions.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-[#0ABAB5] flex-shrink-0" />
                          <div>
                              <div className="font-medium text-[#0D2B29]">{city.name}</div>
                              <div className="text-sm text-gray-500">{city.country}</div>
                            </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          {/* Dates */}
          <div className="space-y-4 sm:space-y-6">
            <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
              TRAVEL DATES
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Check-in Date */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500 font-poppins uppercase tracking-wider">Check-in</span>
                <div className="relative calendar-container group">
                  <div 
                    className="relative cursor-pointer outline-none"
                    onClick={() => {
                      setShowCheckInCalendar(!showCheckInCalendar)
                      setShowCheckOutCalendar(false)
                    }}
                    ref={checkInRef}
                  >
                    <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-[#0D2B29]" />
                    <div className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg">
                      {formData.checkIn ? (
                        <div>
                          <div className="font-semibold">{formatDate(formData.checkIn)}</div>
                          <div className="text-xs text-gray-500 mt-1">{formData.checkIn.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select date</span>
                      )}
                    </div>
                  </div>
                  {showCheckInCalendar && (
                    portalReady && createPortal(
                      <div
                        className="fixed z-[9999] calendar-container"
                        style={{ top: checkInStyle.top, left: checkInStyle.left, maxHeight: checkInStyle.maxHeight }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomCalendar
                          selectedDate={formData.checkIn}
                          onDateSelect={(date) => {
                            setFormData(prev => ({ ...prev, checkIn: date }));
                            if (formData.checkOut && date >= formData.checkOut) {
                              setFormData(prev => ({ ...prev, checkOut: null }));
                            }
                            setShowCheckInCalendar(false);
                          }}
                          minDate={new Date()}
                        />
                      </div>,
                      document.body
                    )
                  )}
                </div>
              </div>
              
              {/* Check-out Date */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500 font-poppins uppercase tracking-wider">Check-out</span>
                <div className="relative calendar-container group">
                  <div 
                    className="relative cursor-pointer outline-none"
                    onClick={() => {
                      setShowCheckOutCalendar(!showCheckOutCalendar)
                      setShowCheckInCalendar(false)
                    }}
                    ref={checkOutRef}
                  >
                    <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-[#0D2B29]" />
                    <div className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg">
                      {formData.checkOut ? (
                        <div>
                          <div className="font-semibold">{formatDate(formData.checkOut)}</div>
                          <div className="text-xs text-gray-500 mt-1">{formData.checkOut.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select date</span>
                      )}
                    </div>
                  </div>
                  {showCheckOutCalendar && (
                    portalReady && createPortal(
                      <div
                        className="fixed z-[9999] calendar-container"
                        style={{ top: checkOutStyle.top, left: checkOutStyle.left, maxHeight: checkOutStyle.maxHeight }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomCalendar
                          selectedDate={formData.checkOut}
                          onDateSelect={(date) => {
                            setFormData(prev => ({ ...prev, checkOut: date }));
                            setShowCheckOutCalendar(false);
                          }}
                          minDate={getMinCheckOutDate()}
                        />
                      </div>,
                      document.body
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="relative guest-selector-container">
            <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide mb-2">
              GUESTS
            </label>
            <div className="relative group">
              <Users className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-[#0D2B29]" />
              <button
                type="button"
                ref={guestButtonRef}
                onClick={handleGuestSelectorToggle}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-semibold text-left">
                      {getGuestText()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-left">
                      {formData.adults} {formData.adults === 1 ? 'Adult' : 'Adults'}
                      {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? 'Child' : 'Children'}`}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>

            {/* Guest Selector Dropdown (portal) */}
            {showGuestSelector && portalReady && createPortal(
              <div
                className="fixed bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl shadow-xl z-[1000] p-4 sm:p-6 space-y-4 sm:space-y-6 backdrop-blur-sm guest-selector-container overflow-y-auto"
                style={{
                  top: dropdownStyle.top,
                  left: dropdownStyle.left,
                  width: dropdownStyle.width,
                  maxHeight: dropdownStyle.maxHeight,
                  animation: 'fadeInScale 200ms ease-out forwards'
                }}
              >
                <h3 className="font-poppins font-bold text-[#0D2B29] text-base sm:text-lg mb-2">Number of Guests</h3>

                {/* Adults */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-poppins font-semibold text-[#0D2B29] text-lg">Adults</div>
                    <div className="font-poppins text-xs text-gray-500 mt-1">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => updateGuests('adults', 'decrement')}
                      className="w-10 h-10 rounded-full bg-gray-100 text-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
                      disabled={formData.adults <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-poppins font-bold text-xl text-[#0D2B29]">{formData.adults}</span>
                    <button
                      type="button"
                      onClick={() => updateGuests('adults', 'increment')}
                      className="w-10 h-10 rounded-full bg-gray-100 text-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Children */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-poppins font-semibold text-[#0D2B29] text-lg">Children</div>
                    <div className="font-poppins text-xs text-gray-500 mt-1">Ages 2-12</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => updateGuests('children', 'decrement')}
                      className="w-10 h-10 rounded-full bg-gray-100 text-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
                      disabled={formData.children <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-poppins font-bold text-xl text-[#0D2B29]">{formData.children}</span>
                    <button
                      type="button"
                      onClick={() => updateGuests('children', 'increment')}
                      className="w-10 h-10 rounded-full bg-gray-100 text-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGuestSelector(false)}
                    className="w-full bg-gradient-to-r from-[#0ABAB5] to-[#0ABAB5]/90 text-white py-4 rounded-2xl font-poppins font-semibold hover:from-[#0ABAB5]/90 hover:to-[#0ABAB5] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Apply Selection
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Additional Services */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
              ADDITIONAL SERVICES
            </label>
            <div className="space-y-3">
              {/* Flight Checkbox */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.needsFlight}
                      onChange={(e) => setFormData(prev => ({ ...prev, needsFlight: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      formData.needsFlight
                        ? 'bg-[#0ABAB5] border-[#0ABAB5]'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.needsFlight && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-poppins text-sm font-medium text-[#0D2B29]">
                    I need flight arrangements
                  </span>
                </label>
              </div>
              
              {/* Cruise Checkbox */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.needsCruise}
                      onChange={(e) => setFormData(prev => ({ ...prev, needsCruise: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      formData.needsCruise
                        ? 'bg-[#0ABAB5] border-[#0ABAB5]'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.needsCruise && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-poppins text-sm font-medium text-[#0D2B29]">
                    I'm interested in cruise packages
                  </span>
                </label>
              </div>
            </div>
          </div>

          </div>

          </div>

          {/* Contact Information */}
          <div className="w-full lg:w-1/2 bg-white">
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Contact Information Header */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#0D2B29] font-poppins mb-2">Contact Details</h3>
                <p className="text-gray-600 font-poppins text-xs sm:text-sm">We'll use this information to confirm your booking</p>
              </div>
              
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                  PHONE NUMBER
                </label>
                <CustomPhoneInput
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  autoFocus={false}
                  onValidationChange={(isValid) => console.log('Phone validation:', isValid)}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-poppins font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                    submissionStatus === 'success'
                      ? 'bg-green-500 text-white'
                      : submissionStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#0ABAB5] to-[#0ABAB5]/90 text-white hover:from-[#0ABAB5]/90 hover:to-[#0ABAB5] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>
                      {submissionStatus === 'success'
                        ? 'Booking Submitted!'
                        : submissionStatus === 'error'
                        ? 'Error - Try Again'
                        : isSubmitting
                        ? 'Submitting...'
                        : 'Complete Booking'}
                    </span>
                    {!isSubmitting && (
                      <div className="w-5 sm:w-6 h-5 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm">
                          {submissionStatus === 'success' ? '✓' : submissionStatus === 'error' ? '✗' : '→'}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
                <p className="text-center text-xs text-gray-500 font-poppins mt-3">
                  By submitting my details, I agree to be contacted regarding my travel plans. See our{' '}
                  <a href="/privacy" className="text-[#0ABAB5] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
            </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}