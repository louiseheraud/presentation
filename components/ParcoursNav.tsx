'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Post bac', href: '/post-bac' },
  { label: 'Prépa', href: '/prepa' },
  { label: 'Admissions parallèles', href: '/ast' },
  { label: 'À propos', href: '/a-propos' },
]

export default function ParcoursNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="w-full px-8 py-4 flex items-center gap-6">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900 flex-shrink-0">
          Cap<span className="text-indigo-500">Oral</span>
        </Link>
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex justify-end gap-2">
          <Link
            href="https://calendly.com/louiseh217/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Réserver ma séance découverte
          </Link>
          <Link
            href="/espace"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Accéder à ton espace
          </Link>
        </div>
      </div>
    </header>
  )
}
