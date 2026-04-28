import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Steps from '@/components/Steps'
import CTA from '@/components/CTA'
import { services } from '@/lib/services'

const s = services.oraux

test('Hero affiche le tagline et la description', () => {
  render(<Hero service={s} />)
  expect(screen.getByText(s.tagline)).toBeInTheDocument()
  expect(screen.getByText(s.description)).toBeInTheDocument()
})

test('Stats affiche les 3 valeurs', () => {
  render(<Stats stats={s.stats} />)
  expect(screen.getByText("45'")).toBeInTheDocument()
  expect(screen.getByText('Visio')).toBeInTheDocument()
  expect(screen.getByText('J+1')).toBeInTheDocument()
})

test('Steps affiche 4 étapes', () => {
  render(<Steps steps={s.steps} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(4)
})

test('CTA contient le lien Calendly', () => {
  render(<CTA service={s} />)
  const btn = screen.getByRole('link', { name: /réserver/i })
  expect(btn).toHaveAttribute('href', s.calendlyUrl)
})
