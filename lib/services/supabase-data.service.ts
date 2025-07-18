import { SupabaseAuthService } from './supabase-auth.service'
import { SupabaseProfilesService } from './supabase-profiles.service'

export interface UserFullData {
  user: any
  profile: any
  sites: any[]
  languages: any[]
  error?: string
}

export class SupabaseDataService {
  // Kullanıcının tüm verilerini tek seferde çek
  static async getUserFullData(): Promise<UserFullData> {
    try {
      const user = await SupabaseAuthService.getCurrentUserServer() 
      
      if (!user) {
        return {
          user: null,
          profile: null,
          sites: [],
          languages: [],
          error: 'Kullanıcı oturum açmamış'
        }
      }

      const [profileResult, sitesResult, languagesResult] = await Promise.all([
        SupabaseProfilesService.getUserProfileServer(user.id),
        SupabaseProfilesService.getUserSites(user.id),
        SupabaseProfilesService.getAllLanguages()
      ])

      return {
        user,
        profile: profileResult.profile,
        sites: sitesResult.sites || [],
        languages: languagesResult.languages || [],
        error: profileResult.error || sitesResult.error || languagesResult.error || null
      }
    } catch (error) {
      // console.error('getUserFullData error:', error)
      return {
        user: null,
        profile: null,
        sites: [],
        languages: [],
        error: 'Veri çekme hatası'
      }
    }
  }

  // Sadece kullanıcı + profil verilerini çek
  static async getUserBasicData() {
    try {
      const user = await SupabaseAuthService.getCurrentUserServer()
      
      if (!user) {
        return { user: null, profile: null, error: 'Kullanıcı oturum açmamış' }
      }

      const profileResult = await SupabaseProfilesService.getUserProfileServer(user.id)
      
      return {
        user,
        profile: profileResult.profile,
        error: profileResult.error
      }
    } catch (error) {
      // console.error('getUserBasicData error:', error)
      return {
        user: null,
        profile: null,
        error: 'Veri çekme hatası'
      }
    }
  }

  // Sadece site verilerini çek
  static async getUserSites(userId?: string) {
    try {
      let targetUserId = userId
      
      if (!targetUserId) {
        const user = await SupabaseAuthService.getCurrentUserServer()
        if (!user) {
          return { sites: [], error: 'Kullanıcı oturum açmamış' }
        }
        targetUserId = user.id
      }

      const sitesResult = await SupabaseProfilesService.getUserSites(targetUserId)
      return sitesResult
    } catch (error) {
      // console.error('getUserSites error:', error)
      return { sites: [], error: 'Site verileri çekme hatası' }
    }
  }

  // Cache için basit in-memory store (production'da Redis/Memcached kullanın)
  private static cache = new Map<string, { data: any, timestamp: number }>()
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 dakika

  // Cached veri çekme
  static async getCachedUserData(userId: string): Promise<UserFullData> {
    const cacheKey = `user_full_data_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      // console.log('Cache hit for user:', userId)
      return cached.data
    }

    const data = await this.getUserFullData()
    this.cache.set(cacheKey, { data, timestamp: Date.now() })
    
    return data
  }

  // Cache temizleme
  static clearUserCache(userId: string) {
    const cacheKey = `user_full_data_${userId}`
    this.cache.delete(cacheKey)
  }
} 