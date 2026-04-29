'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/agent')
    } else {
      setError('Mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f7f8fc',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: '40px 48px',
          width: 360,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,.06)',
        }}
      >
        <div
          style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 4 }}
        >
          Trem<span style={{ color: '#6366f1' }}>plin</span>
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>
          Espace administration
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            style={{
              width: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#374151',
              marginBottom: 12,
              background: '#f9fafb',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 10 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#6366f1',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              padding: 11,
              borderRadius: 8,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Connexion...' : 'Accéder →'}
          </button>
        </form>
      </div>
    </div>
  )
}
