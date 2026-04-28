export type Program = {
  label: string
  schools: string[]
}

export type ServiceCard = {
  title: string
  description: string
  emoji: string
}

export type Parcours = {
  id: string
  label: string
  emoji: string
  intro: string
  programs: Program[]
  services: ServiceCard[]
  calendlyUrl: string
  contactEmail: string
}

export const parcoursList: Parcours[] = [
  {
    id: 'post-bac',
    label: 'Post bac',
    emoji: '🎓',
    intro:
      "Vous visez une école de commerce ou une université internationale directement après le bac ? Je vous prépare aux entretiens de personnalité et à la constitution de votre dossier pour maximiser vos chances.",
    programs: [
      {
        label: 'Écoles de commerce post bac',
        schools: ['IESEG', 'ESCA', 'KEDGE Bachelor', 'SKEMA Bachelor', 'Rennes SB Bachelor', 'Audencia Bachelor'],
      },
      {
        label: 'Programmes internationaux',
        schools: [
          'Double diplôme Angleterre (UCL, LSE, Warwick)',
          'IE Madrid',
          'McGill',
          'Bocconi',
          'Sciences Po',
        ],
      },
    ],
    services: [
      {
        title: 'Préparation aux entretiens de personnalité',
        description:
          "Simulation d'entretien, feedback précis et axes de progression pour chaque école visée.",
        emoji: '🎙️',
      },
      {
        title: 'Préparation des dossiers',
        description: 'CV et lettre de motivation travaillés pour mettre votre profil en valeur.',
        emoji: '📄',
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/post-bac',
    contactEmail: 'louiseh217@gmail.com',
  },
  {
    id: 'prepa',
    label: 'Prépa',
    emoji: '📚',
    intro:
      "Vous préparez les concours des grandes écoles de commerce ? Je vous accompagne dans la préparation des entretiens de personnalité, spécifiques à chaque école, pour aborder l'oral avec confiance.",
    programs: [
      {
        label: 'Grandes écoles préparées',
        schools: ['HEC', 'ESSEC', 'ESCP', 'EDHEC', 'emlyon', 'Audencia', 'GEM', 'ICN', 'Montpellier BS', 'Rennes SB'],
      },
    ],
    services: [
      {
        title: 'Préparation aux entretiens de personnalité',
        description:
          "Préparation spécifique à chaque école : codes, attendus du jury, simulation en conditions réelles.",
        emoji: '🎙️',
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/prepa',
    contactEmail: 'louiseh217@gmail.com',
  },
  {
    id: 'ast',
    label: 'Admissions parallèles',
    emoji: '🔀',
    intro:
      "Vous êtes en L2/L3 ou en école et souhaitez intégrer une grande école de commerce en admission parallèle (AST) ? Je vous aide à construire un dossier solide et à préparer vos oraux.",
    programs: [
      {
        label: 'Grandes écoles en AST',
        schools: ['HEC', 'ESSEC', 'ESCP', 'EDHEC', 'emlyon', 'Audencia', 'GEM', 'ESCE', 'Excelia', 'Rennes SB'],
      },
    ],
    services: [
      {
        title: 'Préparation aux entretiens de personnalité',
        description:
          "Simulation sur-mesure selon votre profil AST et les codes de chaque école.",
        emoji: '🎙️',
      },
      {
        title: 'Préparation des dossiers',
        description: 'CV et lettre de motivation adaptés aux exigences des admissions parallèles.',
        emoji: '📄',
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/ast',
    contactEmail: 'louiseh217@gmail.com',
  },
]
