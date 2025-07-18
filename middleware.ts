import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/utils/cyrpto/verifyAccessToken';
import { env } from '@/lib/env';
import { JWTPayload } from 'jose';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js Middleware
 * 
 * Bu middleware gelen HTTP isteklerini denetleyerek oturum kontrolü yapar.
 * Belirli route'lara erişimi sınırlandırır, oturum süresini kontrol eder ve kullanıcıyı uygun sayfalara yönlendirir.
 * 
 * Uygulama mantığı:
 * 1. API isteklerini dışarıda bırak.
 * 2. Supabase auth için özel handler kullan.
 * 3. Eski JWT sistemi pasifleştirildi (gerektiğinde aktif edilebilir).
 */

async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API endpoint'lerine dokunma
  if (pathname.startsWith('/api')) return NextResponse.next();

  

  // Login sayfası mı kontrolü
  const isAuthorizationPageRequest =  pathname.startsWith('/account/access') || pathname.startsWith('/account/forgot-password') || pathname.startsWith('/account/create');

  // Supabase auth kontrolü
  const isSupabaseAuthPath = pathname.startsWith('/account');
  // Supabase auth sayfalarında session güncelleme
  if (pathname.startsWith('/account')) {
    return await updateSession(request);
  }
  // Eğer Supabase auth path'indeyse Supabase session kontrolü yap
  if (isSupabaseAuthPath) {
    return await handleSupabaseAuth(request, pathname);
  }

  // ============================================================
  // ESKİ JWT AUTH SİSTEMİ (ŞU ANDA PASİF)
  // ============================================================
  
  const LEGACY_AUTH_ENABLED = false; // Bu flag ile eski sistemi aktif/pasif yapabilirsiniz
  
  if (LEGACY_AUTH_ENABLED) {
    // Cookie'yi al (Next.js 13+ Headers API kullanımı)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(env.SESSION_KEY);

    // Cookie nesnesi geçerli mi kontrol et
    const sessionCookieIsValid = sessionCookie !== undefined &&
      sessionCookie !== null &&
      typeof sessionCookie === 'object';

    // Eğer session cookie yoksa ve login sayfası değilse login'e yönlendir
    if (!sessionCookieIsValid) {
      if (!isAuthorizationPageRequest) {
        return redirectToLogin(request);
      }
      return NextResponse.next(); // login sayfasına erişim izni ver
    }

    try {
      // JWT doğrulaması yap
      const sessionFromToken: JWTPayload = await verifyAccessToken(sessionCookie!.value);

      // Oturum süresi dolmuş mu?
      const isSessionExpired = sessionFromToken.exp && Date.now() >= sessionFromToken.exp * 1000;

      if (isSessionExpired) {
        // Token süresi dolmuşsa session'ı temizle ve login sayfasına yönlendir
        return handleExpiredSession(request, isAuthorizationPageRequest);
      }

      // Token geçerli, login sayfasına gidilmeye çalışılıyorsa dashboard'a yönlendir
      if (isAuthorizationPageRequest) {
        return redirectToDashboard(request);
      }

      // Eğer kullanıcıya ait hiçbir site yoksa no-website sayfasına yönlendir
      if (sessionFromToken.site_count === 0 && !pathname.startsWith('/no-website')) {
        return redirectToNoWebsite(request);
      }

      // Oturum geçerli, erişime izin ver
      return NextResponse.next();

    } catch (error) {
      // JWT doğrulama hatası varsa oturumu temizle ve login'e yönlendir
      return handleExpiredSession(request, isAuthorizationPageRequest);
    }
  }

  // ============================================================
  // ESKİ AUTH SİSTEMİ SONU
  // ============================================================

  // Eski auth sistemi pasifken, Supabase olmayan path'ler için izin ver
  // Gerektiğinde LEGACY_AUTH_ENABLED = true yaparak eski sistemi aktif edebilirsiniz
  return NextResponse.next();
}

/**
 * Belirli bir URL'e yönlendirme yapan yardımcı fonksiyon
 */
function redirectTo(request: NextRequest, url: string) {
  return NextResponse.redirect(new URL(url, request.url));
}

/**
 * Kullanıcıyı login sayfasına yönlendir
 */
function redirectToLogin(request: NextRequest) {
  return redirectTo(request, '/account/access');
}

/**
 * Kullanıcıyı dashboard sayfasına yönlendir
 */
function redirectToDashboard(request: NextRequest) {
  return redirectTo(request, '/');
}

/**
 * Kullanıcıyı no-website (site oluşturulmamış) sayfasına yönlendir
 */
function redirectToNoWebsite(request: NextRequest) {
  return redirectTo(request, '/no-website');
}

/**
 * Oturumu temizle ve kullanıcıyı login sayfasına yönlendir.
 * Eğer zaten login sayfasındaysa yönlendirme yapmadan devam et.
 */
function handleExpiredSession(request: NextRequest, isAuthPage: boolean) {
  const response = redirectToLogin(request);

  // Session ve refresh token cookie'lerini temizle
  response.cookies.set(env.SESSION_KEY, '', { maxAge: -1 });
  response.cookies.set(env.REFRESH_TOKEN_KEY, '', { maxAge: -1 });

  // Eğer kullanıcı zaten login sayfasındaysa yönlendirme yapma
  if (isAuthPage) {
    return NextResponse.next();
  }

  return response;
}

/**
 * Supabase auth için middleware handler
 */
async function handleSupabaseAuth(request: NextRequest, pathname: string) {
  try {
    // Dynamic import ile Supabase'i yükle
    const { createServerClient } = await import('@supabase/ssr')
    
    const supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Supabase session kontrolü
    const { data: { user }, error } = await supabase.auth.getUser()

    // Auth sayfaları (giriş, kayıt, şifre sıfırlama)
    const isAuthPage = pathname.startsWith('/account/access') || 
                      pathname.startsWith('/account/create') || 
                      pathname.startsWith('/account/forgot-password')

    // Eğer kullanıcı giriş yapmış ve auth sayfasındaysa dashboard'a yönlendir
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Eğer kullanıcı giriş yapmamış ve protected sayfadaysa auth sayfasına yönlendir
    if (!user && !isAuthPage && pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/account/access', request.url))
    }

    return supabaseResponse

  } catch (error) {
    // console.error('Middleware: Supabase auth error:', error)
    return NextResponse.next()
  }
}

/**
 * Middleware'in hangi route'lara uygulanacağını belirler.
 * API, static dosyalar, favicon, uploads ve images klasörleri hariç tutulmuştur.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|images).*)'
  ]
};

export default middleware;
