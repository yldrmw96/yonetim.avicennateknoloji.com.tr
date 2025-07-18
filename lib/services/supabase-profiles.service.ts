import { createClient } from '../supabase/client'

export interface UserProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  bio?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface ProfileResponse {
  profile: UserProfile | null
  error: string | null
}

export class SupabaseProfilesService {
  // Kullanıcının profil bilgilerini getir
  static async getUserProfile(userId: string): Promise<ProfileResponse> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profil bulunamadı - normal durum
          return { profile: null, error: null }
        }
        return { profile: null, error: error.message }
      }

      return { profile: data as UserProfile, error: null }
    } catch (error) {
      return { profile: null, error: 'Profil bilgileri alınırken hata oluştu' }
    }
  }

  static async getAllLanguages(): Promise<any> {
    try {

      const supabase = createClient()
      const { data, error } = await supabase
        .from('language')
        .select('*')

      if (error) {
        if (error.code === 'PGRST116') {
          // Profil bulunamadı - normal durum
          return { profile: null, error: null }
        }
        return { profile: null, error: error.message }
      }

      return { languages: data as any, error: null }
    } catch (error) {
      return { languages: null, error: 'Diller alınırken hata oluştu' }
    }
  }

  // Client-side dil ekleme
  static async addLanguage(language: any) {
    // console.log('Client: addLanguage parametresi:', language)
    const languageData = {
      code: language.code,
      name: language.name,
    }
    
    try {
      // console.log('Client: addLanguage başlatıldı:', languageData)
      const supabase = createClient()
      
      // Client'ın doğru oluşturulduğunu kontrol et
      if (!supabase) {
        // console.error('Client: Supabase client oluşturulamadı')
        return { error: 'Supabase client oluşturulamadı' }
      }
      
      // console.log('Client: Supabase client oluşturuldu, insert işlemi başlatılıyor...')
      
      const { data, error } = await supabase
        .from('language')
        .upsert(languageData)
        .select()
      
      // console.log('Client: Insert işlemi tamamlandı:', { data, error })
      
      if (error) {
        // console.error('Client: Insert hatası:', error)
        return { error: error.message }
      }
      
      return { data: data, error: null }
    } catch (error) {
      // console.error('Client: Genel hata:', error)
      return { error: 'Dil ekleme sırasında hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') }
    }
  }

  // Server-side dil ekleme
  static async addLanguageServer(language: any) {
    const languageData = {
      code: language.code,
      name: language.name,
    }
    
    try {
      // console.log('Server: addLanguageServer başlatıldı:', languageData)
      
      // Dynamic import ile server client'ı yükle
      const { createServerSupabaseClient } = await import('../supabase/server')
      const supabase = await createServerSupabaseClient()
      
      const { data, error } = await supabase
        .from('language')
        .insert(languageData)
        .select()
        .single()
      
      // console.log('Server: Insert işlemi tamamlandı:', { data, error })
      
      if (error) {
        // console.error('Server: Insert hatası:', error)
        return { error: error.message }
      }
      
      return { data: data, error: null }
    } catch (error) {
      // console.error('Server: Genel hata:', error)
      return { error: 'Dil ekleme sırasında hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') }
    }
  }

  static async getUserSites(profile_uuid: string): Promise<any> {
    try {
      const supabase = createClient();

      // Get sites associated with the profile and their supported languages
      const { data, error } = await supabase
        .from('site')
        .select(`
        id,
        name,
        status,
        default_language_code,
        created_at,
        rel_site_profile!inner(profile_uuid),
        supported_languages:rel_site_languages(
          language_code,
          language(name, code)
        )
      `)
        .eq('rel_site_profile.profile_uuid', profile_uuid);

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - normal condition
          return { sites: null, error: null };
        }
        return { sites: null, error: error.message };
      }

      // Format the data to make it more usable
      const formattedSites = data.map(site => {
        // Extract just the language information from the nested structure
        const languages = site.supported_languages.map(rel => ({
          code: rel.language_code,
          name: rel.language?.name || ''
        }));

        // Return the site with a clean languages array
        return {
          id: site.id,
          name: site.name,
          status: site.status,
          default_language_code: site.default_language_code,
          created_at: site.created_at,
          supported_languages: languages
        };
      });

      return { sites: formattedSites, error: null };
    } catch (error) {
      return { sites: null, error: 'Site bilgileri alınırken hata oluştu' };
    }
  }

  // Server-side profil bilgilerini getir
  static async getUserProfileServer(userId: string): Promise<ProfileResponse> {
    try {
      // Dynamic import ile server client'ı yükle
      const { createServerSupabaseClient } = await import('../supabase/server')
      const supabase = await createServerSupabaseClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      // console.log(data)
      if (error) {
        if (error.code === 'PGRST116') {
          // Profil bulunamadı - normal durum
          return { profile: null, error: null }
        }
        // console.error('Server-side getUserProfile error:', error)
        return { profile: null, error: error.message }
      }

      return { profile: data as UserProfile, error: null }
    } catch (error) {
      // console.error('Server-side getUserProfile error:', error)
      return { profile: null, error: 'Profil bilgileri alınırken hata oluştu' }
    }
  }

  // Profil oluştur veya güncelle
  static async upsertUserProfile(profile: Partial<UserProfile>): Promise<ProfileResponse> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        return { profile: null, error: error.message }
      }

      return { profile: data as UserProfile, error: null }
    } catch (error) {
      return { profile: null, error: 'Profil güncellenirken hata oluştu' }
    }
  }

  // Profil güncelle
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<ProfileResponse> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        return { profile: null, error: error.message }
      }

      return { profile: data as UserProfile, error: null }
    } catch (error) {
      return { profile: null, error: 'Profil güncellenirken hata oluştu' }
    }
  }

  // Profil sil
  static async deleteUserProfile(userId: string): Promise<{ error: string | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Profil silinirken hata oluştu' }
    }
  }

  // Kullanıcı giriş yaptığında otomatik profil oluştur
  static async createInitialProfile(userId: string, email: string): Promise<ProfileResponse> {
    try {
      const profile: Partial<UserProfile> = {
        user_id: userId,
        first_name: '',
        last_name: '',
        avatar_url: null,
        bio: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return await this.upsertUserProfile(profile)
    } catch (error) {
      return { profile: null, error: 'İlk profil oluşturulurken hata oluştu' }
    }
  }

  // Tam kullanıcı bilgilerini getir (auth + profile)
  static async getFullUserData(userId: string) {
    try {
      const [authResult, profileResult] = await Promise.all([
        import('../services/supabase-auth.service').then(module => 
          module.SupabaseAuthService.getCurrentUser()
        ),
        this.getUserProfile(userId)
      ])

      return {
        user: authResult,
        profile: profileResult.profile,
        error: profileResult.error
      }
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: 'Kullanıcı bilgileri alınırken hata oluştu'
      }
    }
  }

  // Server-side tam kullanıcı bilgilerini getir
  static async getFullUserDataServer(userId: string) {
    try {
      const { SupabaseAuthService } = await import('../services/supabase-auth.service')
      
      const [authResult, profileResult] = await Promise.all([
        SupabaseAuthService.getCurrentUserServer(),
        this.getUserProfileServer(userId)
      ])

      return {
        user: authResult,
        profile: profileResult.profile,
        error: profileResult.error
      }
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: 'Kullanıcı bilgileri alınırken hata oluştu'
      }
    }
  }
} 