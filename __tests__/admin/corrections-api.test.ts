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
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
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
