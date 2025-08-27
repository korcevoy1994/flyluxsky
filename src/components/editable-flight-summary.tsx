"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Users, Edit3 } from 'lucide-react'
import airportsData from '@/lib/airports.json'
import FlightSearchFormMobile from '@/components/flight-search-form-mobile'
import FlightSearchForm from '@/components/flight-search-form'
import SearchModal from '@/components/search-modal'
import { useFlightSearch } from '@/hooks/useFlightSearch'
import { Airport, formatAirportName } from '@/lib/utils'

type AirportType = { code: string; city?: string; name?: string }

function formatDate(iso?: string | null): string | null {
  if (!iso) return null
  try {
    const d = new Date(`${iso}T00:00:00`)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function EditableFlightSummary() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDesktopFormOpen, setIsDesktopFormOpen] = useState(false)
  const sp = useSearchParams()
  const router = useRouter()
  
  const getStr = (key: string, fallback = '') => sp.get(key) ?? fallback
  const from = getStr('from')
  const to = getStr('to')
  const departure = formatDate(getStr('departureDate'))
  const returnDate = formatDate(getStr('returnDate'))
  const pax = Number(getStr('passengers', '1')) || 1
  const cls = getStr('class', 'Business class')

  const airportsMap = new Map((airportsData as AirportType[]).map((a) => [a.code, a]))
  const fromAirport = airportsMap.get(from)
  const toAirport = airportsMap.get(to)
  
  const searchState = useFlightSearch(null)
  
  // Set initial values from URL params
  React.useEffect(() => {
    if (fromAirport) {
      // Find the full airport data from airports.json
      const fullAirportData = (airportsData as Airport[]).find(a => a.code === fromAirport.code)
      if (fullAirportData) {
        searchState.setFromSelection(fullAirportData)
        // Also set the input value to show the airport name
        searchState.setFromInput(formatAirportName(fullAirportData.name))
      }
    }
    if (toAirport) {
      // Find the full airport data from airports.json
      const fullAirportData = (airportsData as Airport[]).find(a => a.code === toAirport.code)
      if (fullAirportData) {
        searchState.setToSelection(fullAirportData)
        // Also set the input value to show the airport name
        searchState.setToInput(formatAirportName(fullAirportData.name))
      }
    }
    if (getStr('departureDate')) {
      const date = new Date(getStr('departureDate'))
      if (!isNaN(date.getTime())) {
        searchState.setDepartureDate(date)
      }
    }
    if (getStr('returnDate')) {
      const date = new Date(getStr('returnDate'))
      if (!isNaN(date.getTime())) {
        searchState.setReturnDate(date)
      }
    }
    if (getStr('passengers')) {
      const passengerCount = Number(getStr('passengers'))
      if (passengerCount > 0) {
        searchState.setPassengers({ adults: passengerCount, children: 0, infants: 0 })
      }
    }
    if (getStr('class')) {
      searchState.setSelectedClass(getStr('class'))
    }
    if (getStr('tripType')) {
      searchState.setTripType(getStr('tripType') as 'One-way' | 'Round Trip' | 'Multi-city')
    }
  }, [sp])

  const handleEditClick = () => {
    // For mobile - open modal
    if (window.innerWidth < 768) {
      setIsModalOpen(true)
    } else {
      // For desktop - toggle form visibility
      setIsDesktopFormOpen(!isDesktopFormOpen)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 mt-1">
        <div className="w-full">
          {/* Mobile version - improved compact layout */}
          <div className="block md:hidden px-4">
            <div className="w-full">
              <button
                onClick={handleEditClick}
                className="w-full inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm border border-gray-200 text-[#0D2B29] text-xs hover:shadow-md hover:border-[#0ABAB5] transition-all duration-200 group"
              >
                <span className="inline-flex items-center gap-1">
                  <Image src="/icons/calendar.svg" alt="" width={12} height={12} style={{height: 'auto'}} />
                  <span className="whitespace-nowrap">{departure}{returnDate ? ` - ${returnDate}` : ''}</span>
                </span>
                <span className="text-[#0D2B29]/30">•</span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} className="text-[#0ABAB5]" />
                  <span className="whitespace-nowrap">{pax} passenger{pax > 1 ? 's' : ''}</span>
                </span>
                <span className="text-[#0D2B29]/30">•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#0ABAB5]" />
                  <span className="whitespace-nowrap">{cls}</span>
                </span>
                <span className="text-[#0D2B29]/30">•</span>
                <span className="inline-flex items-center gap-1">
                  <Edit3 size={12} className="text-[#0ABAB5]" />
                  <span className="whitespace-nowrap">Edit Flight</span>
                </span>
              </button>
            </div>
          </div>
          
          {/* Desktop version - original compact layout */}
          <div className="hidden md:flex justify-center">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200 text-[#0D2B29] text-sm hover:shadow-md hover:border-[#0ABAB5] transition-all duration-200 group"
            >
              <span className="inline-flex items-center gap-1.5">
                <Image src="/icons/calendar.svg" alt="" width={14} height={14} style={{height: 'auto'}} />
                <span>{departure}{returnDate ? ` - ${returnDate}` : ''}</span>
              </span>
              <span className="text-[#0D2B29]/20">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} className="text-[#0ABAB5]" />
                <span>{pax} passenger{pax > 1 ? 's' : ''}</span>
              </span>
              <span className="text-[#0D2B29]/20">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
                <span>{cls}</span>
              </span>
              <span className="text-[#0D2B29]/20">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Edit3 size={14} className="text-[#0ABAB5]" />
                <span>Edit Flight</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Search Form */}
      {isDesktopFormOpen && (
        <div className="hidden md:block mt-4">
          <FlightSearchForm 
            isSticky={false}
            {...searchState}
          />
        </div>
      )}

      {/* Mobile Search Modal */}
      <SearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="px-1 py-1">
          <FlightSearchFormMobile 
            {...searchState}
            coords={null}
          />
        </div>
      </SearchModal>
    </>
  )
}