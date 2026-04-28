'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { serviceOrder } from '@/lib/services'

const icons: Record<string, string> = {
  oraux: '🎙️',
  lettre: '✉️',
  cv: '📄',
}

const labels: Record<string, string> = {
  oraux: 'Oraux',
  lettre: 'Lettre de motiv',
  cv: 'CV',
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 flex-shrink-0 bg-gray-900 flex flex-col h-full">
      <div className="px-5 py-6 border-b border-gray-800">
        <span className="text-white font-black text-lg tracking-tight">
          Trem<span className="text-indigo-500">plin</span>
        </span>
      </div>

      <nav className="flex flex-col pt-4 flex-1">
        <p className="px-5 pb-2 text-xs font-bold tracking-widest uppercase text-gray-600">
          Services
        </p>
        {serviceOrder.map((slug) => {
          const active = pathname === `/${slug}`
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-gray-800 text-white border-l-2 border-l-indigo-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{icons[slug]}</span>
              <span>{labels[slug]}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-800 text-xs text-gray-600">
        Louise Heraud
        <br />
        Coach prépa
      </div>
    </aside>
  )
}
