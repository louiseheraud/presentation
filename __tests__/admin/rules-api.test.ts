/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/admin/rules/route'
import { PATCH, DELETE } from '@/app/api/admin/rules/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

import { supabase } from '@/lib/supabase'

const mockFrom = supabase.from as jest.Mock

function makeRequest(method: string, body?: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/rules', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
}

function makeIdRequest(method: string, id: string, body?: object): NextRequest {
  return new NextRequest(`http://localhost/api/admin/rules/${id}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('GET /api/admin/rules', () => {
  it('returns rules from supabase', async () => {
    const fakeRules = [{ id: '1', text: 'Rule 1', order: 0, created_at: '' }]
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: fakeRules, error: null }),
        }),
      }),
    })

    const res = await GET()
    const data = await res.json()
    expect(data).toEqual(fakeRules)
    expect(res.status).toBe(200)
  })

  it('returns 500 if supabase errors', async () => {
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: null, error: { message: 'db error' } }),
        }),
      }),
    })

    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/admin/rules', () => {
  it('creates a rule and returns 201', async () => {
    const newRule = { id: '2', text: 'New rule', order: 1, created_at: '' }
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [{ order: 0 }], error: null }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: newRule, error: null }),
        }),
      }),
    })

    const req = makeRequest('POST', { text: 'New rule' })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })
})

describe('PATCH /api/admin/rules/[id]', () => {
  it('updates a rule and returns updated data', async () => {
    const updated = { id: '1', text: 'Updated rule', order: 0, created_at: '' }
    mockFrom.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: updated, error: null }),
          }),
        }),
      }),
    })

    const req = makeIdRequest('PATCH', '1', { text: 'Updated rule' })
    const res = await PATCH(req, { params: Promise.resolve({ id: '1' }) })
    const data = await res.json()
    expect(data.text).toBe('Updated rule')
  })
})

describe('DELETE /api/admin/rules/[id]', () => {
  it('deletes a rule and returns 204', async () => {
    mockFrom.mockReturnValue({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    })

    const req = makeIdRequest('DELETE', '1')
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(204)
  })
})
