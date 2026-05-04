'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Post bac', href: '/post-bac' },
  { label: 'Prépa', href: '/prepa' },
  { label: 'AST', href: '/ast' },
  { label: 'À propos', href: '/a-propos' },
]

export default function ParcoursNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="w-full px-6 md:px-8 py-4 flex items-center">

        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="font-black text-xl tracking-tight text-gray-900">
            Cap<span className="text-indigo-500">Oral</span>
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
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

        {/* Boutons desktop */}
        <div className="hidden md:flex flex-1 justify-end gap-2">
          <Link
            href="https://calendly.com/louiseh217"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Réserver une séance
          </Link>
          <Link
            href="/espace"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Mon espace
          </Link>
        </div>

        {/* Bouton hamburger mobile */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
            <Link
              href="https://calendly.com/louiseh217"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-bold text-indigo-600 border border-indigo-300 rounded-lg text-center hover:bg-indigo-50 transition-colors"
            >
              Réserver une séance
            </Link>
            <Link
              href="/espace"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg text-center transition-colors"
            >
              Mon espace
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
