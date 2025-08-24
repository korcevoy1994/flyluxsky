"use client"

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import airportsData from '@/lib/airports.json'
import React from 'react'
import { Users } from 'lucide-react'

type Airport = { code: string; city?: string; name?: string }

function formatDate(iso?: string | null): string | null {
  if (!iso) return null
  try {
    const d = new Date(`${iso}T00:00:00`)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

type FlightSummaryVariant = 'hero' | 'default' | 'compact'

export default function FlightSummaryChips({ variant = 'hero' }: { variant?: FlightSummaryVariant }) {
  const sp = useSearchParams()
  const getStr = (key: string, fallback = '') => sp.get(key) ?? fallback
  const from = getStr('from')
  const to = getStr('to')
  const departure = formatDate(getStr('departureDate'))
  const returnDate = formatDate(getStr('returnDate'))
  const pax = Number(getStr('passengers', '1')) || 1
  const cls = getStr('class', 'Business class')

  const airportsMap = new Map((airportsData as Airport[]).map((a) => [a.code, a]))
  const fromAirport = airportsMap.get(from)
  const toAirport = airportsMap.get(to)

  const outerClasses = variant === 'hero'
    ? 'mx-auto max-w-7xl px-4 -mt-8 md:-mt-10 relative z-10'
    : variant === 'compact'
    ? 'mx-auto max-w-7xl px-4 mt-1'
    : 'mx-auto max-w-7xl px-4 mt-6'

  const paddingClasses = variant === 'compact' ? 'p-3 md:p-4' : 'p-4 md:p-6'
  const rowClasses = `flex flex-wrap items-center ${variant === 'compact' ? 'gap-3 md:gap-4 text-xs md:text-sm' : 'gap-4 md:gap-5 text-sm'} text-[#0D2B29]`
  const chipPadding = variant === 'compact' ? 'px-2 py-1' : 'px-3 py-2'
  const arrowSize = variant === 'compact' ? 'w-6 h-6' : 'w-7 h-7'
  const codeSize = variant === 'compact' ? 'text-[10px] md:text-xs' : 'text-xs'

  return (
    <div className={outerClasses}>
      {variant === 'compact' ? (
        <div className="w-full">
          {/* Mobile version - improved compact layout */}
          <div className="block md:hidden">
            <div className="w-full flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm border border-gray-200 text-[#0D2B29] text-xs max-w-[95%]">
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
              </div>
            </div>
          </div>
          
          {/* Desktop version - original compact layout */}
          <div className="hidden md:flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200 text-[#0D2B29] text-sm">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute -inset-x-3 -bottom-4 h-6 bg-gradient-to-b from-[#0ABAB5]/15 to-transparent rounded-2xl blur-md pointer-events-none" />
          <div className="rounded-2xl bg-gradient-to-r from-[#E8F4F4] via-[#FDF1EE] to-[#E8F4F4] p-[1px] shadow-[0_6px_18px_rgba(0,46,52,0.08)]">
            <div className={`rounded-2xl bg-white ${paddingClasses}`}>
              <div className={rowClasses}>
                <span className={`inline-flex items-center gap-2 ${chipPadding} rounded-full bg-[#E8F4F4]`}>
                  <span className={`px-2 py-1 rounded-full bg-[#0ABAB5] text-white ${codeSize} font-semibold`}>{from || '—'}</span>
                  <span className="font-semibold">{fromAirport?.city || fromAirport?.name || from}</span>
                </span>

                <span className={`${arrowSize} rounded-full bg-[#0ABAB5]/10 text-[#0ABAB5] flex items-center justify-center`}>
                  ↔
                </span>

                <span className={`inline-flex items-center gap-2 ${chipPadding} rounded-full bg-[#E8F4F4]`}>
                  <span className={`px-2 py-1 rounded-full bg-[#0ABAB5] text-white ${codeSize} font-semibold`}>{to || '—'}</span>
                  <span className="font-semibold">{toAirport?.city || toAirport?.name || to}</span>
                </span>

                <span className="inline-flex items-center gap-2 text-[#0D2B29]">
                  <Image src="/icons/calendar.svg" alt="" width={16} height={16} style={{height: 'auto'}} />
                  <span>{departure}{returnDate ? ` - ${returnDate}` : ''}</span>
                </span>

                <span className="text-[#0D2B29]/20">•</span>

                <span className="inline-flex items-center gap-2">
                  <Users size={16} className="text-[#0ABAB5]" />
                  <span>{pax} passenger{pax > 1 ? 's' : ''}</span>
                </span>

                <span className="text-[#0D2B29]/20">•</span>

                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0ABAB5]" />
                  <span>{cls}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

