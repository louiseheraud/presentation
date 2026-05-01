/**
 * @jest-environment node
 */
import { GET } from '@/app/auth/callback/route'
import { NextRequest } from 'next/server'

const mockExchangeCodeForSession = jest.fn()
const mockSetAll = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { exchangeCodeForSession: mockExchangeCodeForSession },
  })),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({ getAll: () => [], setAll: mockSetAll })
  ),
}))

describe('GET /auth/callback', () => {
  it('redirects to /espace on success', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const req = new NextRequest('http://localhost:3000/auth/callback?code=abc123')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/espace')
  })

  it('redirects to /espace/reset-password when next param is set', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const req = new NextRequest('http://localhost:3000/auth/callback?code=abc&next=/espace/reset-password')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/espace/reset-password')
  })

  it('redirects to /espace/connexion?error=auth on failure', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: { message: 'invalid' } })
    const req = new NextRequest('http://localhost:3000/auth/callback?code=bad')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/espace/connexion?error=auth')
  })

  it('redirects to /espace/connexion?error=auth when no code', async () => {
    const req = new NextRequest('http://localhost:3000/auth/callback')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/espace/connexion?error=auth')
  })
})
