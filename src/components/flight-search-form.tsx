"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowLeftRight, Calendar as CalendarIcon, MapPin, Users, Plane, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { cities, City } from '@/lib/utils'

interface PassengerCount {
  adults: number
  children: number
  infants: number
}

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
                  w-7 h-7 flex items-center justify-center rounded-lg font-poppins font-medium text-xs transition-all cursor-pointer
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

interface FlightSearchFormProps {
  isSticky: boolean;
  fromInput: string;
  setFromInput: React.Dispatch<React.SetStateAction<string>>;
  toInput: string;
  setToInput: React.Dispatch<React.SetStateAction<string>>;
  fromSelection: City | null;
  setFromSelection: React.Dispatch<React.SetStateAction<City | null>>;
  toSelection: City | null;
  setToSelection: React.Dispatch<React.SetStateAction<City | null>>;
  departureDate: Date | null;
  setDepartureDate: React.Dispatch<React.SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: React.Dispatch<React.SetStateAction<Date | null>>;
  passengers: PassengerCount;
  setPassengers: React.Dispatch<React.SetStateAction<PassengerCount>>;
  tripType: string;
  setTripType: React.Dispatch<React.SetStateAction<string>>;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  multiSegments: { from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }[];
  setMultiSegments: React.Dispatch<React.SetStateAction<{ from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }[]>>;
  multiPopovers: boolean[];
  setMultiPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
  multiFromSuggestions: City[][];
  setMultiFromSuggestions: React.Dispatch<React.SetStateAction<City[][]>>;
  multiToSuggestions: City[][];
  setMultiToSuggestions: React.Dispatch<React.SetStateAction<City[][]>>;
  multiShowFromSuggestions: boolean[];
  setMultiShowFromSuggestions: React.Dispatch<React.SetStateAction<boolean[]>>;
  multiShowToSuggestions: boolean[];
  setMultiShowToSuggestions: React.Dispatch<React.SetStateAction<boolean[]>>;
  multiActiveInputs: ('from' | 'to' | null)[];
  setMultiActiveInputs: React.Dispatch<React.SetStateAction<('from' | 'to' | null)[]>>;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  isSticky,
  fromInput,
  setFromInput,
  toInput,
  setToInput,
  fromSelection,
  setFromSelection,
  toSelection,
  setToSelection,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  passengers,
  setPassengers,
  tripType,
  setTripType,
  selectedClass,
  setSelectedClass,
  multiSegments,
  setMultiSegments,
  multiPopovers,
  setMultiPopovers,
  multiFromSuggestions,
  setMultiFromSuggestions,
  multiToSuggestions,
  setMultiToSuggestions,
  multiShowFromSuggestions,
  setMultiShowFromSuggestions,
  multiShowToSuggestions,
  setMultiShowToSuggestions,
  multiActiveInputs,
  setMultiActiveInputs,
}) => {
  const [fromSuggestions, setFromSuggestions] = useState<typeof cities>([])
  const [toSuggestions, setToSuggestions] = useState<typeof cities>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  
  type OpenPopover = 'trip' | 'class' | 'passengers' | 'departure' | 'return' | null
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null)
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null)
  
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  const handleFromInputChange = (value: string) => {
    setFromInput(value)
    setFromSelection(null)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      setFromSuggestions(filtered)
      setShowFromSuggestions(true)
    } else {
      setShowFromSuggestions(false)
    }
  }
  
  const handleToInputChange = (value: string) => {
    setToInput(value)
    setToSelection(null)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      setToSuggestions(filtered)
      setShowToSuggestions(true)
    } else {
      setShowToSuggestions(false)
    }
  }
  
  const handleCitySelect = (city: typeof cities[0], type: 'from' | 'to') => {
    if (type === 'from') {
      setFromSelection(city)
      setFromInput(city.name)
      setShowFromSuggestions(false)
    } else {
      setToSelection(city)
      setToInput(city.name)
      setShowToSuggestions(false)
    }
  }
  
  const handleTogglePopover = (popover: OpenPopover) => {
    if (openPopover === popover) {
      setOpenPopover(null)
    } else {
      setOpenPopover(popover)
    }
  }
  
  const handleSearch = () => {
    console.log('Search flights:', {
      tripType,
      classType: selectedClass,
      passengers,
      fromCity: fromSelection ? `${fromSelection.name} ${fromSelection.code}` : fromInput,
      toCity: toSelection ? `${toSelection.name} ${toSelection.code}` : toInput,
      departureDate,
      returnDate
    })
  }
  
  const updatePassengerCount = (type: keyof PassengerCount, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }))
  }

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants
  }
  
  const handleSwapCities = () => {
    const tempInput = fromInput
    setFromInput(toInput)
    setToInput(tempInput)

    const tempSelection = fromSelection
    setFromSelection(toSelection)
    setToSelection(tempSelection)
  }
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container') && !target.closest('.calendar-container')) {
        setOpenPopover(null)
        setMultiPopovers(pops => pops.map(() => false))
      }
      if (!target.closest('.autocomplete-container')) {
        setShowFromSuggestions(false)
        setShowToSuggestions(false)
        setMultiShowFromSuggestions(shows => shows.map(() => false))
        setMultiShowToSuggestions(shows => shows.map(() => false))
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setMultiPopovers, setMultiShowFromSuggestions, setMultiShowToSuggestions])
  
  // Multi-city segments (дополнительные, кроме основной формы)
  // При выборе Multi-city сразу появляется одна доп. форма
  const handleAddSegment = () => {
    if (multiSegments.length >= 5) return // основная + 5 = 6 максимум
    setMultiSegments([...multiSegments, { from: '', to: '', date: null, fromSelection: null, toSelection: null }])
    setMultiPopovers([...multiPopovers, false])
    setMultiFromSuggestions([...multiFromSuggestions, []])
    setMultiToSuggestions([...multiToSuggestions, []])
    setMultiShowFromSuggestions([...multiShowFromSuggestions, false])
    setMultiShowToSuggestions([...multiShowToSuggestions, false])
    setMultiActiveInputs([...multiActiveInputs, null])
  }
  const handleSegmentChange = (idx: number, field: 'from' | 'to' | 'date' | 'fromSelection' | 'toSelection', value: string | Date | null | City) => {
    setMultiSegments(segs => segs.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }
  const handleSegmentPopover = (idx: number, open: boolean) => {
    setMultiPopovers(pops => pops.map((v, i) => i === idx ? open : v))
  }
  const handleRemoveSegment = (idx: number) => {
    // Если удаляется последняя дополнительная форма, переключаемся на One way
    if (multiSegments.length === 1) {
      setTripType('One way');
      // Явно очищаем все состояния для multi-city
      setMultiSegments([]);
      setMultiPopovers([]);
      setMultiFromSuggestions([]);
      setMultiToSuggestions([]);
      setMultiShowFromSuggestions([]);
      setMultiShowToSuggestions([]);
      setMultiActiveInputs([]);
    } else {
      // Иначе, просто удаляем нужный сегмент
      setMultiSegments(segs => segs.filter((_, i) => i !== idx));
      setMultiPopovers(pops => pops.filter((_, i) => i !== idx));
      setMultiFromSuggestions(suggs => suggs.filter((_, i) => i !== idx));
      setMultiToSuggestions(suggs => suggs.filter((_, i) => i !== idx));
      setMultiShowFromSuggestions(shows => shows.filter((_, i) => i !== idx));
      setMultiShowToSuggestions(shows => shows.filter((_, i) => i !== idx));
      setMultiActiveInputs(actives => actives.filter((_, i) => i !== idx));
    }
  };
  
  const handleMultiFromInput = (idx: number, value: string) => {
    handleSegmentChange(idx, 'from', value)
    handleSegmentChange(idx, 'fromSelection', null)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      setMultiFromSuggestions(suggs => suggs.map((s, i) => i === idx ? filtered : s))
      setMultiShowFromSuggestions(shows => shows.map((s, i) => i === idx ? true : s))
    } else {
      setMultiShowFromSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    }
  }

  const handleMultiToInput = (idx: number, value: string) => {
    handleSegmentChange(idx, 'to', value)
    handleSegmentChange(idx, 'toSelection', null)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      setMultiToSuggestions(suggs => suggs.map((s, i) => i === idx ? filtered : s))
      setMultiShowToSuggestions(shows => shows.map((s, i) => i === idx ? true : s))
    } else {
      setMultiShowToSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    }
  }

  const handleMultiCitySelect = (idx: number, city: City, type: 'from' | 'to') => {
    if (type === 'from') {
      handleSegmentChange(idx, 'fromSelection', city)
      handleSegmentChange(idx, 'from', city.name)
      setMultiShowFromSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    } else {
      handleSegmentChange(idx, 'toSelection', city)
      handleSegmentChange(idx, 'to', city.name)
      setMultiShowToSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    }
  }

  const handleMultiInputFocus = (idx: number, field: 'from' | 'to') => {
    setMultiActiveInputs(actives => actives.map((a, i) => i === idx ? field : a))
  }

  const handleMultiInputBlur = (idx: number) => {
    setMultiActiveInputs(actives => actives.map((a, i) => i === idx ? null : a))
  }

  const handleClearAll = () => {
    setFromInput('')
    setToInput('')
    setFromSelection(null)
    setToSelection(null)
    setDepartureDate(null)
    setReturnDate(null)

    if (tripType === 'Multi-city') {
      const clearedFirstSegment = { from: '', to: '', date: null, fromSelection: null, toSelection: null };
      setMultiSegments([clearedFirstSegment]);
      setMultiPopovers([false]);
      setMultiFromSuggestions([[]]);
      setMultiToSuggestions([[]]);
      setMultiShowFromSuggestions([false]);
      setMultiShowToSuggestions([false]);
      setMultiActiveInputs([null]);
    }
  }
  
  // Reset returnDate if it is before departureDate
  // useEffect(() => {
  //   if (departureDate && returnDate && returnDate < departureDate) {
  //     setReturnDate(null)
  //   }
  // }, [departureDate, returnDate, setReturnDate])
  
  return (
    <div className="w-full max-w-[1280px] mx-auto">
      {/* Top Controls */}
      <div className={`flex items-center justify-center gap-6 ${isSticky ? 'mb-4' : 'mb-6'}`}>
        {/* Trip Type */}
        <div className="relative dropdown-container">
          <button
            onClick={() => handleTogglePopover('trip')}
            className={`flex items-center gap-2 bg-white border border-transparent rounded-full font-poppins font-semibold text-[14px] text-[#0D2B29] hover:bg-gray-50 transition-colors cursor-pointer ${isSticky ? 'px-4 py-2' : 'px-6 py-3'}`}
            tabIndex={0}
            aria-label="Trip type"
          >
            <span>{tripType}</span>
            <ChevronDown size={14} className={`text-[#ec5e39] transition-transform duration-300 ${openPopover === 'trip' ? 'rotate-180' : ''}`} />
          </button>
          {openPopover === 'trip' && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
              {['One way', 'Round Trip', 'Multi-city'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTripType(type)
                    handleTogglePopover(null)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer font-poppins text-[#0D2B29] text-sm first:rounded-t-xl last:rounded-b-xl"
                  tabIndex={0}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Class */}
        <div className="relative dropdown-container">
          <button
            onClick={() => handleTogglePopover('class')}
            className={`flex items-center gap-2 bg-white border border-transparent rounded-full font-poppins font-semibold text-[14px] text-[#0D2B29] hover:bg-gray-50 transition-colors cursor-pointer ${isSticky ? 'px-4 py-2' : 'px-6 py-3'}`}
            tabIndex={0}
            aria-label="Class"
          >
            <span>{selectedClass}</span>
            <ChevronDown size={14} className={`text-[#ec5e39] transition-transform duration-300 ${openPopover === 'class' ? 'rotate-180' : ''}`} />
          </button>
          {openPopover === 'class' && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
              {['Business class', 'First class'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedClass(type)
                    handleTogglePopover(null)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer font-poppins text-[#0D2B29] text-sm first:rounded-t-xl last:rounded-b-xl"
                  tabIndex={0}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
        {/* Main Form - Horizontal Layout */}
        <div className="flex flex-row w-full">
          <div className={`bg-white rounded-full shadow-lg flex items-center gap-1 w-full ${isSticky ? 'p-1' : 'p-2'}`}>
            {/* From */}
            <div className={`relative autocomplete-container grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'from' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}>
              <div
                className={`flex items-center px-4 cursor-pointer w-full ${isSticky ? 'py-2' : 'py-4'}`}
                tabIndex={0}
                aria-label="From input"
                onClick={() => fromInputRef.current && fromInputRef.current.focus()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fromInputRef.current?.focus(); } }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
                    <input
                      ref={fromInputRef}
                      type="text"
                      value={fromInput}
                      onChange={(e) => handleFromInputChange(e.target.value)}
                      onFocus={() => setActiveInput('from')}
                      onBlur={() => setActiveInput(null)}
                      placeholder="Flying from?"
                      className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                      tabIndex={-1}
                    />
                  </div>
                  {fromSelection && (
                    <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                      {fromSelection.code}
                    </div>
                  )}
                </div>
              </div>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {fromSuggestions.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city, 'from')}
                      className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                      tabIndex={0}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-3" />
                        <div>
                          <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                          <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Divider with Swapper Button */}
            <div className="relative flex-shrink-0">
              <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
              <button
                onClick={handleSwapCities}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
                aria-label="Swap origin and destination"
              >
                <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors" />
              </button>
            </div>
            
            {/* To */}
            <div className={`relative autocomplete-container grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'to' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}>
              <div
                className={`flex items-center px-4 cursor-pointer w-full ${isSticky ? 'py-2' : 'py-4'}`}
                tabIndex={0}
                aria-label="To input"
                onClick={() => toInputRef.current && toInputRef.current.focus()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toInputRef.current?.focus(); } }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane size={16} className="text-[#0ABAB5] rotate-90" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
                    <input
                      ref={toInputRef}
                      type="text"
                      value={toInput}
                      onChange={(e) => handleToInputChange(e.target.value)}
                      onFocus={() => setActiveInput('to')}
                      onBlur={() => setActiveInput(null)}
                      placeholder="Where are you flying?"
                      className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                      tabIndex={-1}
                    />
                  </div>
                  {toSelection && (
                    <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                      {toSelection.code}
                    </div>
                  )}
                </div>
              </div>
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {toSuggestions.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city, 'to')}
                      className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                      tabIndex={0}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-3" />
                        <div>
                          <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                          <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
            
            {/* Departure Date */}
            <div className="relative calendar-container grow-[2] shrink basis-0">
              <div 
                className={`flex items-center px-4 cursor-pointer h-full ${isSticky ? 'py-2' : 'py-4'}`}
                onClick={() => handleTogglePopover('departure')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                    <div className={`font-poppins font-medium text-base whitespace-nowrap ${departureDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                        {departureDate ? (
                        departureDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                        ) : (
                        'Select Date'
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {openPopover === 'departure' && (
                <div className="absolute top-full left-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
                  <CustomCalendar
                    selectedDate={departureDate}
                    onDateSelect={(date) => {
                      setDepartureDate(date)
                      if (returnDate && date > returnDate) {
                        setReturnDate(null)
                      }
                      setOpenPopover(null)
                    }}
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>
            
            {/* Return Date - for Round trip only */}
            {tripType === 'Round Trip' && (
              <div className="relative border-l border-gray-100 flex-1">
                <div
                  className={`flex items-center gap-3 cursor-pointer h-full px-4 ${isSticky ? 'py-2' : 'py-4'}`}
                  onClick={() => handleTogglePopover('return')}
                >
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">RETURN</div>
                    <div className={`w-full font-poppins font-medium border-none outline-none bg-transparent ${returnDate ? 'text-[#0D2B29]' : 'text-gray-400'} whitespace-nowrap`}>
                       {returnDate ? formatDate(returnDate) : '+ Add return'}
                    </div>
                  </div>
                </div>
                {openPopover === 'return' && (
                  <div className="absolute top-full right-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
                    <CustomCalendar
                      selectedDate={returnDate}
                      onDateSelect={(date) => {
                        setReturnDate(date)
                        setOpenPopover(null)
                      }}
                      minDate={departureDate || new Date()}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Divider */}
            <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
            
            {/* Passengers */}
            <div className="relative dropdown-container w-[200px] flex-shrink-0">
              <div 
                className={`flex items-center px-4 cursor-pointer h-full ${isSticky ? 'py-2' : 'py-4'}`}
                onClick={() => handleTogglePopover('passengers')}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">PASSENGERS</div>
                    <div className={`w-full font-poppins font-medium border-none outline-none bg-transparent ${getTotalPassengers() > 1 ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                      {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Passenger' : 'Passengers'}
                    </div>
                  </div>
                </div>
              </div>
              {openPopover === 'passengers' && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-poppins font-medium text-[#0D2B29]">Adults</div>
                      <div className="font-poppins text-sm text-gray-500">12+ years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('adults', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.adults <= 1}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.adults}</span>
                      <button
                        onClick={() => updatePassengerCount('adults', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-poppins font-medium text-[#0D2B29]">Children</div>
                      <div className="font-poppins text-sm text-gray-500">2-11 years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('children', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.children <= 0}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.children}</span>
                      <button
                        onClick={() => updatePassengerCount('children', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-poppins font-medium text-[#0D2B29]">Lap Infants</div>
                      <div className="font-poppins text-sm text-gray-500">under 2 years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('infants', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.infants <= 0}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.infants}</span>
                      <button
                        onClick={() => updatePassengerCount('infants', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Search Button */}
            {tripType !== 'Multi-city' && (
              <button
                onClick={handleSearch}
                className="bg-[#FF6B47] text-white px-10 py-4 rounded-full font-poppins font-semibold text-lg hover:bg-[#E5593E] transition-colors flex items-center justify-center gap-2 cursor-pointer border-0"
                tabIndex={0}
                aria-label="Search flights"
              >
                SEARCH
              </button>
            )}
          </div>
        </div>
        {/* Multi-city segments (дополнительные) */}
        {tripType === 'Multi-city' && multiSegments.map((segment, idx) => (
          <div className="relative" key={idx}>
            <MultiCitySegment
              segment={segment}
              onChange={(field, value) => handleSegmentChange(idx, field, value)}
              fromSuggestions={multiFromSuggestions[idx] || []}
              toSuggestions={multiToSuggestions[idx] || []}
              showFromSuggestions={multiShowFromSuggestions[idx] || false}
              showToSuggestions={multiShowToSuggestions[idx] || false}
              onFromInput={(v) => handleMultiFromInput(idx, v)}
              onToInput={(v) => handleMultiToInput(idx, v)}
              onCitySelect={(city, type) => handleMultiCitySelect(idx, city, type)}
              onDateClick={() => handleSegmentPopover(idx, true)}
              openPopover={multiPopovers[idx]}
              setOpenPopover={open => handleSegmentPopover(idx, open)}
              activeInput={multiActiveInputs[idx] || null}
              onInputFocus={(field) => handleMultiInputFocus(idx, field)}
              onInputBlur={() => handleMultiInputBlur(idx)}
            />
            <button
              onClick={() => handleRemoveSegment(idx)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Remove segment"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {tripType === 'Multi-city' && (
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddSegment}
                className="bg-white border border-[#0ABAB5] text-[#0ABAB5] px-6 py-4 rounded-full font-poppins font-semibold text-sm hover:bg-[#F0FBFA] transition-colors flex items-center gap-2 cursor-pointer"
                tabIndex={0}
                aria-label="Add a Flight"
              >
                <Plus size={16} />
                Add a Flight
              </button>
              <button
                onClick={handleClearAll}
                className="bg-white border border-gray-300 text-gray-600 px-6 py-4 rounded-full font-poppins font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                tabIndex={0}
                aria-label="Clear All"
              >
                Clear All
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#FF6B47] text-white px-10 py-4 rounded-full font-poppins font-semibold text-lg hover:bg-[#E5593E] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              tabIndex={0}
              aria-label="Search flights"
            >
              SEARCH
            </button>
          </div>
        )}
    </div>
  )
}

// Flight segment form for Multi-city
const MultiCitySegment: React.FC<{
  segment: { from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }
  onChange: (field: 'from' | 'to' | 'date' | 'fromSelection' | 'toSelection', value: string | Date | null | City) => void
  fromSuggestions: City[]
  toSuggestions: City[]
  showFromSuggestions: boolean
  showToSuggestions: boolean
  onFromInput: (v: string) => void
  onToInput: (v: string) => void
  onCitySelect: (city: City, type: 'from' | 'to') => void
  onDateClick: () => void
  openPopover: boolean
  setOpenPopover: (v: boolean) => void
  activeInput: 'from' | 'to' | null
  onInputFocus: (field: 'from' | 'to') => void
  onInputBlur: () => void
}> = ({
  segment, onChange,
  fromSuggestions, toSuggestions,
  showFromSuggestions, showToSuggestions,
  onFromInput, onToInput, onCitySelect,
  onDateClick, openPopover, setOpenPopover,
  activeInput, onInputFocus, onInputBlur
}) => {
  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-1 mt-4 autocomplete-container">
      {/* From */}
      <div className={`relative grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'from' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}> 
        <div
          className="flex items-center px-4 py-3 cursor-pointer w-full"
          tabIndex={0}
          aria-label="From input"
          onClick={() => { fromRef.current?.focus(); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fromRef.current?.focus(); } }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Plane size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
              <input
                ref={fromRef}
                type="text"
                value={segment.from}
                onChange={e => onFromInput(e.target.value)}
                onFocus={() => onInputFocus('from')}
                onBlur={onInputBlur}
                placeholder="Flying from?"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                tabIndex={-1}
              />
            </div>
            {segment.fromSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                {segment.fromSelection.code}
              </div>
            )}
          </div>
        </div>
        {showFromSuggestions && fromSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {fromSuggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onCitySelect(city, 'from')}
                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-3" />
                  <div>
                    <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                    <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Divider with Swapper Button */}
      <div className="relative flex-shrink-0">
        <div className="w-px h-16 bg-gray-200"></div>
        <button
          onClick={() => {
            // Swap from and to for this segment
            const temp = segment.from
            const tempSelection = segment.fromSelection
            onChange('from', segment.to)
            onChange('to', temp)
            onChange('fromSelection', segment.toSelection)
            onChange('toSelection', tempSelection)
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
          aria-label="Swap origin and destination"
        >
          <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors" />
        </button>
      </div>
      {/* To */}
      <div className={`relative grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'to' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}> 
        <div
          className="flex items-center px-4 py-3 cursor-pointer w-full"
          tabIndex={0}
          aria-label="To input"
          onClick={() => { toRef.current?.focus(); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toRef.current?.focus(); } }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Plane size={16} className="text-[#0ABAB5] rotate-90" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
              <input
                ref={toRef}
                type="text"
                value={segment.to}
                onChange={e => onToInput(e.target.value)}
                onFocus={() => onInputFocus('to')}
                onBlur={onInputBlur}
                placeholder="Where are you flying?"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                tabIndex={-1}
              />
            </div>
            {segment.toSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                {segment.toSelection.code}
              </div>
            )}
          </div>
        </div>
        {showToSuggestions && toSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {toSuggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onCitySelect(city, 'to')}
                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-3" />
                  <div>
                    <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                    <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Divider */}
      <div className="w-px h-16 bg-gray-200"></div>
      {/* Departure Date */}
      <div className="relative calendar-container grow-[2] shrink basis-0">
        <div 
          className="flex items-center px-4 py-3 cursor-pointer h-full"
          onClick={onDateClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <CalendarIcon size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
              <div className={`w-full font-poppins font-medium border-none outline-none bg-transparent ${segment.date ? 'text-[#0D2B29]' : 'text-gray-400'}`}> 
                {segment.date ? segment.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date'}
              </div>
            </div>
          </div>
        </div>
        {openPopover && (
          <div className="absolute top-full left-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
            <CustomCalendar
              selectedDate={segment.date}
              onDateSelect={date => { onChange('date', date); setOpenPopover(false) }}
              minDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightSearchForm 