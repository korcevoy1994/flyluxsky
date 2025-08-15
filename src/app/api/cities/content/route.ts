import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

interface CityContent {
  slug: string
  title?: string
  subtitle?: string
  description?: string
  heroImage?: string
  introTitle?: string
  introText?: string
  ctaTitle?: string
  ctaText?: string
  updated_at?: string
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) return NextResponse.json({ content: {} }, { status: 200 })

    const { data, error } = await supabase.from('cities_content').select('slug, title, subtitle, description, heroImage, introTitle, introText, ctaTitle, ctaText, updated_at')
    if (error) return NextResponse.json({ content: {} }, { status: 200 })

    const content: Record<string, CityContent> = {}
    for (const row of data || []) content[row.slug] = row

    return NextResponse.json({ content }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ content: {} }, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await req.json()
    const content = body?.content || {}

    if (!supabase) {
      return new NextResponse(JSON.stringify({ ok: true, stored: 'local-only' }), {
        status: 200,
        headers: { 'x-cities-write': 'local' }
      })
    }

    const rows = Object.values(content)
    const { error } = await supabase.from('cities_content').upsert(rows as CityContent[], { onConflict: 'slug' })
    if (error) {
      return new NextResponse(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
    }

    return new NextResponse(JSON.stringify({ ok: true, count: rows.length }), {
      status: 200,
      headers: { 'x-cities-write': 'supabase' }
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 })
  }
}