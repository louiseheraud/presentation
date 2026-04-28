'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { serviceOrder } from '@/lib/services'

const icons: Record<string, string> = { oraux: '🎙️', lettre: '✉️', cv: '📄' }
const labels: Record<string, string> = { oraux: 'Oraux', lettre: 'Lettre de motiv', cv: 'CV' }

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-black text-lg tracking-tight">
          Trem<span className="text-indigo-500">plin</span>
        </span>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white text-2xl leading-none">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <nav className="border-t border-gray-800 pb-2">
          {serviceOrder.map((slug) => (
            <Link
              key={slug}
              href={`/${slug}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 text-sm ${
                pathname === `/${slug}` ? 'text-white bg-gray-800' : 'text-gray-400'
              }`}
            >
              <span>{icons[slug]}</span>
              <span>{labels[slug]}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
