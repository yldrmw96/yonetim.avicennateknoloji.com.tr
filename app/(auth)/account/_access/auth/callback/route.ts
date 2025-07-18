import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  // console.log('Auth callback called with code:', !!code)

  if (code) {
    try {
      // Dynamic import ile server client'ı yükle
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = await createAdminClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
    
      
      if (!error && data?.user) {
        // Kullanıcı için profil oluştur/güncelle
        try {
          const { SupabaseProfilesService } = await import('@/lib/services/supabase-profiles.service')
          await SupabaseProfilesService.createInitialProfile(data.user.id, data.user.email!)
          // console.log('Initial profile created/updated for user:', data.user.id)
        } catch (profileError) {
          // console.error('Profile creation error:', profileError)
          // Profil hatası auth'u engellemez
        }

        // console.log('Auth successful, redirecting to:', `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        // console.error('Code exchange error:', error)
      }
    } catch (err) {
      // console.error('Callback error:', err)
    }
  }

  // return the user to an error page with instructions
  // console.log('Callback failed, redirecting to error page')
  return NextResponse.redirect(`${origin}/account/access?error=Auth callback failed`)
} 