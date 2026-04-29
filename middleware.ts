import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
