"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Mail, Phone, Plane, CheckCircle, AlertCircle, Hotel, Ship } from 'lucide-react'
import CustomPhoneInput from './custom-phone-input'
import { calculateTotalPriceWithPassengers } from '@/lib/flightGenerator'

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string }) => void
  variant?: 'brand' | 'neutral'
  selectedFlight?: {
    airline: string
    flightNumber?: string
    price: number
    totalPrice?: number
    duration?: string
    stops?: number
    stopoverAirports?: { code: string; city: string; country: string }[]
    departure?: {
      time: string
      airport: string
    }
    arrival?: {
      time: string
      airport: string
    }
  } | null
  selectedMultiCityFlight?: {
    id: number
    segments: {
      airline: string
      flightNumber: string
      departure: { time: string; airport: string; city: string }
      arrival: { time: string; airport: string; city: string }
      duration: string
      stops: number
      stopoverAirports?: { code: string; city: string; country: string }[]
      price: number
      class: string
    }[]
    totalPrice: number
    totalDuration: string
    class: string
    seatsLeft: number
  } | null
  passengers?: string
}

const FlightSearchFormVertical: React.FC<ContactFormProps> = ({ onSubmit, variant = 'brand', selectedFlight, selectedMultiCityFlight, passengers }) => {
  const router = useRouter()
  const sp = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [additionalServices, setAdditionalServices] = useState({
    needHotel: false,
    needCruise: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (submissionStatus) setSubmissionStatus(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Логирование для отладки
    console.log('Form submission data:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nameLength: formData.name?.length || 0,
      emailLength: formData.email?.length || 0,
      phoneLength: formData.phone?.length || 0
    })
    
    // Более строгая валидация телефона
    const phoneDigits = formData.phone?.replace(/\D/g, '') || ''
    const isPhoneValid = phoneDigits.length >= 10 // Минимум 10 цифр для полного номера
    
    if (!formData.name || !formData.email || !formData.phone || !isPhoneValid) {
      console.log('Validation failed:', {
        hasName: !!formData.name,
        hasEmail: !!formData.email,
        hasPhone: !!formData.phone,
        phoneDigits: phoneDigits,
        phoneDigitsLength: phoneDigits.length,
        isPhoneValid: isPhoneValid
      })
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMessage('Please fill in all required fields')
      } else if (!isPhoneValid) {
        setErrorMessage('Please enter a valid phone number')
      }
      setSubmissionStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmissionStatus(null)

    try {
      // Collect all search parameters from URL
      const from = sp.get('from') || ''
      const to = sp.get('to') || ''
      const departureDate = sp.get('departureDate') || ''
      const returnDate = sp.get('returnDate') || ''
      const passengers = sp.get('passengers') || '1'
      const flightClass = sp.get('class') || 'Economy'
      const tripType = sp.get('tripType') || 'One-way'
      
      // Parse passengers count to get adults, children, infants
      const totalPassengers = parseInt(passengers, 10)
      const adults = parseInt(sp.get('adults') || '1', 10)
      const children = parseInt(sp.get('children') || '0', 10)
      const lapInfants = parseInt(sp.get('infants') || '0', 10)
      
      // Collect multi-city segments from URL if applicable
      let multiSegments: { from: string; to: string; date?: string }[] | undefined = undefined
      if (tripType === 'Multi-city') {
        const fromParams = sp.getAll('from')
        const toParams = sp.getAll('to')
        const dateParams = sp.getAll('departureDate')
        if (fromParams.length && fromParams.length === toParams.length) {
          multiSegments = fromParams.map((f, i) => ({
            from: f,
            to: toParams[i],
            date: dateParams[i] || undefined
          }))
        }
      }
      
      // Additional flight data from selected flight
      let airline = ''
      let flightTime = ''
      let pricePerPassenger = 0
      let priceTotal = 0
      
      if (selectedMultiCityFlight) {
        // Handle multi-city flight data
        airline = selectedMultiCityFlight.segments[0]?.airline || ''
        flightTime = selectedMultiCityFlight.segments[0] 
          ? `${selectedMultiCityFlight.segments[0].departure.time} - ${selectedMultiCityFlight.segments[0].arrival.time}`
          : ''
        pricePerPassenger = selectedMultiCityFlight.totalPrice
        priceTotal = calculateTotalPriceWithPassengers(selectedMultiCityFlight.totalPrice, adults, children, lapInfants).totalPrice
      } else if (selectedFlight) {
        // Handle regular flight data
        airline = selectedFlight.airline
        flightTime = selectedFlight.departure && selectedFlight.arrival 
          ? `${selectedFlight.departure.time} - ${selectedFlight.arrival.time}` 
          : ''
        const urlPricePerPassenger = sp.get('selectedPrice') ? parseInt(sp.get('selectedPrice')!, 10) : 0
        pricePerPassenger = selectedFlight.price || urlPricePerPassenger || 0
        const basePrice = selectedFlight.totalPrice || pricePerPassenger
        priceTotal = calculateTotalPriceWithPassengers(basePrice, adults, children, lapInfants).totalPrice
      } else {
        // Fallback to URL parameters
        airline = sp.get('selectedAirline') || ''
        flightTime = sp.get('selectedDuration') || ''
        const urlPricePerPassenger = sp.get('selectedPrice') ? parseInt(sp.get('selectedPrice')!, 10) : 0
        pricePerPassenger = urlPricePerPassenger
        priceTotal = calculateTotalPriceWithPassengers(pricePerPassenger, adults, children, lapInfants).totalPrice
      }
      
      const hotel = additionalServices.needHotel ? 'Yes' : 'No'
      const cruise = additionalServices.needCruise ? 'Yes' : 'No'
      
      // For multi-city flights, extract airline and flight time data for 2nd and 3rd segments
      let airline2nd = ''
      let airline3rd = ''
      let flightTime2nd = ''
      let flightTime3rd = ''
      
      if (tripType === 'Multi-city') {
        if (selectedMultiCityFlight && selectedMultiCityFlight.segments.length > 1) {
          // Get data from selected multi-city flight
          airline2nd = selectedMultiCityFlight.segments[1]?.airline || ''
          flightTime2nd = selectedMultiCityFlight.segments[1] 
            ? `${selectedMultiCityFlight.segments[1].departure.time} - ${selectedMultiCityFlight.segments[1].arrival.time}`
            : ''
          
          if (selectedMultiCityFlight.segments.length > 2) {
            airline3rd = selectedMultiCityFlight.segments[2]?.airline || ''
            flightTime3rd = selectedMultiCityFlight.segments[2]
              ? `${selectedMultiCityFlight.segments[2].departure.time} - ${selectedMultiCityFlight.segments[2].arrival.time}`
              : ''
          }
        } else {
          // Fallback to URL parameters if no selected flight
          const selectedAirlineParam = sp.get('selectedAirline') || ''
          const airlines = selectedAirlineParam.split(',').map(a => a.trim()).filter(a => a)
          
          // Set main airline from first segment
          if (airlines.length > 0 && !airline) {
            airline = airlines[0] || ''
          }
          
          if (airlines.length > 1) {
            airline2nd = airlines[1] || ''
          }
          if (airlines.length > 2) {
            airline3rd = airlines[2] || ''
          }
          
          // Get flight times from URL parameters
          const selectedDurationParam = sp.get('selectedDuration') || ''
          const durations = selectedDurationParam.split(',').map(d => d.trim()).filter(d => d)
          
          // Set main flight time from first segment
          if (durations.length > 0 && !flightTime) {
            flightTime = durations[0] || ''
          }
          
          if (durations.length > 1) {
            flightTime2nd = durations[1] || ''
          }
          if (durations.length > 2) {
            flightTime3rd = durations[2] || ''
          }
          
          // Set prices from URL if not set from selectedMultiCityFlight
          if (!pricePerPassenger) {
            const urlPricePerPassenger = sp.get('selectedPrice') ? parseInt(sp.get('selectedPrice')!, 10) : 0
            pricePerPassenger = urlPricePerPassenger
            priceTotal = calculateTotalPriceWithPassengers(pricePerPassenger, adults, children, lapInfants).totalPrice
          }
        }
      }
      
      // Log price information for debugging
      console.log('=== Price Information ===');
      console.log('URL selectedPrice:', sp.get('selectedPrice'));
      console.log('pricePerPassenger:', pricePerPassenger);
      console.log('selectedFlight?.price:', selectedFlight?.price);
      console.log('selectedFlight?.totalPrice:', selectedFlight?.totalPrice);
      console.log('selectedMultiCityFlight?.totalPrice:', selectedMultiCityFlight?.totalPrice);
      console.log('Final pricePerPassenger:', pricePerPassenger);
      console.log('Final priceTotal:', priceTotal);
      console.log('passengers:', passengers);
      
      // Log multi-city airline and flight time information for debugging
      if (tripType === 'Multi-city') {
        console.log('=== Multi-City Flight Information ===');
        console.log('selectedAirline param:', sp.get('selectedAirline'));
        console.log('selectedDuration param:', sp.get('selectedDuration'));
        console.log('airline2nd:', airline2nd);
        console.log('airline3rd:', airline3rd);
        console.log('flightTime2nd:', flightTime2nd);
        console.log('flightTime3rd:', flightTime3rd);
      }
      
      // Format stops with detailed information
      let stops = ''
      if (selectedFlight?.stops) {
        stops = selectedFlight.stopoverAirports && selectedFlight.stopoverAirports.length > 0
          ? `${selectedFlight.stops} stop${selectedFlight.stops > 1 ? 's' : ''} via ${selectedFlight.stopoverAirports.map(airport => `${airport.code} (${airport.country})`).join(', ')}`
          : `${selectedFlight.stops} stop${selectedFlight.stops > 1 ? 's' : ''}`
      } else if (selectedMultiCityFlight && selectedMultiCityFlight.segments.length > 0) {
        // For multi-city flights, get stops from first segment
        const firstSegment = selectedMultiCityFlight.segments[0]
        if (firstSegment.stops) {
          stops = firstSegment.stopoverAirports && firstSegment.stopoverAirports.length > 0
            ? `${firstSegment.stops} stop${firstSegment.stops > 1 ? 's' : ''} via ${firstSegment.stopoverAirports.map(airport => `${airport.code} (${airport.country})`).join(', ')}`
            : `${firstSegment.stops} stop${firstSegment.stops > 1 ? 's' : ''}`
        }
      } else {
        // Fallback to URL parameters
        const urlStops = sp.get('selectedStops')
        if (urlStops) {
          stops = urlStops
        }
      }
      
      // Prepare data for Kommo API
      const requestData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        from,
        to,
        tripType,
        departureDate,
        returnDate,
        passengers: totalPassengers,
        adults,
        children,
        lapInfants,
        class: flightClass,
        airline,
        flightTime,
        hotel,
        cruise,
        pricePerPassenger,
        priceTotal,
        stops,
        airline2nd,
        airline3rd,
        flightTime2nd,
        flightTime3rd
      }
      
      if (multiSegments) {
        requestData.multiSegments = multiSegments
      }
      
      // Log the data being sent for debugging
      console.log('=== Frontend Form Data Being Sent ===', requestData)
      
      // Validate required fields before sending
      if (!requestData.name || !requestData.email || !requestData.phone) {
        setErrorMessage('Please fill in all required fields (name, email, phone)')
        setSubmissionStatus('error')
        return
      }
      
      if (!requestData.from || !requestData.to) {
        setErrorMessage('Please specify departure and destination airports')
        setSubmissionStatus('error')
        return
      }
      
      // Validate trip type
      const validTripTypes = ['One-way', 'Round Trip', 'Round-trip', 'Multi-city']
      if (requestData.tripType && !validTripTypes.includes(requestData.tripType)) {
        setErrorMessage('Please select a valid trip type.')
        setSubmissionStatus('error')
        return
      }
      
      // Validate cabin class
      const validCabinClasses = ['Economy', 'Premium', 'Business', 'First', 'Business class', 'First class']
      if (requestData.class && !validCabinClasses.includes(requestData.class)) {
        setErrorMessage('Please select a valid cabin class.')
        setSubmissionStatus('error')
        return
      }
      
      // Validate date format
      if (requestData.departureDate) {
        const depDate = new Date(requestData.departureDate)
        if (isNaN(depDate.getTime())) {
          setErrorMessage('Please enter a valid departure date.')
          setSubmissionStatus('error')
          return
        }
        // Check if departure date is in the past
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (depDate < today) {
          setErrorMessage('Departure date cannot be in the past.')
          setSubmissionStatus('error')
          return
        }
      }
      if (requestData.returnDate) {
        const retDate = new Date(requestData.returnDate)
        if (isNaN(retDate.getTime())) {
          setErrorMessage('Please enter a valid return date.')
          setSubmissionStatus('error')
          return
        }
        // Check if return date is before departure date
        if (requestData.departureDate && retDate < new Date(requestData.departureDate)) {
          setErrorMessage('Return date cannot be before departure date.')
          setSubmissionStatus('error')
          return
        }
      }
      
      // Validate numeric fields
      if (isNaN(requestData.passengers) || requestData.passengers < 1) {
        setErrorMessage('Invalid number of passengers')
        setSubmissionStatus('error')
        return
      }
      
      // Send data to Kommo API
      const response = await fetch('/api/kommo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('=== API Response Error Details ===', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestData
        })
        
        // More specific error messages based on status code
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        if (response.status === 400) {
           errorMessage = 'Invalid data format. Please check your information and try again.'
           if (errorData?.details) {
             console.error('=== Detailed 400 Error ===', errorData.details)
           }
           // Log validation errors specifically
            if (errorData?.['validation-errors']) {
              console.error('=== Validation Errors ===', errorData['validation-errors'])
              errorData['validation-errors'].forEach((error: any, index: number) => {
                console.error(`Validation Error ${index + 1}:`, error)
              })
            }
         } else if (response.status === 401) {
          errorMessage = 'Authentication error. Please try again later.'
        } else if (response.status >= 500) {
          errorMessage = 'Server is temporarily unavailable. Please try again later.'
        }
        
        setErrorMessage(errorMessage)
        throw new Error(errorMessage)
      }
      
      if (onSubmit) onSubmit(formData)
      
      // Build thank-you URL with current search context if present
      const query = new URLSearchParams()
      const keys = ['from','to','departureDate','returnDate','passengers','adults','children','infants','class','tripType'] as const
      keys.forEach(k => {
        const v = sp.get(k)
        if (v) query.set(k, v)
      })
      router.push(`/thank-you${query.toString() ? `?${query.toString()}` : ''}`)
      return
    } catch (error) {
      console.error('Form submission error:', error)
      if (!errorMessage) {
        setErrorMessage('Unable to submit form. Please try again.')
      }
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNeutral = variant === 'neutral'

  return (
    <div className="relative">
      {/* Background gradient (brand only) */}
      {!isNeutral && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#ec5e39]/10 via-[#ec5e39]/5 to-[#ec5e39]/15 rounded-3xl"></div>
      )}
      
      <div className={`${isNeutral ? 'relative bg-white rounded-3xl p-5 max-w-md mx-auto' : 'relative bg-[#ec5e39] backdrop-blur-sm rounded-3xl shadow-2xl border border-[#ec5e39]/30 p-5 max-w-md mx-auto'}`}>
        {/* Header */}
        <div className="text-center mb-5">
          <div className={`${isNeutral ? 'w-12 h-12 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-3' : 'w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30'}`}>
            <Plane size={20} className={`${isNeutral ? 'text-[#0ABAB5]' : 'text-white'}`} />
          </div>
          <h2 className={`font-poppins font-bold text-xl ${isNeutral ? 'text-[#0D2B29]' : 'text-white'} mb-1`}>
            Get a free quote
          </h2>
          <p className={`font-poppins text-xs ${isNeutral ? 'text-gray-600' : 'text-white/80'}`}>
            Please fill in your details below
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'name' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <User size={16} className={focusedField === 'name' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Full Name
              </label>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your full name"
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border-2 border-gray-300 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'email' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <Mail size={16} className={focusedField === 'email' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Email Address
              </label>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your email address"
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border-2 border-gray-300 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'phone' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <Phone size={16} className={focusedField === 'phone' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Phone Number
              </label>
            </div>
            <CustomPhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value || '')}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border-2 border-gray-300 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              style="vertical"
              required
              onValidationChange={(isValid) => console.log('Phone validation:', isValid)}
            />
          </div>

          {/* Additional Services */}
          <div className="space-y-3">
            <div className={`flex items-center gap-2 mb-3`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30'}`}>
                <Plane size={16} className={isNeutral ? 'text-[#0ABAB5]' : 'text-white'} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Additional Services
              </label>
            </div>
            
            {/* Hotel Checkbox */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={additionalServices.needHotel}
                    onChange={(e) => setAdditionalServices(prev => ({ ...prev, needHotel: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                    additionalServices.needHotel
                      ? (isNeutral ? 'bg-[#0ABAB5] border-[#0ABAB5]' : 'bg-white border-white')
                      : (isNeutral ? 'border-gray-300 bg-white' : 'border-white/50 bg-white/10')
                  }`}>
                    {additionalServices.needHotel && (
                      <CheckCircle size={12} className={isNeutral ? 'text-white' : 'text-[#0ABAB5]'} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hotel size={16} className={isNeutral ? 'text-[#0ABAB5]' : 'text-white'} />
                  <span className={`font-poppins text-sm font-medium ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                    I need hotel accommodation
                  </span>
                </div>
              </label>
            </div>
            
            {/* Cruise Checkbox */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={additionalServices.needCruise}
                    onChange={(e) => setAdditionalServices(prev => ({ ...prev, needCruise: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                    additionalServices.needCruise
                      ? (isNeutral ? 'bg-[#0ABAB5] border-[#0ABAB5]' : 'bg-white border-white')
                      : (isNeutral ? 'border-gray-300 bg-white' : 'border-white/50 bg-white/10')
                  }`}>
                    {additionalServices.needCruise && (
                      <CheckCircle size={12} className={isNeutral ? 'text-white' : 'text-[#0ABAB5]'} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ship size={16} className={isNeutral ? 'text-[#0ABAB5]' : 'text-white'} />
                  <span className={`font-poppins text-sm font-medium ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                    I'm interested in cruise packages
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-5 rounded-xl font-poppins font-bold transition-all duration-300 transform ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed scale-95'
                : (isNeutral ? 'bg-[#EC5E39] text-white hover:bg-[#d54d2a] hover:scale-105 active:scale-95' : 'bg-white text-[#ec5e39] hover:bg-white/90 hover:scale-105 active:scale-95')
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plane size={16} />
                  <span>Get a free quote</span>
                </>
              )}
            </div>
          </button>

          {/* Status Messages */}
          {submissionStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-poppins font-semibold">
                Information submitted successfully!
              </span>
            </div>
          )}
          
          {submissionStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-red-700 font-poppins font-semibold">
                {errorMessage || 'Unable to submit form. Please check your information and try again.'}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FlightSearchFormVertical