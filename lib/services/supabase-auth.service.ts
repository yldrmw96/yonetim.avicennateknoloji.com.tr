import { createClient } from '../supabase/client'
import { createServerSupabaseClient } from '../supabase/server'

export interface SupabaseUser {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  created_at: string
  updated_at: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export interface SupabaseAuthResponse {
  user: SupabaseUser | null
  session: any | null
  error: string | null
}

export class SupabaseAuthService {
  // Client-side metodlar
  
  // Kullanıcı kaydı
  static async signUp(email: string, password: string): Promise<SupabaseAuthResponse> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      // Kullanıcı oluşturulduysa otomatik profil oluştur
      if (data.user) {
        try {
          const { SupabaseProfilesService } = await import('./supabase-profiles.service')
          await SupabaseProfilesService.createInitialProfile(data.user.id, email)
        } catch (profileError) {
          // console.error('Initial profile creation error:', profileError)
          // Profil hatası kayıt işlemini engellemez
        }
      }

      return {
        user: data.user as SupabaseUser,
        session: data.session,
        error: null
      }
    } catch (error) {
      return { user: null, session: null, error: 'Kayıt işlemi sırasında hata oluştu' }
    }
  }

  // Kullanıcı girişi
  static async signIn(email: string, password: string): Promise<SupabaseAuthResponse> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      // Giriş başarılıysa profil kontrol et ve gerekirse oluştur
      if (data.user) {
        try {
          const { SupabaseProfilesService } = await import('./supabase-profiles.service')
          const profileResult = await SupabaseProfilesService.getUserProfile(data.user.id)
          
          if (!profileResult.profile) {
            // Profil yoksa oluştur
            await SupabaseProfilesService.createInitialProfile(data.user.id, data.user.email!)
          }
        } catch (profileError) {
          // console.error('Profile check/creation error:', profileError)
          // Profil hatası giriş işlemini engellemez
        }
      }

      return {
        user: data.user as SupabaseUser,
        session: data.session,
        error: null
      }
    } catch (error) {
      return { user: null, session: null, error: 'Giriş işlemi sırasında hata oluştu' }
    }
  }

  // Kullanıcı çıkışı
  static async signOut(): Promise<{ error: string | null }> {
    try {
      // console.log('supabase-auth.service.ts: Çıkış işlemi başlatıldı')
      const supabase = createClient()
      
      // Timeout ile çıkış işlemi (3 saniye max)
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise<{ error: any }>((_, reject) => 
        setTimeout(() => reject(new Error('Çıkış işlemi timeout')), 3000)
      )
      
      const { error } = await Promise.race([signOutPromise, timeoutPromise])
      // console.log('supabase-auth.service.ts: Çıkış işlemi tamamlandı:', { error })
      
      if (error) {
        // console.error('SignOut error:', error)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      // console.error('SignOut catch error:', error)
      
      // Hata olsa bile local cleanup yap
      this.forceLocalCleanup()
      
      // Timeout veya başka hata olsa bile başarılı dön (çünkü local cleanup yaptık)
      return { error: null }
    }
  }

  // Local cleanup için yardımcı metod
  private static forceLocalCleanup() {
    try {
      // console.log('supabase-auth.service.ts: Force local cleanup başlatıldı')
      
      // Manuel cookie temizleme
      if (typeof document !== 'undefined') {
        const authCookies = document.cookie.split(';').filter(cookie => {
          const name = cookie.trim().split('=')[0]
          return name.startsWith('sb-') || 
                 name.includes('supabase') ||
                 name.includes('auth-token')
        })
        
        authCookies.forEach(cookie => {
          const name = cookie.split('=')[0].trim()
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        })
        
        // console.log('supabase-auth.service.ts: Cookies temizlendi:', authCookies.length)
      }
      
      // Local storage temizleme
      if (typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage)
        const authKeys = keys.filter(key => 
          key.startsWith('sb-') || 
          key.includes('supabase') ||
          key.includes('auth-token')
        )
        
        authKeys.forEach(key => {
          localStorage.removeItem(key)
        })
        
        // console.log('supabase-auth.service.ts: LocalStorage temizlendi:', authKeys.length)
      }
      
      // Session storage temizleme
      if (typeof sessionStorage !== 'undefined') {
        const keys = Object.keys(sessionStorage)
        const authKeys = keys.filter(key => 
          key.startsWith('sb-') || 
          key.includes('supabase') ||
          key.includes('auth-token')
        )
        
        authKeys.forEach(key => {
          sessionStorage.removeItem(key)
        })
        
        // console.log('supabase-auth.service.ts: SessionStorage temizlendi:', authKeys.length)
      }
      
    } catch (cleanupError) {
      // console.error('Local cleanup error:', cleanupError)
    }
  }

  // Mevcut kullanıcıyı getir (client-side)
  static async getCurrentUser(): Promise<SupabaseUser | null> {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      return user as SupabaseUser
    } catch (error) {
      return null
    }
  }

  // Mevcut oturumu getir (client-side)
  static async getCurrentSession() {
    try {
      const supabase = createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        return null
      }

      return session
    } catch (error) {
      return null
    }
  }

  // Şifre sıfırlama
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/access/auth/callback`,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Şifre sıfırlama işlemi sırasında hata oluştu' }
    }
  }

  // Auth durumu değişikliklerini dinle
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createClient()
    return supabase.auth.onAuthStateChange(callback)
  }

  // Server-side metodlar

  // Mevcut kullanıcıyı getir (server-side)
  static async getCurrentUserServer(): Promise<SupabaseUser | null> {
    try {
      // Dynamic import ile server client'ı sadece server-side'da yükle
      const { createServerSupabaseClient } = await import('../supabase/server')
      const supabase = await createServerSupabaseClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      return user as SupabaseUser
    } catch (error) {
      // console.error('Server-side getCurrentUser error:', error)
      return null
    }
  }


  // Mevcut oturumu getir (server-side)
  static async getCurrentSessionServer() {
    try {
      // Dynamic import ile server client'ı sadece server-side'da yükle
      const { createServerSupabaseClient } = await import('../supabase/server')
      const supabase = await createServerSupabaseClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        // console.error('Server-side getSession error:', error)
        return null
      }

      return session
    } catch (error) {
      // console.error('Server-side getSession error:', error)
      return null
    }
  }

  // Email ile magic link gönder
  static async signInWithMagicLink(email: string): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/account/access/auth/callback`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Magic link gönderimi sırasında hata oluştu' }
    }
  }

  // Şifre güncelle
  static async updatePassword(password: string): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Şifre güncelleme sırasında hata oluştu' }
    }
  }

  // Kullanıcı metadata'sını güncelle
  static async updateUserMetadata(metadata: Record<string, any>): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ 
        data: metadata 
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Kullanıcı bilgileri güncelleme sırasında hata oluştu' }
    }
  }
} 