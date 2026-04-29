import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AgentPage from '@/app/admin/agent/page'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/agent',
}))

jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  version: '3.0.0',
  getDocument: jest.fn(),
}))

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      rewritten: 'Document amélioré par Claude',
      changes: ['Verbes d\'action ajoutés', 'Résultats chiffrés'],
    }),
  } as Response)
})

describe('AgentPage', () => {
  it('renders mode toggle buttons', () => {
    render(<AgentPage />)
    expect(screen.getByText('Coller du texte')).toBeInTheDocument()
    expect(screen.getByText('Uploader un PDF')).toBeInTheDocument()
  })

  it('renders improve button', () => {
    render(<AgentPage />)
    expect(screen.getByText('Améliorer →')).toBeInTheDocument()
  })

  it('calls improve API and shows result', async () => {
    render(<AgentPage />)

    const textarea = screen.getByPlaceholderText(
      /collez ici le cv/i
    )
    fireEvent.change(textarea, { target: { value: 'Mon CV original' } })

    const btn = screen.getByText('Améliorer →')
    fireEvent.click(btn)

    await waitFor(() => {
      expect(screen.getByText('Document amélioré par Claude')).toBeInTheDocument()
    })
  })

  it('shows changes after improvement', async () => {
    render(<AgentPage />)

    const textarea = screen.getByPlaceholderText(/collez ici le cv/i)
    fireEvent.change(textarea, { target: { value: 'Mon CV original' } })
    fireEvent.click(screen.getByText('Améliorer →'))

    await waitFor(() => {
      expect(screen.getByText('Verbes d\'action ajoutés')).toBeInTheDocument()
    })
  })
})
