"use client"
import { useState } from "react"
import { SupabaseAuthService } from "@/lib/services/supabase-auth.service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
  
export default function Page() {
  const [resetEmail, setResetEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [magicLinkEmail, setMagicLinkEmail] = useState('')
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
        <h1 className="text-xl font-bold mb-2">Şifremi Unuttum</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label htmlFor="resetEmail" className="block text-sm font-medium mb-1">Email</label>
          <Input
            id="resetEmail"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Email adresinizi giriniz"
            required
          />
        </div>
        <Button type="submit" disabled={loading || !resetEmail}>
          Şifremi Sıfırla
        </Button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {loading && <p className="text-muted-foreground mb-4">Şifre sıfırlama linki gönderiliyor...</p>}
      {/* <Card>
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
      </Card> */}
    </div>
  );
}