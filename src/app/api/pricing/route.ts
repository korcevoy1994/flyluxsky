import { NextResponse } from 'next/server'
import { defaultPricingConfig, type PricingConfiguration } from '@/lib/pricingAdmin'
export const dynamic = 'force-dynamic'

const BLOB_PREFIX = 'pricing/'
const BLOB_PATH = `${BLOB_PREFIX}config.json`

let cachedConfig: PricingConfiguration | null = null

const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>

async function loadFromBlob(): Promise<PricingConfiguration | null> {
  try {
    const blobClient = await dynamicImport('@vercel/blob').catch(() => null as any)
    if (!blobClient) return null
    const { list } = blobClient as unknown as { list: (args: { prefix: string }) => Promise<{ blobs: Array<{ pathname: string; url: string; uploadedAt: string }> }> }
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

async function saveToBlob(config: PricingConfiguration): Promise<PricingConfiguration | null> {
  try {
    const blobClient = await dynamicImport('@vercel/blob').catch(() => null as any)
    if (!blobClient) return null
    const { put } = blobClient as unknown as { put: (path: string, data: string, opts: { access: 'public' | 'private'; contentType: string; addRandomSuffix: boolean }) => Promise<unknown> }
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

export async function GET() {
  const blobConfig = await loadFromBlob()
  if (blobConfig) {
    cachedConfig = blobConfig
    return NextResponse.json(blobConfig)
  }
  if (cachedConfig) return NextResponse.json(cachedConfig)
  return NextResponse.json(defaultPricingConfig)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PricingConfiguration
    if (!body || !Array.isArray(body.regionPricing) || !Array.isArray(body.serviceClasses) || !Array.isArray(body.tripTypes)) {
      return new NextResponse('Invalid config', { status: 400 })
    }
    const configWithTs = { ...body, lastUpdated: new Date().toISOString() }
    const saved = await saveToBlob(configWithTs)
    if (!saved) {
      // Fallback: keep in-memory so the running instance serves it (useful in local dev or when Blob not configured)
      cachedConfig = configWithTs
      return NextResponse.json(configWithTs)
    }
    cachedConfig = saved
    return NextResponse.json(saved)
  } catch (e) {
    return new NextResponse('Bad Request', { status: 400 })
  }
}

