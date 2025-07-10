"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowLeftRight, Calendar as CalendarIcon, MapPin, Search, Users, Plane, ChevronLeft, ChevronRight, Plus, X, ChevronUp } from 'lucide-react'
import { cities, City } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FlightSearchFormMobileProps {
  fromInput: string;
  setFromInput: React.Dispatch<React.SetStateAction<string>>;
  toInput: string;
  setToInput: React.Dispatch<React.SetStateAction<string>>;
  fromSelection: City | null;
  setFromSelection: React.Dispatch<React.SetStateAction<City | null>>;
  toSelection: City | null;
  setToSelection: React.Dispatch<React.SetStateAction<City | null>>;
  tripType: string;
  setTripType: React.Dispatch<React.SetStateAction<string>>;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  setPassengers: React.Dispatch<React.SetStateAction<{
    adults: number;
    children: number;
    infants: number;
  }>>;
  departureDate: Date | null;
  setDepartureDate: React.Dispatch<React.SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: React.Dispatch<React.SetStateAction<Date | null>>;
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

interface PassengerCount {
  adults: number
  children: number
  infants: number
}

// Календарь со скроллом по месяцам
const ScrollableCalendar: React.FC<{
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate: Date;
  departureFlash: boolean;
  onDepartureFlashEnd: () => void;
}> = ({ selectedDate, onDateSelect, minDate, departureFlash, onDepartureFlashEnd }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const generateMonths = () => {
    const months = []
    const startDate = new Date(minDate)
    startDate.setDate(1)
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate)
      monthDate.setMonth(startDate.getMonth() + i)
      months.push(monthDate)
    }
    
    return months
  }
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Пустые дни в начале месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }
  
  const isDateDisabled = (date: Date) => {
    return date < minDate
  }

  useEffect(() => {
    if (departureFlash) {
      const timeout = setTimeout(() => {
        onDepartureFlashEnd();
      }, 500); // 500ms animation duration
      return () => clearTimeout(timeout);
    }
  }, [departureFlash, onDepartureFlashEnd]);
  
  return (
    <div className="max-h-[100vh] overflow-y-auto">
      {generateMonths().map((monthDate, monthIndex) => (
        <div key={monthIndex} className="mb-6">
          <h3 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 px-4">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </h3>
          
          <div className="grid grid-cols-7 gap-1 px-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-poppins font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {getDaysInMonth(monthDate).map((date, dayIndex) => (
              <div key={dayIndex} className="aspect-square">
                {date && (
                  <button
                    onClick={() => !isDateDisabled(date) && onDateSelect(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-lg font-poppins font-medium text-sm transition-all ${
                      isDateSelected(date)
                        ? 'bg-[#0ABAB5] text-white'
                        : isDateDisabled(date)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#0D2B29] hover:bg-[#F0FBFA] cursor-pointer'
                    } ${isDateSelected(date) && departureFlash ? 'animate-flash' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// BottomSheet component
const BottomSheet: React.FC<{ open: boolean, onClose: () => void, children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl shadow-lg w-full h-1/2 p-4 animate-slide-up flex flex-col">
        <button className="absolute right-4 top-4" onClick={onClose}><X size={24} /></button>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

const FlightSearchFormMobile: React.FC<FlightSearchFormMobileProps> = ({
  fromInput,
  setFromInput,
  toInput,
  setToInput,
  fromSelection,
  setFromSelection,
  toSelection,
  setToSelection,
  tripType,
  setTripType,
  selectedClass,
  setSelectedClass,
  passengers,
  setPassengers,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
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
  const [fromSuggestions, setFromSuggestions] = useState<City[]>([])
  const [toSuggestions, setToSuggestions] = useState<City[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  
  type OpenPopover = 'trip' | 'class' | 'passengers' | null
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null)
  const [activeModal, setActiveModal] = useState<'from' | 'to' | 'calendar' | 'multi-from' | 'multi-to' | 'multi-calendar' | null>(null)
  const [calendarMode, setCalendarMode] = useState<'departure' | 'return'>('departure')
  const [activeMultiIndex, setActiveMultiIndex] = useState<number>(0)
  const [activeMultiField, setActiveMultiField] = useState<'from' | 'to'>('from')

  // Multi-city segments
  // const [multiSegments, setMultiSegments] = useState<{ from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }[]>([])
  // const [multiPopovers, setMultiPopovers] = useState<boolean[]>([])
  // const [multiFromSuggestions, setMultiFromSuggestions] = useState<City[][]>([])
  // const [multiToSuggestions, setMultiToSuggestions] = useState<City[][]>([])
  // const [multiShowFromSuggestions, setMultiShowFromSuggestions] = useState<boolean[]>([])
  // const [multiShowToSuggestions, setMultiShowToSuggestions] = useState<boolean[]>([])
  
  // При выборе Multi-city сразу появляется одна доп. форма
  useEffect(() => {
    if (tripType === 'Multi-city' && multiSegments.length === 0) {
      setMultiSegments([{ from: '', to: '', date: null, fromSelection: null, toSelection: null }])
      setMultiPopovers([false])
      setMultiFromSuggestions([[]])
      setMultiToSuggestions([[]])
      setMultiShowFromSuggestions([false])
      setMultiShowToSuggestions([false])
    }
    if (tripType !== 'Multi-city' && multiSegments.length > 0) {
      setMultiSegments([])
      setMultiPopovers([])
      setMultiFromSuggestions([])
      setMultiToSuggestions([])
      setMultiShowFromSuggestions(shows => shows.map(() => false))
      setMultiShowToSuggestions(shows => shows.map(() => false))
    }
  }, [tripType])

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
      setFromSuggestions([])
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
      setToSuggestions([])
      setShowToSuggestions(false)
    }
  }

  const handleCitySelect = (city: City, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromSelection(city)
      setFromInput(`${city.name}, ${city.country}`)
      setShowFromSuggestions(false)
      setActiveModal('to')
    } else {
      setToSelection(city)
      setToInput(`${city.name}, ${city.country}`)
      setShowToSuggestions(false)
      setActiveModal(null)
    }
  }

  const handleTogglePopover = (popover: OpenPopover) => {
    if (openPopover === popover) {
      setOpenPopover(null)
    } else {
      setOpenPopover(popover)
    }
  }

  const handleSwapCities = () => {
    const tempInput = fromInput
    const tempSelection = fromSelection
    setFromInput(toInput)
    setFromSelection(toSelection)
    setToInput(tempInput)
    setToSelection(tempSelection)
  }

  const handleMultiFromInputChange = (idx: number, value: string) => {
    const newSegments = [...multiSegments]
    newSegments[idx] = { ...newSegments[idx], from: value, fromSelection: null }
    setMultiSegments(newSegments)
    
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      const newSuggestions = [...multiFromSuggestions]
      newSuggestions[idx] = filtered
      setMultiFromSuggestions(newSuggestions)
    } else {
      const newSuggestions = [...multiFromSuggestions]
      newSuggestions[idx] = []
      setMultiFromSuggestions(newSuggestions)
    }
  }

  const handleMultiToInputChange = (idx: number, value: string) => {
    const newSegments = [...multiSegments]
    newSegments[idx] = { ...newSegments[idx], to: value, toSelection: null }
    setMultiSegments(newSegments)
    
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      const newSuggestions = [...multiToSuggestions]
      newSuggestions[idx] = filtered
      setMultiToSuggestions(newSuggestions)
    } else {
      const newSuggestions = [...multiToSuggestions]
      newSuggestions[idx] = []
      setMultiToSuggestions(newSuggestions)
    }
  }

  const handleMultiCitySelect = (idx: number, city: City, type: 'from' | 'to') => {
    const newSegments = [...multiSegments]
    if (type === 'from') {
      newSegments[idx] = { 
        ...newSegments[idx], 
        fromSelection: city, 
        from: `${city.name}, ${city.country}` 
      }
    } else {
      newSegments[idx] = { 
        ...newSegments[idx], 
        toSelection: city, 
        to: `${city.name}, ${city.country}` 
      }
    }
    setMultiSegments(newSegments)
  }

  const handleAddSegment = () => {
    if (multiSegments.length >= 5) return
    setMultiSegments([...multiSegments, { from: '', to: '', date: null, fromSelection: null, toSelection: null }])
    setMultiPopovers([...multiPopovers, false])
    setMultiFromSuggestions([...multiFromSuggestions, []])
    setMultiToSuggestions([...multiToSuggestions, []])
    setMultiShowFromSuggestions([...multiShowFromSuggestions, false])
    setMultiShowToSuggestions([...multiShowToSuggestions, false])
  }

  const handleRemoveSegment = (idx: number) => {
    if (multiSegments.length === 1) {
      setTripType('One way')
      setMultiSegments([])
      setMultiPopovers([])
      setMultiFromSuggestions([])
      setMultiToSuggestions([])
      setMultiShowFromSuggestions([])
      setMultiShowToSuggestions([])
    } else {
      setMultiSegments(segs => segs.filter((_, i) => i !== idx))
      setMultiPopovers(pops => pops.filter((_, i) => i !== idx))
      setMultiFromSuggestions(suggs => suggs.filter((_, i) => i !== idx))
      setMultiToSuggestions(suggs => suggs.filter((_, i) => i !== idx))
      setMultiShowFromSuggestions(shows => shows.filter((_, i) => i !== idx))
      setMultiShowToSuggestions(shows => shows.filter((_, i) => i !== idx))
    }
  }

  const handleClearAll = () => {
    setFromInput('')
    setToInput('')
    setFromSelection(null)
    setToSelection(null)
    setDepartureDate(null)
    setReturnDate(null)
    setMultiSegments([{ from: '', to: '', date: null, fromSelection: null, toSelection: null }])
    setMultiPopovers([false])
    setMultiFromSuggestions([[]])
    setMultiToSuggestions([[]])
    setMultiShowFromSuggestions([false])
    setMultiShowToSuggestions([false])
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
  }, [])

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants
  }

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setPassengers(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
      return { ...prev, [type]: newCount }
    })
  }

  const [openSheet, setOpenSheet] = useState<null | 'trip' | 'class' | 'passengers'>(null)

  // Для анимации departure date:
  const [departureFlash, setDepartureFlash] = useState(false)
  const [returnTabFlash, setReturnTabFlash] = useState(false)

  useEffect(() => {
    if (returnTabFlash) {
      const timeout = setTimeout(() => setReturnTabFlash(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [returnTabFlash])

  // 1. Добавляю состояния:
  const [cityTab, setCityTab] = useState<'from' | 'to'>('from')
  const [citySheetOpen, setCitySheetOpen] = useState(false)

  // 1. Состояния:
  const [multiCityTab, setMultiCityTab] = useState<'from' | 'to'>('from')
  const [multiCityModalOpen, setMultiCityModalOpen] = useState(false)
  const [multiCityActiveIndex, setMultiCityActiveIndex] = useState<number>(0)

  return (
    <div className="w-full max-w-md mx-auto p-0 overflow-x-hidden">
      {/* Top Controls */}
      {/* Верхний ряд кнопок */}
      <div className="flex justify-center mb-4 overflow-x-hidden md:hidden gap-3">
        {/* Trip Type */}
        <button
          onClick={() => setOpenSheet('trip')}
          className="flex-1 min-w-[120px] rounded-full px-6 py-3 bg-white border border-gray-200 font-poppins font-semibold text-[14px] text-[#0D2B29] flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          tabIndex={0}
        >
          <span>{tripType}</span>
          <ChevronDown size={16} className="ml-2 text-[#ec5e39]" />
        </button>
        {/* Class */}
        <button
          onClick={() => setOpenSheet('class')}
          className="flex-1 min-w-[120px] rounded-full px-6 py-3 bg-white border border-gray-200 font-poppins font-semibold text-[14px] text-[#0D2B29] flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          tabIndex={0}
        >
          <span>{selectedClass}</span>
          <ChevronDown size={16} className="ml-2 text-[#ec5e39]" />
        </button>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden autocomplete-container">
        {/* From */}
        <div className="px-4 py-4 border-b border-gray-100" onClick={() => { setCityTab('from'); setCitySheetOpen(true) }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <Plane size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
              <div className="font-poppins text-sm text-[#0D2B29]">
                {fromSelection ? `${fromSelection.name}, ${fromSelection.country}` : fromInput || 'Flying from?'}
              </div>
            </div>
            {fromSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                {fromSelection.code}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="relative">
          <button
            onClick={handleSwapCities}
            className="absolute right-4 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors rotate-90" />
          </button>
        </div>

        {/* To */}
        <div className="px-4 py-4 border-b border-gray-100" onClick={() => { setCityTab('to'); setCitySheetOpen(true) }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <MapPin size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
              <div className="font-poppins text-sm text-[#0D2B29]">
                {toSelection ? `${toSelection.name}, ${toSelection.country}` : toInput || 'Where are you flying?'}
              </div>
            </div>
            {toSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                {toSelection.code}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex border-b border-gray-100">
          {/* Departure */}
          <div className={`${tripType === 'Round Trip' ? 'w-1/2' : 'w-full'} calendar-container`}>
            <div 
              className="px-4 py-4 cursor-pointer border-r border-gray-100"
              onClick={() => {
                setCalendarMode('departure')
                setActiveModal('calendar')
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                  <CalendarIcon size={16} className="text-[#0ABAB5]" />
                </div>
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                  <div className={`font-poppins text-sm ${departureDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                    {departureDate ? formatDate(departureDate) : 'Select Date'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return - только для Round Trip */}
          {tripType === 'Round Trip' && (
            <div className="w-1/2 calendar-container">
              <div 
                className="px-4 py-4 cursor-pointer"
                onClick={() => {
                  setCalendarMode('return')
                  setActiveModal('calendar')
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">RETURN</div>
                    <div className={`font-poppins text-sm ${returnDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                      {returnDate ? formatDate(returnDate) : '+ Add return'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="px-4 py-4 cursor-pointer border-b border-gray-100" onClick={() => setOpenSheet('passengers')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <Users size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">
                {passengers.adults + passengers.children + passengers.infants} {passengers.adults + passengers.children + passengers.infants === 1 ? 'Passenger' : 'Passengers'}
              </div>
              <div className="font-poppins text-xs text-gray-500 mt-1">
                {passengers.adults} {passengers.adults === 1 ? 'Adult' : 'Adults'}{passengers.children > 0 ? `, ${passengers.children} ${passengers.children === 1 ? 'Child' : 'Children'}` : ''}{passengers.infants > 0 ? `, ${passengers.infants} ${passengers.infants === 1 ? 'Infant' : 'Infants'}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-city дополнительные формы */}
      {tripType === 'Multi-city' && (
        <div className="mt-4 space-y-4">
          {multiSegments.map((segment, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl shadow-lg p-4">
              <button
                onClick={() => handleRemoveSegment(idx)}
                className="absolute -top-3 right-0 w-7 h-7 p-0 bg-red-500 text-white rounded-full flex items-center justify-center text-base hover:bg-red-600 transition-colors cursor-pointer z-20 shadow-md"
                aria-label="Remove segment"
              >
                <X size={16} />
              </button>
              
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setMultiCityTab('from')
                  setMultiCityActiveIndex(idx)
                  setMultiCityModalOpen(true)
                }}
              >
                <Plane size={16} className="text-[#0ABAB5]" />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
                  <div className="font-poppins text-sm text-[#0D2B29]">
                    {segment.fromSelection ? `${segment.fromSelection.name}, ${segment.fromSelection.country}` : segment.from || 'Flying from?'}
                  </div>
                </div>
                {segment.fromSelection && (
                  <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                    {segment.fromSelection.code}
                  </div>
                )}
              </div>
              
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setMultiCityTab('to')
                  setMultiCityActiveIndex(idx)
                  setMultiCityModalOpen(true)
                }}
              >
                <MapPin size={16} className="text-[#0ABAB5]" />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
                  <div className="font-poppins text-sm text-[#0D2B29]">
                    {segment.toSelection ? `${segment.toSelection.name}, ${segment.toSelection.country}` : segment.to || 'Where are you flying?'}
                  </div>
                </div>
                {segment.toSelection && (
                  <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                    {segment.toSelection.code}
                  </div>
                )}
              </div>
              
              <div 
                className="flex items-center gap-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setActiveMultiIndex(idx)
                  setActiveModal('multi-calendar')
                }}
              >
                <CalendarIcon size={16} className="text-[#0ABAB5]" />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                  <div className={`font-poppins text-sm ${segment.date ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                    {segment.date ? formatDate(segment.date) : 'Select Date'}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Кнопки для Multi-city */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex w-full gap-3 justify-center">
              <button
                onClick={handleAddSegment}
                className="h-12 px-6 bg-white border border-gray-300 text-[#0D2B29] font-poppins font-semibold text-base rounded-full hover:border-[#0ABAB5] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} />
                Add a Flight
              </button>
              <button
                onClick={handleClearAll}
                className="h-12 px-6 bg-white border border-gray-300 text-[#0D2B29] font-poppins font-semibold text-base rounded-full hover:border-[#0ABAB5] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
            <button className="h-12 w-full mt-2 bg-[#FF6B35] text-white font-poppins font-semibold text-base rounded-full hover:bg-[#E55A2B] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md">
              <Search size={18} />
              SEARCH FLIGHTS
            </button>
          </div>
        </div>
      )}

      {/* Search Button - для One way и Round Trip */}
      {tripType !== 'Multi-city' && (
        <button className="w-full bg-[#FF6B35] text-white font-poppins font-semibold py-4 rounded-2xl hover:bg-[#E55A2B] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4">
          <Search size={18} />
          SEARCH
        </button>
      )}

      {/* Modal для Calendar */}
      {activeModal === 'calendar' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Date</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Date Type Selector */}
          {tripType === 'Round Trip' && (
            <div className="flex border-b relative h-14">
              <button
                onClick={() => setCalendarMode('departure')}
                className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${calendarMode === 'departure' ? 'text-white' : 'text-gray-500'}`}
                style={{ position: 'relative', paddingTop: 0, paddingBottom: 0 }}
              >
                <span className="py-4 block">Departure Date</span>
              </button>
              <button
                onClick={() => setCalendarMode('return')}
                className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${calendarMode === 'return' ? 'text-white' : 'text-gray-500'}`}
                style={{ position: 'relative', paddingTop: 0, paddingBottom: 0 }}
              >
                <span className="py-4 block">Return Date</span>
              </button>
              <motion.div
                layout
                className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
                animate={{ x: calendarMode === 'return' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ zIndex: 1 }}
              />
            </div>
          )}
          
          {/* Calendar */}
          <div className="flex-1 p-4">
            <ScrollableCalendar
              selectedDate={calendarMode === 'departure' ? departureDate : returnDate}
              onDateSelect={(date) => {
                if (calendarMode === 'departure') {
                  setDepartureDate(date)
                  setReturnTabFlash(true)
                  setCalendarMode('return')
                  setActiveModal('calendar')
                } else {
                  setReturnDate(date)
                  setActiveModal(null)
                }
              }}
              minDate={calendarMode === 'departure' ? new Date() : departureDate || new Date()}
              departureFlash={departureFlash}
              onDepartureFlashEnd={() => setDepartureFlash(false)}
            />
          </div>
        </div>
      )}

      {/* Modal для Multi-city From */}
      {activeModal === 'multi-from' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">From</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <input
              type="text"
              value={multiSegments[activeMultiIndex]?.from || ''}
              onChange={(e) => handleMultiFromInputChange(activeMultiIndex, e.target.value)}
              placeholder="City or airport"
              className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
              autoFocus
            />
          </div>
          {multiFromSuggestions[activeMultiIndex]?.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4">
              {multiFromSuggestions[activeMultiIndex].map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(activeMultiIndex, city, 'from')
                    setActiveModal(null)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal для Multi-city To */}
      {activeModal === 'multi-to' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">To</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <input
              type="text"
              value={multiSegments[activeMultiIndex]?.to || ''}
              onChange={(e) => handleMultiToInputChange(activeMultiIndex, e.target.value)}
              placeholder="City or airport"
              className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
              autoFocus
            />
          </div>
          {multiToSuggestions[activeMultiIndex]?.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4">
              {multiToSuggestions[activeMultiIndex].map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(activeMultiIndex, city, 'to')
                    setActiveModal(null)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal для Multi-city Calendar */}
      {activeModal === 'multi-calendar' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Date</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Calendar */}
          <div className="flex-1 p-4">
            <ScrollableCalendar
              selectedDate={multiSegments[activeMultiIndex]?.date || null}
              onDateSelect={(date) => {
                const newSegments = [...multiSegments]
                newSegments[activeMultiIndex] = { ...newSegments[activeMultiIndex], date }
                setMultiSegments(newSegments)
                setActiveModal(null)
              }}
              minDate={new Date()}
              departureFlash={departureFlash}
              onDepartureFlashEnd={() => setDepartureFlash(false)}
            />
          </div>
        </div>
      )}

      {/* BottomSheet для TripType */}
      <BottomSheet open={openSheet === 'trip'} onClose={() => setOpenSheet(null)}>
        <h2 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 text-center">Trip Type</h2>
        {['One way', 'Round Trip', 'Multi-city'].map((type) => (
          <button
            key={type}
            onClick={() => { setTripType(type); setOpenSheet(null) }}
            className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] cursor-pointer font-poppins text-[#0D2B29] text-base first:rounded-t-xl last:rounded-b-xl"
            tabIndex={0}
          >
            {type}
          </button>
        ))}
      </BottomSheet>

      {/* BottomSheet для Class */}
      <BottomSheet open={openSheet === 'class'} onClose={() => setOpenSheet(null)}>
        <h2 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 text-center">Class</h2>
        {['Business class', 'First class'].map((cls) => (
          <button
            key={cls}
            onClick={() => { setSelectedClass(cls); setOpenSheet(null) }}
            className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] cursor-pointer font-poppins text-[#0D2B29] text-base first:rounded-t-xl last:rounded-b-xl"
            tabIndex={0}
          >
            {cls}
          </button>
        ))}
      </BottomSheet>

      {/* BottomSheet для Passengers */}
      <BottomSheet open={openSheet === 'passengers'} onClose={() => setOpenSheet(null)}>
        <h2 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 text-center">Passengers</h2>
        <div className="flex flex-col gap-3">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-poppins font-medium text-[#0D2B29]">Adults</div>
              <div className="font-poppins text-xs text-gray-500">12+ years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('adults', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.adults <= 1}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.adults}</span>
              <button
                onClick={() => updatePassengerCount('adults', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-poppins font-medium text-[#0D2B29]">Children</div>
              <div className="font-poppins text-xs text-gray-500">2-11 years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('children', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.children <= 0}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.children}</span>
              <button
                onClick={() => updatePassengerCount('children', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
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
              <div className="font-poppins text-xs text-gray-500">under 2 years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('infants', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.infants <= 0}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.infants}</span>
              <button
                onClick={() => updatePassengerCount('infants', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* BottomSheet для From/Going to */}
      {citySheetOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Cities</h2>
            <button onClick={() => setCitySheetOpen(false)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex border-b relative h-14">
            <button
              onClick={() => setCityTab('from')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${cityTab === 'from' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">From</span>
            </button>
            <button
              onClick={() => setCityTab('to')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${cityTab === 'to' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">Going to</span>
            </button>
            <motion.div
              layout
              className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
              animate={{ x: cityTab === 'to' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="p-4">
            {cityTab === 'from' && (
              <input
                type="text"
                value={fromInput}
                onChange={e => handleFromInputChange(e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            {cityTab === 'to' && (
              <input
                type="text"
                value={toInput}
                onChange={e => handleToInputChange(e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            <div className="flex-1 overflow-y-auto px-0">
              {cityTab === 'from' && fromSuggestions.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFromSelection(city)
                    setFromInput(`${city.name}, ${city.country}`)
                    setShowFromSuggestions(false)
                    setCityTab('to')
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
              {cityTab === 'to' && toSuggestions.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setToSelection(city)
                    setToInput(`${city.name}, ${city.country}`)
                    setShowToSuggestions(false)
                    setCitySheetOpen(false)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal для Multi-city Cities */}
      {multiCityModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Cities</h2>
            <button onClick={() => setMultiCityModalOpen(false)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex border-b relative h-14">
            <button
              onClick={() => setMultiCityTab('from')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${multiCityTab === 'from' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">From</span>
            </button>
            <button
              onClick={() => setMultiCityTab('to')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${multiCityTab === 'to' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">Going to</span>
            </button>
            <motion.div
              layout
              className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
              animate={{ x: multiCityTab === 'to' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="p-4">
            {multiCityTab === 'from' && (
              <input
                type="text"
                value={multiSegments[multiCityActiveIndex]?.from || ''}
                onChange={e => handleMultiFromInputChange(multiCityActiveIndex, e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            {multiCityTab === 'to' && (
              <input
                type="text"
                value={multiSegments[multiCityActiveIndex]?.to || ''}
                onChange={e => handleMultiToInputChange(multiCityActiveIndex, e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            <div className="flex-1 overflow-y-auto px-0">
              {multiCityTab === 'from' && multiFromSuggestions[multiCityActiveIndex]?.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(multiCityActiveIndex, city, 'from')
                    setMultiCityTab('to')
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
              {multiCityTab === 'to' && multiToSuggestions[multiCityActiveIndex]?.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(multiCityActiveIndex, city, 'to')
                    setMultiCityModalOpen(false)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]">{city.name}</div>
                        <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlightSearchFormMobile 