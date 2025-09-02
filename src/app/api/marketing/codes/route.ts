import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('marketing_codes')
      .select('google_tag_manager, google_analytics_4, google_search_console, bing_webmaster_tools, facebook_pixel, google_ads_tag, hotjar, kommo_chat')
      .single()

    if (error && error.code !== 'PGRST116') {
      // Error fetching marketing codes
      return NextResponse.json({ error: 'Failed to fetch marketing codes' }, { status: 500 })
    }

    // Return default values if no data found
    const defaultCodes = {
      googleTagManager: '',
      googleAnalytics4: '',
      googleSearchConsole: '',
      bingWebmasterTools: '',
      facebookPixel: '',
      googleAdsTag: '',
      hotjar: '',
      kommoChat: ''
    }

    // Map database fields to camelCase
    const mappedData = data ? {
      googleTagManager: data.google_tag_manager || '',
      googleAnalytics4: data.google_analytics_4 || '',
      googleSearchConsole: data.google_search_console || '',
      bingWebmasterTools: data.bing_webmaster_tools || '',
      facebookPixel: data.facebook_pixel || '',
      googleAdsTag: data.google_ads_tag || '',
      hotjar: data.hotjar || '',
      kommoChat: data.kommo_chat || ''
    } : defaultCodes

    return NextResponse.json(mappedData)
  } catch (error) {
    // Error in GET /api/marketing/codes
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
    
    const { data, error } = await supabase
      .from('marketing_codes')
      .upsert({
        id: 1, // Single row for all marketing codes
        google_tag_manager: body.googleTagManager || '',
        google_analytics_4: body.googleAnalytics4 || '',
        google_search_console: body.googleSearchConsole || '',
        bing_webmaster_tools: body.bingWebmasterTools || '',
        facebook_pixel: body.facebookPixel || '',
        google_ads_tag: body.googleAdsTag || '',
        hotjar: body.hotjar || '',
        kommo_chat: body.kommoChat || '',
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      // Error saving marketing codes
      return NextResponse.json({ error: 'Failed to save marketing codes' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    // Error in POST /api/marketing/codes
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}