'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

type Example = {
  id: string
  label: string
  before_text: string
  after_text: string
}

export default function ExemplesPage() {
  const [examples, setExamples] = useState<Example[]>([])
  const [label, setLabel] = useState('')
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => { fetchExamples() }, [])

  async function fetchExamples() {
    const res = await fetch('/api/admin/examples')
    setExamples(await res.json())
  }

  async function handleAdd() {
    if (!label.trim() || !before.trim() || !after.trim()) return
    setSaving(true)
    await fetch('/api/admin/examples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label.trim(), before_text: before.trim(), after_text: after.trim() }),
    })
    setLabel('')
    setBefore('')
    setAfter('')
    setSaving(false)
    fetchExamples()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet exemple ?')) return
    await fetch(`/api/admin/examples/${id}`, { method: 'DELETE' })
    fetchExamples()
  }

  const inputStyle = {
    width: '100%',
    fontSize: 11,
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: '6px 10px',
    outline: 'none',
    background: '#f9fafb',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  }

  return (
    <AdminLayout title="Exemples avant / après" badge="Inclus dans le prompt">

      {/* Existing examples */}
      {examples.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {examples.map((ex) => (
            <div
              key={ex.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                marginBottom: 8,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
                onClick={() => setOpen(open === ex.id ? null : ex.id)}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                  {ex.label}
                </span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>
                    {open === ex.id ? '▲ Réduire' : '▼ Voir'}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(ex.id) }}
                    style={{ fontSize: 11, color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {open === ex.id && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 14px 14px' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      Avant
                    </div>
                    <pre style={{ fontSize: 10, color: '#374151', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, whiteSpace: 'pre-wrap', margin: 0 }}>
                      {ex.before_text}
                    </pre>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      Après
                    </div>
                    <pre style={{ fontSize: 10, color: '#374151', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: 8, whiteSpace: 'pre-wrap', margin: 0 }}>
                      {ex.after_text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new example */}
      <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          Ajouter un exemple
        </div>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nom de l'exemple (ex: CV étudiant commerce)"
          style={{ ...inputStyle, marginBottom: 10 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              CV original (avant)
            </div>
            <textarea
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              placeholder="Collez le CV original ici..."
              rows={12}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              CV corrigé (après)
            </div>
            <textarea
              value={after}
              onChange={(e) => setAfter(e.target.value)}
              placeholder="Collez le CV corrigé ici..."
              rows={12}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={saving || !label.trim() || !before.trim() || !after.trim()}
          style={{
            background: '#6366f1',
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving || !label.trim() || !before.trim() || !after.trim() ? 0.5 : 1,
          }}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder l\'exemple'}
        </button>
      </div>
    </AdminLayout>
  )
}
