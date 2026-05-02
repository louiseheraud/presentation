import Link from 'next/link'
import Image from 'next/image'
import ParcoursNav from '@/components/ParcoursNav'

export default function AProposPage() {
  return (
    <>
      <ParcoursNav />
      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-16">

        {/* Qui je suis */}
        <section>
          <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
            À propos
          </div>
          <div className="flex items-center gap-6 mb-6">
            <Image
              src="/profile-pic-2.png"
              alt="Louise Heraud"
              width={96}
              height={96}
              className="rounded-full object-cover w-24 h-24 flex-shrink-0"
            />
            <h1 className="text-3xl font-extrabold text-gray-900">Louise Heraud</h1>
          </div>
          <div className="flex flex-col gap-4 text-gray-600 leading-relaxed">
            <p>
              Après <strong className="text-gray-900">14 ans à l'étranger</strong>, j'ai développé une vision internationale des candidatures et une capacité à m'adapter à des profils très différents.
            </p>
            <p>
              Depuis <strong className="text-gray-900">4 ans</strong>, j'accompagne des étudiants dans leur préparation aux oraux et dossiers — post bac, prépa et admissions parallèles (AST). J'ai travaillé avec <strong className="text-gray-900">plus de 400 étudiants</strong>, avec un taux de réussite de <strong className="text-gray-900">95 %</strong>.
            </p>
            <p>
              Ma méthode repose sur une préparation structurée et un coaching personnalisé : l'objectif est que chaque étudiant arrive à l'oral avec une vraie confiance, pas juste des réponses apprises par cœur.
            </p>
          </div>
        </section>

        {/* Tarifs */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Tarifs</h2>
          <p className="text-gray-500 mb-8">En moyenne, les étudiants que j'accompagne font <strong className="text-gray-700">2 à 3 séances</strong>.</p>

          <div className="flex flex-col gap-4">
            {/* Séance découverte */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 flex items-start justify-between gap-4">
              <div>
                <div className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  Pour commencer
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Séance découverte</h3>
                <p className="text-sm text-gray-600">15 minutes pour faire connaissance, échanger sur votre profil et définir vos objectifs ensemble.</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-extrabold text-indigo-600">Gratuit</div>
              </div>
            </div>

            {/* Séance individuelle */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 flex items-start justify-between gap-4 shadow-sm">
              <div>
                <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  Séance individuelle
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Coaching personnalisé</h3>
                <p className="text-sm text-gray-600">Oraux, CV, lettre de motivation — chaque séance est adaptée à votre profil et à l'école visée.</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-extrabold text-gray-900">50 €</div>
                <div className="text-xs text-gray-400">par heure</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
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
