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
        schools: [
          'IESEG', 'ESSCA', 'EM Normandie', 'Excelia', 'ESSEC Global BBA',
          'SKEMA BBA', 'NEOMA Global BBA', 'emlyon Global BBA', 'KEDGE BBA',
          'ESCE', 'EMLV', 'ESDES', 'IPAG', 'PSB Paris', 'EM Strasbourg',
          'GEM BBA', 'EDC Paris', 'EBS Paris',
        ],
      },
      {
        label: 'Sciences Po & IEP',
        schools: [
          'Sciences Po Paris', 'IEP Bordeaux', 'IEP Lyon', 'IEP Grenoble',
          'IEP Toulouse', 'IEP Lille', 'IEP Rennes', 'IEP Aix', 'IEP Strasbourg',
        ],
      },
      {
        label: 'Programmes internationaux',
        schools: ['IE Madrid', 'ESADE Barcelona', 'University of Essex', 'Oxford', 'Cambridge', '...'],
      },
    ],
    services: [
      {
        title: 'Dossier — CV & Lettre de motivation',
        description: 'Travail sur votre CV et votre lettre de motivation : structure, contenu, formulation. Un dossier adapté aux attentes de chaque école.',
      },
      {
        title: 'Préparation aux oraux',
        description: "Construction d'un pitch structuré, préparation aux questions types, entraînement en conditions réelles.",
      },
    ],
    calendlyUrl: 'https://calendly.com/louiseh217/30min',
  },
  {
    id: 'prepa',
    label: 'Prépa',
    intro:
      "Vous préparez les concours des grandes écoles de commerce ? Je vous accompagne dans la préparation des entretiens de personnalité, spécifiques à chaque école, pour aborder l'oral avec confiance.",
    programs: [
      {
        label: 'Grandes écoles (classement 2025)',
        schools: [
          'HEC', 'ESSEC', 'ESCP', 'EDHEC', 'emlyon', 'SKEMA',
          'Audencia', 'GEM', 'Kedge', 'TBS', 'Rennes SB', 'Montpellier BS',
          'ICN', 'BSB', 'ESC Clermont', 'Excelia', '...',
        ],
      },
    ],
    services: [
      {
        title: 'Préparation aux oraux',
        description: "Construction d'un pitch structuré, préparation aux questions types, entraînement en conditions réelles.",
      },
      {
        title: 'Dossiers spécifiques',
        description: "Certaines écoles demandent un travail en amont de l'oral : CV projectif (SKEMA), réponses à des questions écrites (ESCP). Préparation adaptée à chaque format.",
      },
    ],
    calendlyUrl: 'https://calendly.com/louiseh217/30min',
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
        title: 'Dossier — CV & Lettre de motivation',
        description: 'Travail sur votre CV et votre lettre de motivation : structure, contenu, formulation. Un dossier adapté aux attentes de chaque école.',
      },
      {
        title: 'Préparation aux oraux',
        description: "Construction d'un pitch structuré, préparation aux questions types, entraînement en conditions réelles.",
      },
    ],
    calendlyUrl: 'https://calendly.com/louiseh217/30min',
  },
]
