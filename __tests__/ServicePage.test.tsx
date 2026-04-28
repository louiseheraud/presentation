import { render, screen } from '@testing-library/react'
import ServicePage from '@/components/ServicePage'
import { services } from '@/lib/services'

test('ServicePage affiche le titre du service dans la topbar', () => {
  render(<ServicePage service={services.oraux} />)
  expect(screen.getByText('Entraînement aux oraux')).toBeInTheDocument()
})

test('ServicePage affiche le badge durée', () => {
  render(<ServicePage service={services.oraux} />)
  expect(screen.getByText('45 min · Visio')).toBeInTheDocument()
})
