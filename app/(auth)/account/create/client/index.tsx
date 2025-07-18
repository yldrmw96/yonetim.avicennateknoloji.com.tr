'use client'

import { useState, useEffect } from 'react'
import { SupabaseAuthService, SupabaseUser } from '@/lib/services/supabase-auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SupabaseProfilesService } from '@/lib/services/supabase-profiles.service'

export default function AccountCreateClient() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')

  // Auth state değişikliklerini dinle
  useEffect(() => {


    // Eğer server-side'da user yoksa client-side'da kontrol et
    if (!user) {
      // console.log('Client: No initial user, checking client-side...')
      const checkUser = async () => {
        const currentUser = await SupabaseAuthService.getCurrentUser()
        setUser(currentUser)
        // console.log('Client: User check complete:', { hasUser: !!currentUser })
      }
      checkUser()
    } else {
      // console.log('Client: Using initial user data')
    }

    // Auth state change listener
    const { data: { subscription } } = SupabaseAuthService.onAuthStateChange(
      (event, session) => {
        // console.log('Auth state changed:', event, session)
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as SupabaseUser)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.signUp(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Kayıt başarılı! Email adresinizi kontrol edin.')
      setEmail('')
      setPassword('')
    }

    setLoading(false)
  }

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
      setEmail('')
      setPassword('')
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // console.log('Create Client: Çıkış işlemi başlatılıyor...')
    
    try {
      // Maksimum 4 saniye timeout
      const signOutPromise = SupabaseAuthService.signOut()
      const timeoutPromise = new Promise<{ error: string | null }>((resolve) => 
        setTimeout(() => resolve({ error: null }), 4000)
      )
      
      const result = await Promise.race([signOutPromise, timeoutPromise])
      
      // console.log('Create Client: Çıkış işlemi sonucu:', result)
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Çıkış başarılı!')
      }
      
      // Her durumda local state'i temizle
      setUser(null)
      
    } catch (error) {
      // console.error('Create Client: Çıkış işlemi hatası:', error)
      
      // Hata durumunda da local state'i temizle
      setUser(null)
      setSuccess('Çıkış yapıldı (local)')
      
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.resetPassword(resetEmail)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Şifre sıfırlama linki email adresinize gönderildi.')
      setResetEmail('')
    }

    setLoading(false)
  }


  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">Hesap Oluştur</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>

  

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

      <Card variant="flat_nopadding">
        <CardContent className="p-0">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Şifre</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
            </Button>
          </form>
        </CardContent>
      </Card>


    </div>
  )
} 