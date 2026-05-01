// __tests__/espace/ConnexionPage.test.tsx
import { act, render, screen, fireEvent } from '@testing-library/react'

const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()
const mockResetPasswordForEmail = jest.fn()
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

const mockCreateSupabaseBrowser = jest.fn(() => ({
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    resetPasswordForEmail: mockResetPasswordForEmail,
  },
}))

jest.mock('@/lib/supabase-browser', () => ({
  get createSupabaseBrowser() { return mockCreateSupabaseBrowser },
}))

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true }),
}) as jest.Mock

import ConnexionPage from '@/app/espace/connexion/page'

describe('ConnexionPage', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('renders connexion tab by default with email and password fields', () => {
    render(<ConnexionPage />)
    expect(screen.getByText('Connexion')).toBeTruthy()
    expect(screen.getByPlaceholderText('ton@email.com')).toBeTruthy()
    expect(screen.queryByText('Confirmer le mot de passe')).toBeNull()
  })

  it('shows confirm password field on inscription tab', () => {
    render(<ConnexionPage />)
    fireEvent.click(screen.getByText('Créer un compte'))
    expect(screen.getByText('Confirmer le mot de passe')).toBeTruthy()
  })

  it('shows error when passwords do not match on inscription', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<ConnexionPage />)
    fireEvent.click(screen.getByText('Créer un compte'))
    fireEvent.change(screen.getByPlaceholderText('ton@email.com'), {
      target: { value: 'test@test.com' },
    })
    const passwordFields = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(passwordFields[0], { target: { value: 'password1' } })
    fireEvent.change(passwordFields[1], { target: { value: 'password2' } })
    fireEvent.submit(screen.getByRole('form'))
    expect(await screen.findByText('Les mots de passe ne correspondent pas.')).toBeTruthy()
  })

  it('shows forgot password form when link clicked', async () => {
    render(<ConnexionPage />)
    await act(async () => {
      fireEvent.click(screen.getByText('Mot de passe oublié ?'))
    })
    expect(screen.getByText(/Saisis ton email/i)).toBeTruthy()
  })

  it('shows reset sent message after successful reset', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null })
    render(<ConnexionPage />)
    await act(async () => {
      fireEvent.click(screen.getByText('Mot de passe oublié ?'))
    })
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('ton@email.com'), {
        target: { value: 'test@test.com' },
      })
      fireEvent.submit(screen.getByText('Envoyer le lien').closest('form')!)
    })
    expect(screen.getByText(/Email envoyé/i)).toBeTruthy()
  })
})
