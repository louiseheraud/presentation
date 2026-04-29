/**
 * @jest-environment node
 */
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'

function makeRequest(pathname: string, cookieValue?: string): NextRequest {
  const url = `http://localhost${pathname}`
  const req = new NextRequest(url)
  if (cookieValue) {
    req.cookies.set('admin_session', cookieValue)
  }
  return req
}

const VALID_TOKEN = 'test-token'

beforeEach(() => {
  process.env.ADMIN_SESSION_TOKEN = VALID_TOKEN
})

describe('middleware', () => {
  it('allows /admin/login through without a cookie', async () => {
    const req = makeRequest('/admin/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('redirects unauthenticated requests to /admin/agent', async () => {
    const req = makeRequest('/admin/agent')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/admin/login')
  })

  it('allows authenticated requests to /admin/agent', async () => {
    const req = makeRequest('/admin/agent', VALID_TOKEN)
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('returns 401 for unauthenticated API requests', async () => {
    const req = makeRequest('/api/admin/improve')
    const res = await middleware(req)
    expect(res.status).toBe(401)
  })

  it('allows authenticated API requests', async () => {
    const req = makeRequest('/api/admin/improve', VALID_TOKEN)
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })

  it('allows /api/admin/login through without a cookie', async () => {
    const req = makeRequest('/api/admin/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })
})
