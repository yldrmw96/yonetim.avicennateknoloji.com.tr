import { createClient } from '../supabase/client'

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
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Çıkış işlemi sırasında hata oluştu' }
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
        redirectTo: `${window.location.origin}/supabase-auth-example/reset-password`,
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

  // Server-side metodlar - Client-side ile aynı (simplicity için)

  // Mevcut kullanıcıyı getir (server-side)
  static async getCurrentUserServer(): Promise<SupabaseUser | null> {
    return this.getCurrentUser()
  }

  // Mevcut oturumu getir (server-side)
  static async getCurrentSessionServer() {
    return this.getCurrentSession()
  }

  // Email ile magic link gönder
  static async signInWithMagicLink(email: string): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/supabase-auth-example/auth/callback`,
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