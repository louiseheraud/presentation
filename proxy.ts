// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes — cookie-based auth (unchanged)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isLoginRoute =
      pathname === '/admin/login' || pathname === '/api/admin/login'

    if (isLoginRoute) {
      return NextResponse.next()
    }

    const session = request.cookies.get('admin_session')
    const isValid = session?.value === process.env.ADMIN_SESSION_TOKEN

    if (!isValid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  // Espace routes — Supabase session auth
  if (pathname.startsWith('/espace')) {
    if (pathname === '/espace/connexion') {
      return NextResponse.next()
    }

    const { supabase, response } = createSupabaseServer(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/espace/connexion', request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/espace/:path*'],
}
