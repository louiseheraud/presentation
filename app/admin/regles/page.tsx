'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import type { Rule } from '@/lib/supabase'

export default function ReglesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newText, setNewText] = useState('')

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    const res = await fetch('/api/admin/rules', { method: 'GET' })
    const data = await res.json()
    setRules(data)
  }

  async function handleSave(id: string) {
    await fetch(`/api/admin/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    })
    setEditingId(null)
    fetchRules()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette règle ?')) return
    await fetch(`/api/admin/rules/${id}`, { method: 'DELETE' })
    fetchRules()
  }

  async function handleAdd() {
    if (!newText.trim()) return
    await fetch('/api/admin/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim() }),
    })
    setNewText('')
    fetchRules()
  }

  return (
    <AdminLayout
      title="Mes règles d'amélioration"
      badge="Appliquées à chaque document"
    >
      <div
        style={{
          background: 'white',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          padding: 14,
        }}
      >
        {rules.map((rule, i) => (
          <div
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '8px 0',
              borderBottom: i < rules.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                background: '#ede9fe',
                color: '#6366f1',
                borderRadius: '50%',
                fontSize: 9,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </div>

            {editingId === rule.id ? (
              <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    border: '1px solid #6366f1',
                    borderRadius: 6,
                    padding: '4px 8px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSave(rule.id)}
                  style={{
                    fontSize: 10,
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    fontSize: 10,
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: 4,
                    padding: '3px 8px',
                    cursor: 'pointer',
                    background: 'white',
                  }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <span
                  style={{ flex: 1, fontSize: 11, color: '#374151', lineHeight: 1.5 }}
                >
                  {rule.text}
                </span>
                <button
                  aria-label="Modifier"
                  onClick={() => {
                    setEditingId(rule.id)
                    setEditText(rule.text)
                  }}
                  style={{
                    fontSize: 10,
                    color: '#d1d5db',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ✏️
                </button>
                <button
                  aria-label="Supprimer"
                  onClick={() => handleDelete(rule.id)}
                  style={{
                    fontSize: 10,
                    color: '#d1d5db',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}

        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nouvelle règle..."
            style={{
              flex: 1,
              fontSize: 11,
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '6px 10px',
              outline: 'none',
              background: '#f9fafb',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              fontSize: 11,
              color: '#6366f1',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Ajouter
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
