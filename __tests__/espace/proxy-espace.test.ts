/**
 * @jest-environment node
 */
import { proxy } from '@/proxy'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase-server', () => ({
  createSupabaseServer: jest.fn(),
}))

import { createSupabaseServer } from '@/lib/supabase-server'

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`)
}

describe('proxy - espace routes', () => {
  it('allows /espace/connexion through without a session', async () => {
    const res = await proxy(makeRequest('/espace/connexion'))
    expect(res.status).not.toBe(307)
  })

  it('redirects /espace to /espace/connexion when no session', async () => {
    ;(createSupabaseServer as jest.Mock).mockReturnValue({
      supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
      response: { cookies: { set: jest.fn() } },
    })
    const res = await proxy(makeRequest('/espace'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/espace/connexion')
  })

  it('allows /espace when session is valid', async () => {
    ;(createSupabaseServer as jest.Mock).mockReturnValue({
      supabase: { auth: { getUser: async () => ({ data: { user: { email: 'test@example.com' } } }) } },
      response: new Response(null, { status: 200 }),
    })
    const res = await proxy(makeRequest('/espace'))
    expect(res.status).not.toBe(307)
  })
})
