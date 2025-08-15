"use client"

import Image from 'next/image'
import FlightSummaryChips from '@/components/flight-summary-chips'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import useOfferId from '@/hooks/useOfferId'

export const dynamic = 'force-static'

type SearchParams = Record<string, string | string[] | undefined>

function formatDate(iso?: string): string | null {
  if (!iso) return null
  try {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

function PageInner() {
  const sp = useSearchParams()
  const offerId = useOfferId()
  const getStr = (key: string, fallback = '') => sp.get(key) ?? fallback
  const from = getStr('from')
  const to = getStr('to')
  const departure = formatDate(getStr('departureDate'))
  const ret = formatDate(getStr('returnDate'))
  const pax = Number(getStr('passengers', '1')) || 1
  const cls = getStr('class', 'Business class')
  const tripType = getStr('tripType', ret ? 'Round Trip' : 'One-way')

  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [bgHeight, setBgHeight] = useState<number>(380)
  const NAV_OFFSET = 96

  // airports lookup
  // chips component will render names

  useEffect(() => {
    const recalc = () => {
      const w = wrapperRef.current?.getBoundingClientRect()
      const h = heroRef.current?.getBoundingClientRect()
      const i = infoRef.current?.getBoundingClientRect()
      if (w && h && i) {
        const infoTop = i.top - w.top
        const halfInfo = i.height / 2
        setBgHeight(Math.max(260, Math.round(infoTop + halfInfo)))
      }
    }
    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [])

  return (
    <main ref={wrapperRef} className="min-h-screen bg-[#F0FBFA] relative">
      {/* Top BG layer non-sticky, extends under navbar by NAV_OFFSET */}
      <div
        className="absolute inset-x-0 z-0 bg-[#0ABAB5] pointer-events-none"
        style={{ top: -NAV_OFFSET, height: bgHeight + NAV_OFFSET }}
      />

      {/* Page-scoped navbar to sit on same background */}
      <Navbar isDarkBackground={true} />

      <section className="bg-transparent relative z-10" ref={heroRef}>
        <div className="mx-auto max-w-[870px] px-4 pt-28 pb-20 md:pt-32 md:pb-24 text-center">
          <h1 className="text-white font-ubuntu text-[34px] md:text-[40px] leading-tight">
            Thank You for Choosing Fly Lux Sky!
          </h1>
          <div className="mt-2 text-white/90 text-sm">
            <span className="opacity-80">Offer ID </span>
            <span className="font-semibold">#{offerId}</span>
          </div>
          <h2 className="mt-6 text-white text-[20px] md:text-[22px] font-medium">
            We’re Crafting Your Perfect Trip
          </h2>
          <p className="text-white/90 mt-4 text-[14px] leading-[1.5]">
            Thank you for requesting a quote! Our expert travel advisors are already working on curating the most
            exclusive business-class fares tailored just for you. Expect a call from your personal agent within the next 1
            hour to finalize your itinerary.
          </p>
        </div>
      </section>

      {/* Summary of user's selection (reused component) */}
      <section ref={infoRef} className="mt-10 md:mt-16">
        <FlightSummaryChips />
      </section>

      {/* Next steps */}
      <section className="mx-auto max-w-[1200px] px-4 mt-10 md:mt-14">
        <div className="rounded-2xl bg-white p-6 md:p-10 shadow-[0_4px_4px_rgba(0,46,52,0.1)]">
          <h2 className="text-[#0D2B29] text-center text-[24px] md:text-[28px] font-semibold">What Happens Next?</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_4px_rgba(0,46,52,0.1)]">
              <div className="space-y-3">
                <div className="text-[#0D2B29] font-semibold text-[18px]">Personalized Consultation:</div>
                <p className="text-[#0D2B29] text-[16px] leading-[1.5]">
                  Your personal agent will discuss your preferences and offer 2-3 flight options.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_4px_rgba(0,46,52,0.1)]">
              <div className="space-y-3">
                <div className="text-[#0D2B29] font-semibold text-[18px]">Exclusive Access</div>
                <p className="text-[#0D2B29] text-[16px] leading-[1.5]">
                  Unlock fares with top airlines like Emirates, Qatar Airways, and Singapore Airlines—rates you won’t find
                  anywhere else.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_4px_rgba(0,46,52,0.1)]">
              <div className="space-y-3">
                <div className="text-[#0D2B29] font-semibold text-[18px]">Seamless Planning</div>
                <p className="text-[#0D2B29] text-[16px] leading-[1.5]">
                  We’ll take care of every detail, from seat selection to lounge access, making sure your trip goes smoothly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Removed city-specific inspiration section */}

      <section className="mx-auto max-w-[1200px] px-4 mt-16 md:mt-20 mb-24">
        <div className="rounded-2xl bg-[#EC5E39] p-8 md:p-12 text-center text-white">
          <h3 className="text-[26px] md:text-[30px] font-semibold">Unlock a Special Perk!</h3>
          <p className="mt-4 text-[18px] md:text-[22px] max-w-[900px] mx-auto leading-snug">
            Book within 48 hours of your agent’s call and enjoy priority boarding or a complimentary lounge pass on us—an
            exclusive thank-you for choosing Fly Lux Sky.
          </p>
        </div>
      </section>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense>
      <PageInner />
    </Suspense>
  )
}

