export type Program = {
  label: string
  schools: string[]
}

export type ServiceCard = {
  title: string
  description: string
}

export type Parcours = {
  id: string
  label: string
  intro: string
  programs: Program[]
  services: ServiceCard[]
  calendlyUrl: string
}

export const parcoursList: Parcours[] = [
  {
    id: 'post-bac',
    label: 'Post bac',
    intro:
      "Vous visez une école de commerce ou une université internationale directement après le bac ? Je vous prépare à la constitution de votre dossier et aux entretiens de personnalité pour maximiser vos chances.",
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
        title: 'Préparation des dossiers',
        description: 'CV et lettre de motivation travaillés en amont pour mettre votre profil en valeur.',
      },
      {
        title: 'Préparation aux entretiens de personnalité',
        description: "Simulation d'entretien, feedback précis et axes de progression pour chaque école visée.",
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/post-bac',
  },
  {
    id: 'prepa',
    label: 'Prépa',
    intro:
      "Vous préparez les concours des grandes écoles de commerce ? Je vous accompagne dans la préparation des entretiens de personnalité, spécifiques à chaque école, pour aborder l'oral avec confiance.",
    programs: [
      {
        label: 'Grandes écoles',
        schools: ['HEC', 'ESSEC', 'ESCP', 'EDHEC', 'emlyon', 'Audencia', 'GEM', 'ICN', 'Montpellier BS', 'Rennes SB', 'TBS', 'Kedge', '...'],
      },
    ],
    services: [
      {
        title: 'Préparation aux entretiens de personnalité',
        description: "Préparation spécifique à chaque école : codes, attendus du jury, simulation en conditions réelles.",
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/prepa',
  },
  {
    id: 'ast',
    label: 'Admissions parallèles',
    intro:
      "Vous êtes en L2/L3 ou en école et souhaitez intégrer une grande école en admission parallèle (AST) ? Je vous aide à construire un dossier solide et à préparer vos oraux.",
    programs: [
      {
        label: 'Grandes écoles de commerce',
        schools: ['HEC', 'ESSEC', 'ESCP', 'EDHEC', 'emlyon', 'Audencia', 'GEM', 'ESCE', 'Excelia', 'Rennes SB', 'Kedge', 'TBS', '...'],
      },
      {
        label: 'IAE',
        schools: ['IAE Paris', 'IAE Lyon', 'IAE Bordeaux', 'IAE Strasbourg', 'IAE Nantes', '...'],
      },
    ],
    services: [
      {
        title: 'Préparation des dossiers',
        description: 'CV et lettre de motivation adaptés en amont aux exigences des admissions parallèles.',
      },
      {
        title: 'Préparation aux entretiens de personnalité',
        description: "Simulation sur-mesure selon votre profil AST et les codes de chaque école.",
      },
    ],
    calendlyUrl: 'https://calendly.com/REMPLACER/ast',
  },
]
