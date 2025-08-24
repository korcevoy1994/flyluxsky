"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, MapPin, Users, Minus, Plus, ChevronDown, Ship, ChevronLeft, ChevronRight } from "lucide-react";
import CustomPhoneInput from './custom-phone-input';

// Custom Calendar Component
const CustomCalendar: React.FC<{
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  minDate?: Date
}> = ({ selectedDate, onDateSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    return date < today;
  };
  
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const todayClass = isToday(date);
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 enabled:cursor-pointer ${
            selected
              ? 'bg-[#0ABAB5] text-white shadow-md'
              : disabled
              ? 'text-gray-300 cursor-not-allowed'
              : todayClass
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80 animate-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

interface CruiseBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const regions = [
  "Caribbean",
  "Mediterranean",
  "Northern Europe",
  "Alaska",
  "Asia",
  "Australia & New Zealand",
  "South Pacific",
  "South America",
  "Africa",
  "Middle East",
  "Transatlantic",
  "World Cruises"
];

const cruiseLines = [
  "Royal Caribbean International",
  "Carnival Cruise Line",
  "Norwegian Cruise Line (NCL)",
  "MSC Cruises",
  "Princess Cruises",
  "Celebrity Cruises",
  "Costa Cruises",
  "Holland America Line",
  "Disney Cruise Line",
  "Oceania Cruises",
  "Cunard Line",
  "Seabourn Cruise Line",
  "Azamara",
  "Virgin Voyages",
  "Regent Seven Seas Cruises",
  "Silversea Cruises",
  "Crystal Cruises",
  "Ponant",
  "Windstar Cruises"
];

export default function CruiseBookingModal({ isOpen, onClose }: CruiseBookingModalProps) {
  const [formData, setFormData] = useState({
    region: '',
    cruiseLine: '',
    departure: null as Date | null,
    nights: 7,
    adults: 2,
    children: 0,
    name: '',
    email: '',
    phone: '',
    needsFlight: false,
    needsHotel: false
  });

  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showCruiseLineDropdown, setShowCruiseLineDropdown] = useState(false);
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [guestDropdownPosition, setGuestDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [calendarPosition, setCalendarPosition] = useState<'bottom' | 'top'>('bottom');
  const [portalReady, setPortalReady] = useState(false);
  const [departureStyle, setDepartureStyle] = useState({ top: 0, left: 0, maxHeight: 400 });
  const [dropdownStyle, setDropdownStyle] = useState<{top?: number; left?: number; width?: number; maxHeight?: number}>({});
  
  const departureRef = useRef<HTMLDivElement>(null);
  const guestButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.cruiseLine || !formData.region || !formData.departure) {
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/cruise-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            cruiseLine: formData.cruiseLine,
            region: formData.region,
            departureDate: formData.departure,
            nights: formData.nights,
            adults: formData.adults,
            children: formData.children,
            needsFlight: formData.needsFlight,
            needsHotel: formData.needsHotel,
          }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting cruise booking:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNightsChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      nights: increment 
        ? Math.min(prev.nights + 1, 30)
        : Math.max(prev.nights - 1, 1)
    }));
  };

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
    return total === 1 ? "1 Passenger" : `${total} Passengers`;
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

  // Handle clicks outside dropdowns and calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (!target.closest('.calendar-container') && !target.closest('[data-calendar-trigger]')) {
        setShowDepartureCalendar(false);
      }
      
      if (!target.closest('.region-dropdown')) {
        setShowRegionDropdown(false);
      }
      
      if (!target.closest('.cruise-line-dropdown')) {
        setShowCruiseLineDropdown(false);
      }
      
      if (!target.closest('.guest-selector-container')) {
        setShowGuestSelector(false);
      }
    };

    if (showDepartureCalendar || showRegionDropdown || showCruiseLineDropdown || showGuestSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDepartureCalendar, showRegionDropdown, showCruiseLineDropdown, showGuestSelector]);

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

  // ensure portal available on client
  useEffect(() => {
    setPortalReady(true)
  }, [])

  // Calculate calendar position
  useEffect(() => {
    const computeFrom = (element: HTMLElement, setStyle: (style: { top: number; left: number; maxHeight: number }) => void) => {
      const rect = element.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const buffer = 20;
      const estimatedHeight = 400;
      const spaceBelow = viewportH - rect.bottom - buffer;
      const spaceAbove = rect.top - buffer;
      const openTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      const top = openTop ? rect.top - Math.min(estimatedHeight, spaceAbove) - 8 : rect.bottom + 8;
      const maxHeight = openTop ? Math.max(180, spaceAbove - 16) : Math.max(180, spaceBelow - 16);
      setStyle({ top: Math.max(8, top), left: rect.left, maxHeight });
    };

    const compute = () => {
      if (showDepartureCalendar && departureRef.current) {
        computeFrom(departureRef.current, (s) => setDepartureStyle(s));
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
  }, [showDepartureCalendar]);

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
          <h2 className="font-poppins text-xl sm:text-2xl font-bold text-[#0D2B29]">Book a Cruise</h2>
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
                  <h2 className="font-poppins text-xl sm:text-2xl font-bold text-[#0D2B29] mb-2">Book Your Cruise</h2>
                  <p className="font-poppins text-sm sm:text-base text-gray-600">Complete your cruise reservation details</p>
                </div>

                {/* Region Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                    REGION
                  </label>
                  <div className="relative region-dropdown">
                    <button
                      type="button"
                      onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-[#0ABAB5]" />
                        <span className={formData.region ? "text-[#0D2B29]" : "text-gray-400"}>
                          {formData.region || "Select region"}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transition-transform duration-200 ${showRegionDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showRegionDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {regions.map((region) => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, region }));
                              setShowRegionDropdown(false);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 font-poppins text-sm sm:text-base text-[#0D2B29] transition-colors duration-200 cursor-pointer"
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cruise Line Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                    CRUISE LINE
                  </label>
                  <div className="relative cruise-line-dropdown">
                    <button
                      type="button"
                      onClick={() => setShowCruiseLineDropdown(!showCruiseLineDropdown)}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Ship className="w-4 sm:w-5 h-4 sm:h-5 text-[#0ABAB5]" />
                        <span className={formData.cruiseLine ? "text-[#0D2B29]" : "text-gray-400"}>
                          {formData.cruiseLine || "Select cruise line"}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transition-transform duration-200 ${showCruiseLineDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCruiseLineDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {cruiseLines.map((line) => (
                          <button
                            key={line}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, cruiseLine: line }));
                              setShowCruiseLineDropdown(false);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 font-poppins text-sm sm:text-base text-[#0D2B29] transition-colors duration-200 cursor-pointer"
                          >
                            {line}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Departure */}
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                     DEPARTURE
                   </label>
                   <div className="relative calendar-container group">
                     <div 
                       className="relative cursor-pointer outline-none"
                       onClick={() => {
                         setShowDepartureCalendar(!showDepartureCalendar)
                       }}
                       ref={departureRef}
                       data-calendar-trigger
                     >
                       <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-[#0D2B29]" />
                       <div className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg">
                         {formData.departure ? (
                           <div>
                             <div className="font-semibold">{formatDate(formData.departure)}</div>
                             <div className="text-xs text-gray-500 mt-1">{formData.departure.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                           </div>
                         ) : (
                           <span className="text-gray-400">Select departure date</span>
                         )}
                       </div>
                     </div>
                     {showDepartureCalendar && (
                       portalReady && createPortal(
                         <div
                           className="fixed z-[9999] calendar-container"
                           style={{ top: departureStyle.top, left: departureStyle.left, maxHeight: departureStyle.maxHeight }}
                           onClick={(e) => e.stopPropagation()}
                         >
                           <CustomCalendar
                             selectedDate={formData.departure}
                             onDateSelect={(date) => {
                               setFormData(prev => ({ ...prev, departure: date }));
                               setShowDepartureCalendar(false);
                             }}
                             minDate={new Date()}
                           />
                         </div>,
                         document.body
                       )
                     )}
                   </div>
                 </div>

                 {/* Number of Nights */}
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide">
                     NUMBER OF NIGHTS
                   </label>
                   <div className="flex items-center justify-center space-x-3 px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl bg-white">
                     <button
                       type="button"
                       onClick={() => handleNightsChange(false)}
                       className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 cursor-pointer"
                     >
                       <Minus className="w-3 sm:w-4 h-3 sm:h-4" />
                     </button>
                     <span className="text-lg sm:text-xl font-semibold text-[#0D2B29] font-poppins min-w-[3rem] text-center">
                       {formData.nights}
                     </span>
                     <button
                       type="button"
                       onClick={() => handleNightsChange(true)}
                       className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white transition-all duration-200 cursor-pointer"
                     >
                       <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                     </button>
                   </div>
                 </div>

                 {/* Guests */}
                 <div className="relative guest-selector-container">
                   <label className="block text-sm font-semibold text-[#0D2B29] font-poppins tracking-wide mb-2">
                     PASSENGERS
                   </label>
                   <div className="relative group">
                     <Users className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#0ABAB5] h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-[#0D2B29]" />
                     <button
                       type="button"
                       ref={guestButtonRef}
                       onClick={handleGuestSelectorToggle}
                       className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] outline-none font-poppins text-sm sm:text-base text-[#0D2B29] transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                     >
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
                       <h3 className="font-poppins font-bold text-[#0D2B29] text-base sm:text-lg mb-2">Number of Passengers</h3>

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
                  
                  {/* Hotel Checkbox */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.needsHotel}
                          onChange={(e) => setFormData(prev => ({ ...prev, needsHotel: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                          formData.needsHotel
                            ? 'bg-[#0ABAB5] border-[#0ABAB5]'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {formData.needsHotel && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="font-poppins text-sm font-medium text-[#0D2B29]">
                        I need hotel arrangements
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
            </div>

            {/* Contact Details */}
            <div className="w-full lg:w-1/2 bg-white">
              <div className="w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0D2B29] mb-1 sm:mb-2 font-poppins">
                  Contact Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-poppins">
                  We'll use this information to confirm your booking
                </p>
              </div>

              {/* Full Name */}
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
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-[#0ABAB5] font-poppins text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
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
                  By booking, you agree to our terms and conditions
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