"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'

type Review = {
  name: string
  avatar?: string
  date: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
}

// Reviews are loaded from API. No local base fallback.

function Stars({ rating }: { rating: number }) {
  return (
    <Image src={`/icons/testimonials/${rating} star.svg`} alt={`${rating} stars`} width={105} height={20} />
  )
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  const s = parts[0] || ''
  return (s.slice(0, 2)).toUpperCase()
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="mb-4 break-inside-avoid rounded-3xl bg-white border border-[#E8F4F4] p-5 shadow-[0_4px_10px_rgba(0,46,52,0.06)]">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative bg-gray-100">
          {r.avatar ? (
            <Image src={r.avatar} alt={r.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className="w-full h-full bg-[#0ABAB5] text-white flex items-center justify-center">
              <span className="text-xs font-semibold font-poppins">{getInitials(r.name)}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-[#0D2B29] font-poppins text-sm font-semibold uppercase">{r.name}</div>
          <div className="text-[#0D2B29]/60 text-xs">{r.date}</div>
        </div>
      </header>
      <div className="mt-3"><Stars rating={r.rating} /></div>
      <p className="mt-3 text-[#0D2B29] text-sm leading-relaxed">{r.text}</p>
    </article>
  )
}

export default function ReviewsStaggeredGrid() {
  const [reviews, setReviews] = useState<Review[] | null>(null)

  type ApiReviewRow = {
    name?: string
    avatar?: string
    avatar_url?: string
    date?: string
    review_date?: string
    created_at?: string
    rating?: number | string
    review?: string
    text?: string
  }

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' })
      const json = await res.json()
      const dataUnknown = json.reviews as unknown
      if (!Array.isArray(dataUnknown)) {
        setReviews([])
        return
      }
      const mapped: Review[] = (dataUnknown as unknown[]).map((row) => {
        const r = row as ApiReviewRow
        return {
          name: r.name || '',
          avatar: r.avatar || r.avatar_url || undefined,
          date: r.date || r.review_date || (r.created_at ? r.created_at.slice(0, 10) : '') || '',
          rating: Math.max(1, Math.min(5, Number(r.rating ?? 5))) as 1 | 2 | 3 | 4 | 5,
          text: r.review || r.text || '',
        }
      })
      setReviews(mapped)
    } catch {
      setReviews([])
    }
  }, [])

  useEffect(() => { void fetchReviews() }, [fetchReviews])

  return (
    <section id="reviews" className="w-full py-10">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="columns-1 md:columns-2 xl:columns-3 gap-4 [column-fill:_balance]"><div>
          {(reviews ?? []).map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div></div>
      </div>
    </section>
  )
}

