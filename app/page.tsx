import Link from 'next/link'
import ParcoursNav from '@/components/ParcoursNav'

const whyItems = [
  {
    icon: '🎯',
    title: 'Préparation méthodique',
    description: 'Oraux, CV, lettres de motivation — une méthode structurée étape par étape pour aborder chaque partie de votre candidature avec clarté.',
  },
  {
    icon: '✨',
    title: 'Séances personnalisées',
    description: 'Chaque séance s\'adapte à votre profil, à l\'école visée et à vos points de progression. Un coaching pour booster votre confiance.',
  },
  {
    icon: '🏆',
    title: '+140 étudiants accompagnés',
    description: "Une large expérience sur la préparation des dossiers et des oraux pour les grandes écoles, en France et à l'international, pour vous préparer avec les codes que les jurys attendent.",
  },
]

const testimonials = [
  {
    name: 'Sophie',
    school: 'EDHEC',
    text: 'Grâce aux simulations d\'entretien, j\'ai intégré HEC dans les meilleures conditions. Le feedback était précis et vraiment utile.',
  },
  {
    name: 'Thomas',
    school: 'KEDGE Bachelor',
    text: 'Ma lettre de motivation a été entièrement retravaillée — j\'ai été accepté à KEDGE Bachelor dès le premier tour.',
  },
  {
    name: 'Camille',
    school: 'emlyon',
    text: 'J\'avais peur des oraux. Après deux sessions d\'entraînement, j\'y allais avec confiance. Je recommande à 100%.',
  },
  {
    name: 'Hugo',
    school: 'emlyon',
    text: 'Préparation AST très sérieuse, adaptée aux exigences de chaque école. J\'ai décroché emlyon en admission parallèle.',
  },
]

const parcours = [
  { label: 'Post bac', href: '/post-bac', description: 'Écoles de commerce et programmes internationaux après le bac.' },
  { label: 'Prépa', href: '/prepa', description: 'Entretiens de personnalité pour les concours grandes écoles.' },
  { label: 'AST', href: '/ast', description: 'AST grandes écoles et IAE depuis une L2/L3 ou une école.' },
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

        {/* Pourquoi CapOral */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pourquoi choisir CapOral ?</h2>
            <p className="text-gray-500 mb-10">Un coaching pensé pour vous faire progresser vite et durablement.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {whyItems.map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 p-6">
                  <div className="text-2xl mb-4">{item.icon}</div>
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
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Les élèves témoignent</h2>
            <p className="text-gray-500 mb-10">Ce que disent les étudiants après leurs sessions.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-indigo-500 font-semibold">{t.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center">
          <p className="text-gray-500 mb-6">Prêt(e) à commencer ? La première séance est gratuite.</p>
          <Link
            href="https://calendly.com/louiseh217/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Réserver ma séance découverte →
          </Link>
        </section>

      </main>
    </>
  )
}
