import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ reviews: [], error: 'Supabase env missing' }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)

    if (error) {
      return NextResponse.json({ reviews: [], error: error.message }, { status: 200 })
    }

    return NextResponse.json({ reviews: data ?? [] }, { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ reviews: [], error: msg }, { status: 200 })
  }
}

