// Bu dosya sadece server-side'da kullanılabilir
// Client-side'da import etmeyin!

// Server-side client factory fonksiyonu
export async function createServerSupabaseClient() {
  // Dynamic import ile next/headers'ı sadece server-side'da yükle
  const { cookies } = await import('next/headers')
  const { createServerClient } = await import('@supabase/ssr')
  
  const cookieStore = await cookies()

  // Environment variable'ları kontrol et
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Supabase config missing: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`)
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Server Component'lerde cookie set etme hatası - ignore
          }
        },
      },
    }
  )
}

// Route handlers için alternatif client
export async function createAdminClient() {
  const { cookies } = await import('next/headers')
  const { createServerClient } = await import('@supabase/ssr')
  
  const cookieStore = await cookies()

  // Environment variable'ları kontrol et
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Supabase admin config missing: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`)
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// Backward compatibility
export const createClient = createServerSupabaseClient 