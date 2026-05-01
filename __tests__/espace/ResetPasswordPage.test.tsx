import { act, render, screen, fireEvent } from '@testing-library/react'

const mockUpdateUser = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockCreateSupabaseBrowser = jest.fn(() => ({
  auth: { updateUser: mockUpdateUser },
}))

jest.mock('@/lib/supabase-browser', () => ({
  get createSupabaseBrowser() { return mockCreateSupabaseBrowser },
}))

import ResetPasswordPage from '@/app/espace/reset-password/page'

describe('ResetPasswordPage', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('shows error when passwords do not match', async () => {
    render(<ResetPasswordPage />)
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'abcdef' } })
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'xyz' } })
    await act(async () => {
      fireEvent.submit(document.querySelector('form')!)
    })
    expect(screen.getByText(/ne correspondent pas/i)).toBeTruthy()
  })

  it('shows success message after update', async () => {
    mockUpdateUser.mockResolvedValue({ error: null })
    render(<ResetPasswordPage />)
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'abcdef' } })
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'abcdef' } })
    await act(async () => {
      fireEvent.submit(document.querySelector('form')!)
    })
    expect(screen.getByText(/Mot de passe mis à jour/i)).toBeTruthy()
  })
})
