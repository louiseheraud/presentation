/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      admin: {
        listUsers: jest.fn().mockResolvedValue({
          data: {
            users: [
              { id: 'user-1', email: 'alice@test.com' },
              { id: 'user-2', email: 'bob@test.com' },
            ],
          },
          error: null,
        }),
      },
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}))

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null }),
    },
  })),
}))

describe('GET /api/admin/students', () => {
  it('returns list of students with id and email', async () => {
    const { GET } = await import('@/app/api/admin/students/route')
    const res = await GET()
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data[0]).toMatchObject({ id: 'user-1', email: 'alice@test.com' })
  })
})

describe('POST /api/admin/corrections', () => {
  it('returns 400 if required fields are missing', async () => {
    const { POST } = await import('@/app/api/admin/corrections/route')
    const req = new NextRequest('http://localhost/api/admin/corrections', {
      method: 'POST',
      body: JSON.stringify({ student_id: 'user-1' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 and sends email on valid payload', async () => {
    const { POST } = await import('@/app/api/admin/corrections/route')
    const req = new NextRequest('http://localhost/api/admin/corrections', {
      method: 'POST',
      body: JSON.stringify({
        student_id: 'user-1',
        student_email: 'alice@test.com',
        type: 'cv',
        label: 'CV test',
        before_text: 'before',
        after_text: 'after',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/admin/corrections/[id]', () => {
  it('returns 200 on delete', async () => {
    const { DELETE } = await import('@/app/api/admin/corrections/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/corrections/abc', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'abc' }) })
    expect(res.status).toBe(200)
  })
})
