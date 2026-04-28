import { services } from '@/lib/services'

test('3 services are defined', () => {
  expect(Object.keys(services)).toHaveLength(3)
})

test('each service has required fields', () => {
  for (const s of Object.values(services)) {
    expect(s).toHaveProperty('title')
    expect(s).toHaveProperty('slug')
    expect(s).toHaveProperty('duration')
    expect(s).toHaveProperty('format')
    expect(s).toHaveProperty('tagline')
    expect(s).toHaveProperty('description')
    expect(s).toHaveProperty('stats')
    expect(s).toHaveProperty('steps')
    expect(s).toHaveProperty('calendlyUrl')
    expect(s.stats).toHaveLength(3)
    expect(s.steps).toHaveLength(4)
  }
})
