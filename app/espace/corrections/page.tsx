'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Correction = {
  id: string
  type: 'cv' | 'ldm'
  label: string
  before_text: string
  after_text: string
  created_at: string
}

export default function CorrectionsPage() {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase
      .from('corrections')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCorrections(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="text-sm text-gray-400">Chargement...</p>
  }

  if (corrections.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Aucune correction reçue pour l'instant.
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Mes corrections</h1>
      <div className="flex flex-col gap-4">
        {corrections.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === c.id ? null : c.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.type === 'cv' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                  {c.type === 'cv' ? 'CV' : 'LDM'}
                </span>
                <span className="text-sm font-semibold text-gray-800">{c.label}</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString('fr-FR')}
                {open === c.id ? ' ▲' : ' ▼'}
              </span>
            </button>

            {open === c.id && (
              <div className="grid grid-cols-2 gap-4 px-5 pb-5">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Original</p>
                  <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                    {c.before_text}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Corrigé</p>
                  <pre className="text-xs text-gray-800 bg-indigo-50 border border-indigo-100 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                    {c.after_text}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
