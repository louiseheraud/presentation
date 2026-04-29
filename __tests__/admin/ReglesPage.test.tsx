import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReglesPage from '@/app/admin/regles/page'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/regles',
}))

const fakeRules = [
  { id: '1', text: 'Commencer par un verbe d\'action', order: 0, created_at: '' },
  { id: '2', text: 'Quantifier les résultats', order: 1, created_at: '' },
]

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => fakeRules,
  } as Response)
})

describe('ReglesPage', () => {
  it('renders list of rules', async () => {
    render(<ReglesPage />)
    await waitFor(() => {
      expect(screen.getByText('Commencer par un verbe d\'action')).toBeInTheDocument()
      expect(screen.getByText('Quantifier les résultats')).toBeInTheDocument()
    })
  })

  it('renders add rule input', async () => {
    render(<ReglesPage />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nouvelle règle...')).toBeInTheDocument()
    })
  })

  it('calls fetch to add a rule on button click', async () => {
    render(<ReglesPage />)
    await waitFor(() => screen.getByPlaceholderText('Nouvelle règle...'))

    const input = screen.getByPlaceholderText('Nouvelle règle...')
    fireEvent.change(input, { target: { value: 'Nouvelle règle de test' } })

    const addBtn = screen.getByText('+ Ajouter')
    fireEvent.click(addBtn)

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls
      const postCall = calls.find(
        ([url, opts]: [string, RequestInit]) =>
          url === '/api/admin/rules' && opts.method === 'POST'
      )
      expect(postCall).toBeDefined()
    })
  })
})
