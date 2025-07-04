'use client'

import { useState, useEffect } from 'react'
import { SupabaseAuthService, SupabaseUser } from '@/lib/services/supabase-auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function SupabaseAuthExample() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [magicLinkEmail, setMagicLinkEmail] = useState('')

  // Auth state değişikliklerini dinle
  useEffect(() => {
    // Client-side'da user kontrolü
    const checkUser = async () => {
      const currentUser = await SupabaseAuthService.getCurrentUser()
      setUser(currentUser)
    }
    checkUser()

    // Auth state change listener
    const { data: { subscription } } = SupabaseAuthService.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session)
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

    const result = await SupabaseAuthService.signOut()
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Çıkış başarılı!')
      setUser(null)
    }
    
    setLoading(false)
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

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.signInWithMagicLink(magicLinkEmail)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Magic link email adresinize gönderildi. Giriş yapmak için linke tıklayın.')
      setMagicLinkEmail('')
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Auth Örneği</h1>
        <p className="text-muted-foreground">
          Bu sayfa .env dosyasından alınan Supabase bilgileri ile auth işlemlerini gösterir.
        </p>
      </div>

      {/* Kullanıcı Durumu */}
      {user ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Oturum Açık
              <Badge variant="secondary">Aktif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Oluşturulma Tarihi:</strong> {new Date(user.created_at).toLocaleString('tr-TR')}</p>
              <p><strong>Güncelleme Tarihi:</strong> {new Date(user.updated_at).toLocaleString('tr-TR')}</p>
              {user.email_confirmed_at && (
                <p><strong>Email Onaylanma Tarihi:</strong> {new Date(user.email_confirmed_at).toLocaleString('tr-TR')}</p>
              )}
            </div>
            <Separator className="my-4" />
            <Button onClick={handleSignOut} variant="outline" disabled={loading}>
              {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Oturum Kapalı
              <Badge variant="secondary">Pasif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
            <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
            <TabsTrigger value="reset">Şifre Sıfırla</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
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
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Kayıt Ol</CardTitle>
                <CardDescription>
                  Yeni hesap oluşturun.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          </TabsContent>
          
          <TabsContent value="magic">
            <Card>
              <CardHeader>
                <CardTitle>Magic Link ile Giriş</CardTitle>
                <CardDescription>
                  Email adresinize gönderilecek linkle giriş yapın.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">Email</Label>
                    <Input
                      id="magic-email"
                      type="email"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Magic Link Gönder'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Sıfırla</CardTitle>
                <CardDescription>
                  Şifrenizi sıfırlama linki için email adresinizi girin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Supabase Bilgileri */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Supabase Yapılandırması</CardTitle>
          <CardDescription>
            .env dosyasından alınan Supabase bilgileri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 