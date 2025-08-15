import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase server client configured with the service role key.
 * If env vars are missing, returns null so callers can gracefully fallback.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE

  if (!supabaseUrl || !supabaseServiceRoleKey) return null

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
    global: { fetch },
  })
}

