import type { Parcours } from '@/lib/parcours'

export default function ParcoursSection({ parcours }: { parcours: Parcours }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">

      {/* Introduction */}
      <section>
        <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-5">
          {parcours.label}
        </div>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{parcours.intro}</p>
      </section>

      {/* Parcours couverts */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Parcours couverts</h2>
        <p className="text-gray-500 mb-8">Les écoles et programmes pour lesquels je vous prépare.</p>
        <div className="grid md:grid-cols-2 gap-8">
          {parcours.programs.map((prog, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-gray-700 mb-3">{prog.label}</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {prog.schools.map((school, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {school}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Prestations */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Mes prestations</h2>
        <p className="text-gray-500 mb-8">Ce que l'on travaille ensemble, dans l'ordre.</p>
        <div className="grid md:grid-cols-2 gap-6">
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
      </section>

      {/* CTA */}
      <section className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Prêt(e) à vous lancer ?</h2>
        <p className="text-gray-500 mb-8">Réservez un créneau directement dans mon agenda — c'est confirmé instantanément.</p>
        <a
          href={parcours.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
        >
          Réserver un créneau
        </a>
      </section>

    </div>
  )
}
