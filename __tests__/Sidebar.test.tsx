import { render, screen } from '@testing-library/react'
import Sidebar from '@/components/Sidebar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/oraux',
}))

test('affiche le logo CapOral', () => {
  render(<Sidebar />)
  expect(screen.getByText(/Cap/i)).toBeInTheDocument()
  expect(screen.getByText(/Oral/i)).toBeInTheDocument()
})

test('affiche les 3 services dans la nav', () => {
  render(<Sidebar />)
  expect(screen.getByText('Oraux')).toBeInTheDocument()
  expect(screen.getByText('Lettre de motiv')).toBeInTheDocument()
  expect(screen.getByText('CV')).toBeInTheDocument()
})

test('le service actif a la classe active', () => {
  render(<Sidebar />)
  const oraux = screen.getByText('Oraux').closest('a')
  expect(oraux).toHaveClass('border-l-indigo-500')
})
