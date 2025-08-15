import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await req.json()
    const reviews = body?.reviews || []

    if (!Array.isArray(reviews)) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
    }

    if (!supabase) {
      return new NextResponse(JSON.stringify({ ok: true, stored: 'local-only' }), {
        status: 200,
        headers: { 'x-reviews-write': 'local' }
      })
    }

    // First, delete all existing reviews to sync with admin state
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .not('id', 'is', null) // Delete all records

    if (deleteError) {
      return new NextResponse(
        JSON.stringify({ ok: false, error: deleteError.message, hint: 'delete_failed' }),
        { status: 500, headers: { 'x-reviews-write': 'supabase' } }
      )
    }

    // If no reviews to insert, return success
    if (reviews.length === 0) {
      return new NextResponse(JSON.stringify({ ok: true, count: 0, method: 'delete_all' }), {
        status: 200,
        headers: { 'x-reviews-write': 'supabase' }
      })
    }

    // Map admin ReviewData to Supabase table schema
    // Only include fields that exist in the actual table
    const mappedReviews = reviews.map(review => ({
      name: review.name,
      avatar_url: review.avatar,
      rating: review.rating,
      text: review.review,
      review_date: review.date
    }))

    // Insert new reviews
    const { error: insertError } = await supabase
      .from('reviews')
      .insert(mappedReviews)

    if (!insertError) {
      return new NextResponse(JSON.stringify({ ok: true, count: reviews.length, method: 'replace_all' }), {
        status: 200,
        headers: { 'x-reviews-write': 'supabase' }
      })
    }

    return new NextResponse(
      JSON.stringify({ ok: false, error: insertError.message, hint: 'insert_failed' }),
      { status: 500, headers: { 'x-reviews-write': 'supabase' } }
    )
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}