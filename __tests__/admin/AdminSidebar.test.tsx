import { render, screen } from '@testing-library/react'
import AdminSidebar from '@/components/admin/AdminSidebar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/agent',
}))

describe('AdminSidebar', () => {
  it('renders CapOral logo', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Oral')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Agent IA')).toBeInTheDocument()
    expect(screen.getByText('Mes règles')).toBeInTheDocument()
  })

  it('marks Agent IA as active when pathname is /admin/agent', () => {
    render(<AdminSidebar />)
    const agentLink = screen.getByText('Agent IA').closest('a')
    expect(agentLink).toHaveStyle({ color: 'rgb(255, 255, 255)' })
  })

  it('renders footer with Louise Heraud', () => {
    render(<AdminSidebar />)
    expect(screen.getByText(/Louise Heraud/)).toBeInTheDocument()
  })
})
