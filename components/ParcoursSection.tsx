import Link from 'next/link'
import type { Parcours } from '@/lib/parcours'

export default function ParcoursSection({ parcours }: { parcours: Parcours }) {
  return (
    <div>

      {/* Hero */}
      <section className="bg-indigo-600 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-indigo-500 text-indigo-100 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
            {parcours.label}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Réussissez vos oraux<br />
            <span className="text-indigo-200">{parcours.label === 'Prépa' ? 'grandes écoles' : parcours.label === 'Post bac' ? 'post bac' : 'admissions parallèles'}</span>
          </h1>
          <p className="text-lg text-indigo-100 leading-relaxed max-w-2xl mx-auto mb-10">
            {parcours.intro}
          </p>
          <Link
            href={parcours.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-base"
          >
            Réserver ma séance découverte →
          </Link>
        </div>
      </section>

      {/* Corps — deux colonnes */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* Écoles */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Écoles préparées</h2>
          <div className="flex flex-col gap-8">
            {parcours.programs.map((prog, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">{prog.label}</p>
                <div className="flex flex-wrap gap-2">
                  {prog.schools.map((school, j) => (
                    <span
                      key={j}
                      className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full"
                    >
                      {school}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prestations */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Ce qu'on travaille ensemble</h2>
          <div className="flex flex-col gap-4">
            {parcours.services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                  Étape {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="py-12 px-6 text-center">
        <p className="text-gray-500 mb-6">Prêt(e) à commencer ? La première séance est gratuite.</p>
        <Link
          href={parcours.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Réserver ma séance découverte →
        </Link>
      </section>

    </div>
  )
}
