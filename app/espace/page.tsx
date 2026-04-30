'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const sections = [
  {
    label: 'Documents',
    icon: '📄',
    description: 'Les fichiers partagés par Louise.',
  },
  {
    label: 'Corrections',
    icon: '✏️',
    description: 'Les corrections de tes documents.',
  },
  {
    label: 'Notes de session',
    icon: '📝',
    description: 'Le compte-rendu de tes séances.',
  },
  {
    label: 'Chat',
    icon: '💬',
    description: 'Échange directement avec Louise.',
  },
]

export default function EspacePage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  const firstName = email ? email.split('@')[0] : ''

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
        Bonjour{firstName ? ` ${firstName}` : ''} 👋
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Bienvenue dans ton espace Tremplin.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {sections.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h2 className="font-bold text-gray-900 mb-1">{s.label}</h2>
            <p className="text-xs text-gray-500 mb-4">{s.description}</p>
            <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">
              À venir
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
