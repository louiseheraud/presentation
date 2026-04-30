import { render, screen } from '@testing-library/react'
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
  it('renders the four placeholder section cards', () => {
    render(<EspacePage />)
    expect(screen.getByText('Documents')).toBeTruthy()
    expect(screen.getByText('Corrections')).toBeTruthy()
    expect(screen.getByText('Notes de session')).toBeTruthy()
    expect(screen.getByText('Chat')).toBeTruthy()
  })

  it('renders À venir badges on each card', () => {
    render(<EspacePage />)
    const badges = screen.getAllByText('À venir')
    expect(badges).toHaveLength(4)
  })
})
