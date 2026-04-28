export type Stat = {
  value: string
  label: string
}

export type Step = {
  bold: string
  rest: string
}

export type Service = {
  title: string
  slug: 'oraux' | 'lettre' | 'cv'
  emoji: string
  duration: string
  format: string
  tagline: string
  description: string
  stats: [Stat, Stat, Stat]
  steps: [Step, Step, Step, Step]
  calendlyUrl: string
  contactEmail: string
}
