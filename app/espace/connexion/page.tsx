// app/espace/connexion/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Tab = 'connexion' | 'inscription'

export default function ConnexionPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()

    if (tab === 'inscription') {
      if (password !== confirm) {
        setError('Les mots de passe ne correspondent pas.')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(
          error.message === 'User already registered'
            ? 'Un compte existe déjà avec cet email.'
            : error.message
        )
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou mot de passe incorrect.')
        setLoading(false)
        return
      }
    }

    router.push('/espace')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
      <header className="px-8 py-5 bg-white border-b border-gray-100">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900">
          Trem<span className="text-indigo-500">plin</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1">
            {(['connexion', 'inscription'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'connexion' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <form role="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="ton@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="••••••••"
              />
            </div>

            {tab === 'inscription' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {loading
                ? '...'
                : tab === 'connexion'
                ? 'Se connecter'
                : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
