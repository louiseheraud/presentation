import Link from 'next/link'
import ParcoursNav from '@/components/ParcoursNav'

const whyItems = [
  {
    title: 'Méthodique',
    description: 'Une préparation structurée étape par étape : dossier, puis entraînement oral, puis débriefing. Rien n\'est laissé au hasard.',
  },
  {
    title: 'Sur mesure',
    description: 'Chaque session est adaptée à votre profil, à l\'école visée et aux attendus spécifiques du jury.',
  },
  {
    title: 'Confiance retrouvée',
    description: 'L\'objectif n\'est pas seulement de vous préparer, c\'est de vous faire arriver serein(e) le jour J.',
  },
  {
    title: 'Expertise terrain',
    description: 'Une connaissance précise des codes de chaque école, construite sur l\'expérience des concours et des admissions.',
  },
]

const testimonials = [
  {
    name: 'Sophie M.',
    text: 'Grâce aux simulations d\'entretien, j\'ai intégré HEC dans les meilleures conditions. Le feedback était précis et vraiment utile.',
  },
  {
    name: 'Thomas L.',
    text: 'Ma lettre de motivation a été entièrement retravaillée — j\'ai été accepté à KEDGE Bachelor dès le premier tour.',
  },
  {
    name: 'Camille D.',
    text: 'J\'avais peur des oraux. Après deux sessions d\'entraînement, j\'y allais avec confiance. Je recommande à 100%.',
  },
  {
    name: 'Hugo R.',
    text: 'Préparation AST très sérieuse, adaptée aux exigences de chaque école. J\'ai décroché emlyon en admission parallèle.',
  },
]

const parcours = [
  { label: 'Post bac', href: '/post-bac', description: 'Écoles de commerce et programmes internationaux après le bac.' },
  { label: 'Prépa', href: '/prepa', description: 'Entretiens de personnalité pour les concours grandes écoles.' },
  { label: 'Admissions parallèles', href: '/ast', description: 'AST grandes écoles et IAE depuis une L2/L3 ou une école.' },
]

export default function Home() {
  return (
    <>
      <ParcoursNav />
      <main>

        {/* Hero */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
              Coaching individuel en visio
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Préparez vos dossiers et oraux<br />
              <span className="text-indigo-500">d'école en confiance</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
              Lettres de motivation, CV, entretiens de personnalité — un accompagnement sur mesure pour chaque étape de votre candidature.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {parcours.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  {p.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi Tremplin */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pourquoi choisir Tremplin ?</h2>
            <p className="text-gray-500 mb-10">Un coaching pensé pour vous faire progresser vite et durablement.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {whyItems.map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avis clients */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Ils ont été accompagnés</h2>
            <p className="text-gray-500 mb-10">Ce que disent les étudiants après leurs sessions.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
