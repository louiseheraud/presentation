// __tests__/espace/ConnexionPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ConnexionPage from '@/app/espace/connexion/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}))

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true }),
}) as jest.Mock

describe('ConnexionPage', () => {
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
})
