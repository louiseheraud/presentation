/**
 * @jest-environment node
 */
import { POST } from '@/app/api/admin/improve/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({
          data: [
            { text: 'Commencer par un verbe d\'action', order: 0 },
            { text: 'Quantifier les résultats', order: 1 },
          ],
          error: null,
        }),
      }),
    }),
  },
}))

jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                rewritten: 'Document amélioré',
                changes: ['Verbes d\'action ajoutés', 'Résultats chiffrés'],
              }),
            },
          ],
        }),
      },
    })),
  }
})

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/improve', () => {
  it('returns rewritten document and changes', async () => {
    const req = makeRequest({ text: 'CV original' })
    const res = await POST(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveProperty('rewritten')
    expect(data).toHaveProperty('changes')
    expect(Array.isArray(data.changes)).toBe(true)
  })

  it('returns 400 if text is missing', async () => {
    const req = makeRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
