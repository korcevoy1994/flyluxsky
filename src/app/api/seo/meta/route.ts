import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('seo_meta')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      // Error fetching SEO meta
      return NextResponse.json({ error: 'Failed to fetch SEO meta' }, { status: 500 })
    }

    // Return default values if no data found
    const defaultSeoMeta = {
      siteTitle: 'FlyLuxSky — Business Flights',
      siteDescription: 'Your Gateway to Exclusive Business Class Savings',
      siteKeywords: 'business class flights, luxury travel, premium flights, first class',
      ogTitle: 'FlyLuxSky — Business Flights',
      ogDescription: 'Your Gateway to Exclusive Business Class Savings',
      ogImage: '/og.png',
      ogUrl: 'https://flyluxsky.vercel.app/',
      twitterCard: 'summary_large_image',
      twitterTitle: 'FlyLuxSky — Business Flights',
      twitterDescription: 'Your Gateway to Exclusive Business Class Savings',
      twitterImage: '/og.png',
      robotsTxt: 'User-agent: *\\nAllow: /',
      canonicalUrl: 'https://flyluxsky.vercel.app/',
      author: 'FlyLuxSky',
      language: 'en'
    }

    // Map database fields to camelCase
    const mappedData = data ? {
      siteTitle: data.site_title || defaultSeoMeta.siteTitle,
      siteDescription: data.site_description || defaultSeoMeta.siteDescription,
      siteKeywords: data.site_keywords || defaultSeoMeta.siteKeywords,
      ogTitle: data.og_title || defaultSeoMeta.ogTitle,
      ogDescription: data.og_description || defaultSeoMeta.ogDescription,
      ogImage: data.og_image || defaultSeoMeta.ogImage,
      ogUrl: data.og_url || defaultSeoMeta.ogUrl,
      twitterCard: data.twitter_card || defaultSeoMeta.twitterCard,
      twitterTitle: data.twitter_title || defaultSeoMeta.twitterTitle,
      twitterDescription: data.twitter_description || defaultSeoMeta.twitterDescription,
      twitterImage: data.twitter_image || defaultSeoMeta.twitterImage,
      robotsTxt: data.robots_txt || defaultSeoMeta.robotsTxt,
      canonicalUrl: data.canonical_url || defaultSeoMeta.canonicalUrl,
      author: data.author || defaultSeoMeta.author,
      language: data.language || defaultSeoMeta.language
    } : defaultSeoMeta

    return NextResponse.json(mappedData)
  } catch (error) {
    // Error in GET /api/seo/meta
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Map camelCase to database fields
    const dbData = {
      site_title: body.siteTitle,
      site_description: body.siteDescription,
      site_keywords: body.siteKeywords,
      og_title: body.ogTitle,
      og_description: body.ogDescription,
      og_image: body.ogImage,
      og_url: body.ogUrl,
      twitter_card: body.twitterCard,
      twitter_title: body.twitterTitle,
      twitter_description: body.twitterDescription,
      twitter_image: body.twitterImage,
      robots_txt: body.robotsTxt,
      canonical_url: body.canonicalUrl,
      author: body.author,
      language: body.language,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('seo_meta')
      .upsert({ id: 1, ...dbData })
      .select()
      .single()

    if (error) {
      // Error saving SEO meta
      return NextResponse.json({ error: 'Failed to save SEO meta' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    // Error in POST /api/seo/meta
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}