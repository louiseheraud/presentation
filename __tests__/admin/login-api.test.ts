/**
 * @jest-environment node
 */
import { POST } from '@/app/api/admin/login/route'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = 'secret'
const ADMIN_SESSION_TOKEN = 'session-token'

beforeEach(() => {
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD
  process.env.ADMIN_SESSION_TOKEN = ADMIN_SESSION_TOKEN
})

function makePostRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/login', () => {
  it('returns 401 for wrong password', async () => {
    const req = makePostRequest({ password: 'wrong' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 200 for correct password', async () => {
    const req = makePostRequest({ password: ADMIN_PASSWORD })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('sets admin_session cookie on success', async () => {
    const req = makePostRequest({ password: ADMIN_PASSWORD })
    const res = await POST(req)
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain('admin_session')
    expect(setCookie).toContain(ADMIN_SESSION_TOKEN)
  })

  it('returns 400 for malformed JSON', async () => {
    const req = new NextRequest('http://localhost/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 401 for missing password field', async () => {
    const req = makePostRequest({})
    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})
