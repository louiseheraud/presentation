import { act, render, screen } from '@testing-library/react'
import CorrectionsPage from '@/app/espace/corrections/page'

const mockOrderWithData = jest.fn().mockResolvedValue({
  data: [
    {
      id: 'c1',
      type: 'cv',
      label: 'CV Marketing',
      before_text: 'CV brut',
      after_text: 'CV corrigé',
      created_at: '2026-05-01T10:00:00Z',
    },
  ],
  error: null,
})

const mockSupabaseWithData = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    order: mockOrderWithData,
  }),
}

const mockCreateSupabaseBrowser = jest.fn(() => mockSupabaseWithData)

jest.mock('@/lib/supabase-browser', () => ({
  get createSupabaseBrowser() {
    return mockCreateSupabaseBrowser
  },
}))

describe('CorrectionsPage', () => {
  it('displays correction label after load', async () => {
    await act(async () => { render(<CorrectionsPage />) })
    expect(screen.getByText('CV Marketing')).toBeTruthy()
  })

  it('shows empty state when no corrections', async () => {
    mockCreateSupabaseBrowser.mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })
    await act(async () => { render(<CorrectionsPage />) })
    expect(screen.getByText(/aucune correction/i)).toBeTruthy()
  })
})
