# Supabase SSR Auth Örneği

Bu sayfa, .env dosyasından alınan Supabase bilgileri ile **Server-Side Rendering (SSR)** destekli auth işlemlerini gösterir.

## Özellikler

- ✅ **SSR Desteği**: Server-side rendering ile auth durumu kontrolü
- ✅ **Cookie-based Auth**: Güvenli cookie tabanlı oturum yönetimi
- ✅ Kullanıcı kaydı (Sign Up)
- ✅ Kullanıcı girişi (Sign In)
- ✅ **Magic Link**: Email ile şifresiz giriş
- ✅ Kullanıcı çıkışı (Sign Out)
- ✅ Şifre sıfırlama (Password Reset)
- ✅ **Server ve Client Auth**: Her iki tarafta da auth kontrolü
- ✅ Auth durumu değişikliklerini dinleme
- ✅ Gerçek zamanlı UI güncellemeleri
- ✅ **Middleware entegrasyonu**: Otomatik session güncelleme
- ✅ **Auth callback**: Email doğrulama ve magic link callback'leri

## Yapılandırma

.env dosyasında aşağıdaki değişkenler tanımlanmalıdır:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## Kullanım

1. Projeyi çalıştırın: `npm run dev`
2. Tarayıcıda şu adresi ziyaret edin: `http://localhost:3005/supabase-auth-example`
3. Kayıt ol sekmesinden yeni kullanıcı oluşturun
4. Email adresinizi kontrol edin ve hesabınızı doğrulayın
5. Giriş yap sekmesinden sisteme giriş yapın

## Dosya Yapısı

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (CSR)
│   │   ├── server.ts                   # Server client (SSR)
│   │   └── middleware.ts               # Middleware için session güncelleme
│   └── services/
│       ├── auth.service.ts             # Mevcut auth servisi (değiştirilmedi)
│       └── supabase-auth.service.ts    # Supabase auth servisleri (AYRI)
├── middleware.ts                       # Güncellendi: Supabase session desteği
└── app/
    └── (isolated-layout)/
        └── (isolated-layout-main)/
            └── @content/
                └── (contentlayout)/
                    └── supabase-auth-example/
                        ├── page.tsx                    # Server component (SSR)
                        ├── client/
                        │   └── index.tsx               # Client component
                        └── auth/
                            └── callback/
                                └── route.ts            # Auth callback handler
```

## Kullanılan Teknolojiler

- **Supabase**: Auth ve veritabanı işlemleri
- **Next.js 15**: React framework
- **TypeScript**: Tip güvenliği
- **Radix UI**: UI componentleri
- **Tailwind CSS**: Styling

## Güvenlik Notları

- Anon key public key'dir, client-side'da kullanılabilir
- Service role key **asla** client-side'da kullanılmamalıdır
- RLS (Row Level Security) politikaları Supabase'de tanımlanmalıdır
- Email doğrulama aktif olmalıdır

## Hata Giderme

Eğer auth işlemleri çalışmıyorsa:

1. .env dosyasındaki Supabase bilgilerini kontrol edin
2. Supabase projesinin aktif olduğundan emin olun
3. Email doğrulama ayarlarını kontrol edin
4. Network sekmesinden API çağrılarını inceleyin

## Geliştirme

Bu örnek sayfayı geliştirmek için:

1. `src/lib/services/auth.service.ts` dosyasına yeni metodlar ekleyin
2. `src/app/(isolated-layout)/(isolated-layout-main)/@content/(contentlayout)/supabase-auth-example/client/index.tsx` dosyasını güncelleyin
3. Gerekirse yeni UI componentleri ekleyin 