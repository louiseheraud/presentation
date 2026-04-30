import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EspaceLogout from '@/components/espace/EspaceLogout'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockSignOut = jest.fn().mockResolvedValue({})

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: { signOut: mockSignOut },
  }),
}))

describe('EspaceLogout', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockRefresh.mockClear()
    mockSignOut.mockClear()
  })

  it('renders the logout button', () => {
    render(<EspaceLogout />)
    expect(screen.getByText('Se déconnecter')).toBeTruthy()
  })

  it('calls signOut and redirects to / on click', async () => {
    render(<EspaceLogout />)
    fireEvent.click(screen.getByText('Se déconnecter'))
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })
})
