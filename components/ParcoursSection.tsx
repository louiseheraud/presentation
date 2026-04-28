import type { Parcours } from '@/lib/parcours'

export default function ParcoursSection({ parcours }: { parcours: Parcours }) {
  return (
    <section id={parcours.id} className="py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Intro */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
            <span>{parcours.emoji}</span>
            <span>{parcours.label}</span>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{parcours.intro}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Programs */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              Parcours couverts
            </h3>
            <div className="flex flex-col gap-6">
              {parcours.programs.map((prog, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">{prog.label}</p>
                  <ul className="flex flex-col gap-1.5">
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
          </div>

          {/* Services + CTA */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Mes prestations
            </h3>
            {parcours.services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="text-2xl mb-2">{service.emoji}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{service.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}

            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <a
                href={parcours.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
              >
                📅 Réserver un créneau
              </a>
              <a
                href={`mailto:${parcours.contactEmail}`}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Des questions ?
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 border-b border-gray-100" />
      </div>
    </section>
  )
}
