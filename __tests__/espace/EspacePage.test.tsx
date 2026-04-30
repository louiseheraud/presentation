import { render, screen, act } from '@testing-library/react'
import EspacePage from '@/app/espace/page'

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { email: 'sophie@example.com' } },
      }),
    },
  }),
}))

describe('EspacePage', () => {
  it('renders the four placeholder section cards', async () => {
    await act(async () => { render(<EspacePage />) })
    expect(screen.getByText('Documents')).toBeTruthy()
    expect(screen.getByText('Corrections')).toBeTruthy()
    expect(screen.getByText('Notes de session')).toBeTruthy()
    expect(screen.getByText('Chat')).toBeTruthy()
  })

  it('renders À venir badges on each card', async () => {
    await act(async () => { render(<EspacePage />) })
    const badges = screen.getAllByText('À venir')
    expect(badges).toHaveLength(4)
  })

  it('renders personalised greeting from email', async () => {
    await act(async () => { render(<EspacePage />) })
    expect(screen.getByText(/Bonjour sophie/)).toBeTruthy()
  })
})
