import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/utils/cyrpto/verifyAccessToken';
import { env } from '@/lib/env';
import { JWTPayload } from 'jose';

/**
 * Next.js Middleware
 * 
 * Bu middleware gelen HTTP isteklerini denetleyerek oturum kontrolü yapar.
 * Belirli route'lara erişimi sınırlandırır, oturum süresini kontrol eder ve kullanıcıyı uygun sayfalara yönlendirir.
 * 
 * Uygulama mantığı:
 * 1. API isteklerini dışarıda bırak.
 * 2. Oturum (JWT) cookie’sini kontrol et.
 * 3. Oturum varsa token geçerliliğini denetle.
 * 4. Geçerli değilse logout + login’e yönlendir.
 * 5. Geçerliyse kullanıcıyı login sayfasından dashboard’a yönlendir.
 * 6. Eğer kullanıcının site sayısı 0 ise, no-website sayfasına yönlendir.
 */

async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API endpoint'lerine dokunma
  if (pathname.startsWith('/api')) return NextResponse.next();

  // Login sayfası mı kontrolü
  const isAuthorizationPageRequest = pathname.startsWith('/login');

  // Cookie’yi al (Next.js 13+ Headers API kullanımı)
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
      // Token süresi dolmuşsa session’ı temizle ve login sayfasına yönlendir
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
  return redirectTo(request, '/login');
}

/**
 * Kullanıcıyı dashboard sayfasına yönlendir
 */
function redirectToDashboard(request: NextRequest) {
  return redirectTo(request, '/dashboard');
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
 * Middleware'in hangi route'lara uygulanacağını belirler.
 * API, static dosyalar, favicon, uploads ve images klasörleri hariç tutulmuştur.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|images).*)'
  ]
};

export default middleware;
