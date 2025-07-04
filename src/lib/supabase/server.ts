import { createBrowserClient } from '@supabase/ssr'

// Basit client-side auth için (server-side render edilmeyen)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 