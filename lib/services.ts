import type { Service } from './types'

export const services: Record<string, Service> = {
  oraux: {
    title: 'Entraînement aux oraux',
    slug: 'oraux',
    emoji: '🎙️',
    duration: '45 min',
    format: 'Visio',
    tagline: 'Prends confiance avant tes oraux',
    description: 'On simule ton oral ensemble, je te donne un feedback précis et on travaille tes points faibles en temps réel.',
    stats: [
      { value: "45'", label: 'Durée de la session' },
      { value: 'Visio', label: 'Format' },
      { value: 'J+1', label: 'Feedback écrit' },
    ],
    steps: [
      { bold: "Tu m'envoies ton sujet", rest: ' ou le type d\'oral que tu prépares (BCPST, MP, TSI...)' },
      { bold: "On simule l'oral complet", rest: ' dans les conditions réelles — je joue le rôle du jury' },
      { bold: 'Débriefing immédiat', rest: ' : ce qui marche, ce qui coince, les axes à travailler' },
      { bold: 'Fiche de feedback', rest: ' envoyée le lendemain pour ancrer les points clés' },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/oraux',
    contactEmail: 'louiseh217@gmail.com',
  },
  lettre: {
    title: 'Lettre de motivation',
    slug: 'lettre',
    emoji: '✉️',
    duration: '30 min',
    format: 'Visio',
    tagline: 'Une lettre qui te démarque vraiment',
    description: 'On reprend ta lettre ensemble : structure, accroche, cohérence avec ton projet. Tu ressors avec une version béton.',
    stats: [
      { value: "30'", label: 'Durée de la session' },
      { value: 'Visio', label: 'Format' },
      { value: 'Relecture', label: 'Incluse' },
    ],
    steps: [
      { bold: "Tu m'envoies ta lettre", rest: ' en avance (même ébauche) pour que je la lise' },
      { bold: 'On la décortique ensemble', rest: ' : accroche, structure, formulations, cohérence' },
      { bold: 'On réécrit les passages', rest: ' qui manquent d\'impact, en direct' },
      { bold: 'Version finale relue', rest: ' sous 24h après la session' },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/lettre',
    contactEmail: 'louiseh217@gmail.com',
  },
  cv: {
    title: 'CV',
    slug: 'cv',
    emoji: '📄',
    duration: '20 min',
    format: 'Visio',
    tagline: 'Un CV qui donne envie de te rencontrer',
    description: 'On passe ton CV au crible : mise en page, formulations, ce qu\'il faut mettre en avant. Simple, efficace, percutant.',
    stats: [
      { value: "20'", label: 'Durée de la session' },
      { value: 'Visio', label: 'Format' },
      { value: 'PDF', label: 'Conseils envoyés' },
    ],
    steps: [
      { bold: "Tu m'envoies ton CV", rest: ' en PDF avant la session' },
      { bold: 'On identifie les faiblesses', rest: ' : mise en page, formulations, manques' },
      { bold: 'Conseils de reformulation', rest: ' sur chaque point important' },
      { bold: 'Résumé des points clés', rest: ' envoyé après la session' },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/cv',
    contactEmail: 'louiseh217@gmail.com',
  },
}

export const serviceOrder: Service['slug'][] = ['oraux', 'lettre', 'cv']
