'use client'

import { parcoursList } from '@/lib/parcours'

export default function ParcoursNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center gap-2">
        <span className="font-black text-xl tracking-tight text-gray-900 mr-4 flex-shrink-0">
          Trem<span className="text-indigo-500">plin</span>
        </span>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            Accueil
          </button>
          {parcoursList.map((p) => (
            <button
              key={p.id}
              onClick={() => scrollTo(p.id)}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap"
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
