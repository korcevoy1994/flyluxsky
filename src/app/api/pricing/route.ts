import { NextResponse } from 'next/server'
import { defaultPricingConfig, type PricingConfiguration } from '@/lib/pricingAdmin'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
export const dynamic = 'force-dynamic'

const BLOB_PREFIX = 'pricing/'
const BLOB_PATH = `${BLOB_PREFIX}config.json`

let cachedConfig: PricingConfiguration | null = null

type BlobListItem = { pathname: string; url: string; uploadedAt: string }
type BlobModule = {
  list: (args: { prefix: string }) => Promise<{ blobs: BlobListItem[] }>
  put: (
    path: string,
    data: string,
    opts: { access: 'public' | 'private'; contentType: string; addRandomSuffix: boolean }
  ) => Promise<unknown>
}

const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<unknown>

function loadFromEnv(): PricingConfiguration | null {
  try {
    const raw = process.env.PRICING_CONFIG_JSON
    if (!raw) return null
    const parsed = JSON.parse(raw) as PricingConfiguration
    if (!parsed || !Array.isArray(parsed.regionPricing) || !Array.isArray(parsed.serviceClasses) || !Array.isArray(parsed.tripTypes)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

async function loadFromBlob(): Promise<PricingConfiguration | null> {
  try {
    const blobClient = (await dynamicImport('@vercel/blob').catch(() => null)) as BlobModule | null
    if (!blobClient) return null
    const { list } = blobClient
    const { blobs } = await list({ prefix: BLOB_PREFIX })
    const target = blobs.find(b => b.pathname === BLOB_PATH) || blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
    if (!target) return null
    const res = await fetch(target.url, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json as PricingConfiguration
  } catch {
    return null
  }
}

// --- Supabase helpers ---
async function loadFromSupabase(): Promise<PricingConfiguration | null> {
  const supabase = getSupabaseServerClient()
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('pricing_configs')
      .select('config')
      .eq('id', 'current')
      .maybeSingle()
    if (error) {
      // Supabase select error
      return null
    }
    if (!data?.config) return null
    const cfg = data.config as PricingConfiguration
    if (!cfg || !Array.isArray(cfg.regionPricing) || !Array.isArray(cfg.serviceClasses) || !Array.isArray(cfg.tripTypes)) {
      return null
    }
    return cfg
  } catch {
    // Supabase load threw
    return null
  }
}

async function saveToSupabase(config: PricingConfiguration): Promise<PricingConfiguration | null> {
  const supabase = getSupabaseServerClient()
  if (!supabase) return null
  try {
    const payload = { id: 'current', config }
    const { error } = await supabase.from('pricing_configs').upsert(payload, { onConflict: 'id' })
    if (error) {
      // Supabase upsert error
      return null
    }
    return config
  } catch (e) {
    // Supabase save threw
    return null
  }
}

async function saveToBlob(config: PricingConfiguration): Promise<PricingConfiguration | null> {
  try {
    const blobClient = (await dynamicImport('@vercel/blob').catch(() => null)) as BlobModule | null
    if (!blobClient) return null
    const { put } = blobClient
    await put(BLOB_PATH, JSON.stringify(config), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
    return config
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const noSupabase = url.searchParams.get('noSupabase') === '1'
    const noBlob = url.searchParams.get('noBlob') === '1'
    const noEnv = url.searchParams.get('noEnv') === '1'

    // 1) Supabase
    if (!noSupabase) {
      const sbConfig = await loadFromSupabase()
      if (sbConfig) {
        cachedConfig = sbConfig
        return new NextResponse(JSON.stringify(sbConfig), {
          headers: { 'content-type': 'application/json', 'x-pricing-source': 'supabase' },
        })
      }
    }

    const blobConfig = noBlob ? null : await loadFromBlob()
    if (blobConfig) {
      cachedConfig = blobConfig
      return new NextResponse(JSON.stringify(blobConfig), {
        headers: { 'content-type': 'application/json', 'x-pricing-source': 'blob' },
      })
    }
    const envConfig = noEnv ? null : loadFromEnv()
    if (envConfig) {
      cachedConfig = envConfig
      return new NextResponse(JSON.stringify(envConfig), {
        headers: { 'content-type': 'application/json', 'x-pricing-source': 'env' },
      })
    }
    if (cachedConfig)
      return new NextResponse(JSON.stringify(cachedConfig), {
        headers: { 'content-type': 'application/json', 'x-pricing-source': 'cache' },
      })
    return new NextResponse(JSON.stringify(defaultPricingConfig), {
      headers: { 'content-type': 'application/json', 'x-pricing-source': 'default' },
    })
  } catch (err) {
    // GET handler error
    const body = { error: 'pricing_get_failed' }
    return new NextResponse(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-pricing-error': '1' },
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PricingConfiguration
    if (!body || !Array.isArray(body.regionPricing) || !Array.isArray(body.serviceClasses) || !Array.isArray(body.tripTypes)) {
      return new NextResponse('Invalid config', { status: 400 })
    }
    const configWithTs = { ...body, lastUpdated: new Date().toISOString() }
    // Write to Supabase first
    const savedSb = await saveToSupabase(configWithTs)
    if (savedSb) {
      cachedConfig = savedSb
      return new NextResponse(JSON.stringify(savedSb), {
        headers: { 'content-type': 'application/json', 'x-pricing-write': 'supabase' },
      })
    }

    // Fallback to Blob
    const savedBlob = await saveToBlob(configWithTs)
    if (savedBlob) {
      cachedConfig = savedBlob
      return new NextResponse(JSON.stringify(savedBlob), {
        headers: { 'content-type': 'application/json', 'x-pricing-write': 'blob' },
      })
    }

    // Final fallback: in-memory cache for current instance
    cachedConfig = configWithTs
    return new NextResponse(JSON.stringify(configWithTs), {
      headers: { 'content-type': 'application/json', 'x-pricing-write': 'cache' },
    })
  } catch (e) {
    // POST handler error
    return new NextResponse('Bad Request', { status: 400 })
  }
}

