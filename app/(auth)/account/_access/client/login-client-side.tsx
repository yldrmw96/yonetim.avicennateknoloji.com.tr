'use client'

import React, { useState, useEffect } from 'react'
import { SupabaseAuthService, SupabaseUser } from '@/lib/services/supabase-auth.service'
import { SupabaseProfilesService, UserProfile } from '@/lib/services/supabase-profiles.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'


export default function LoginClientSide() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Auth state değişikliklerini dinle
  useEffect(() => {
    if (!user) {
      // console.log('Client: No initial user, checking client-side...')
      const checkUser = async () => {
        const currentUser = await SupabaseAuthService.getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          // Kullanıcı varsa profil bilgilerini de al
          const profileResult = await SupabaseProfilesService.getUserProfile(currentUser.id)
          setProfile(profileResult.profile)
        }

        // console.log('Client: User check complete:', { hasUser: !!currentUser })
      }
      checkUser()
    } else {
      // console.log('Client: Using initial user data')

      // Eğer user var ama profil yoksa profil çek
      if (!profile && user) {
        const fetchProfile = async () => {
          const profileResult = await SupabaseProfilesService.getUserProfile(user.id)
          setProfile(profileResult.profile)
        }
        fetchProfile()
      }
    }

    // Auth state change listener
    const { data: { subscription } } = SupabaseAuthService.onAuthStateChange(
      async (event, session) => {
        // console.log('Auth state changed:', event, session)
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as SupabaseUser)

          // Profil bilgilerini çek
          const profileResult = await SupabaseProfilesService.getUserProfile(session.user.id)
          setProfile(profileResult.profile)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.signIn(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Giriş başarılı!')
      setUser(result.user)

      // Profil bilgilerini çek
      if (result.user) {
        const profileResult = await SupabaseProfilesService.getUserProfile(result.user.id)
        setProfile(profileResult.profile)
      }

      setEmail('')
      setPassword('')


    }

    setLoading(false)
  }

  return (
    <div className="border-l border-r container font-mono h-screen max-w-4xl mx-auto p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hesap Erişimi</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>

      {/* Kullanıcı Durumu */}
      {user ? (
        <div>
          <h1>Giriş Yapıldı</h1>
          <p>Giriş yapıldığı için bu sayfa görüntülenemez.</p>
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Oturum Kapalı
              <Badge variant="secondary">Pasif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <p className="text-muted-foreground">
              Sisteme giriş yapmak için aşağıdaki sekmeleri kullanın.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Auth İşlemleri */}
      {!user && (

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Mevcut hesabınız ile giriş yapın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Şifre</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </CardContent>
        </Card>


      )}


    </div>
  )
} 