import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Basit middleware - sadece request'i geçir
  // Gerçek Supabase session management client-side'da yapılacak
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Supabase auth sayfalarına erişim izni ver
  return supabaseResponse
} 