'use client'

import { useState, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

type Result = { rewritten: string; changes: string[] }

export default function AgentPage() {
  const [mode, setMode] = useState<'text' | 'pdf'>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const canRun = mode === 'text' ? text.trim().length > 0 : file !== null

  async function handleImprove() {
    setLoading(true)
    setError('')
    setResult(null)

    let inputText = text

    if (mode === 'pdf' && file) {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageTexts = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) =>
          pdf
            .getPage(i + 1)
            .then((page) => page.getTextContent())
            .then((content) =>
              content.items.map((item: { str: string }) => item.str).join(' ')
            )
        )
      )
      inputText = pageTexts.join('\n')
    }

    try {
      const res = await fetch('/api/admin/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      setResult(await res.json())
    } catch {
      setError('Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout
      title="Agent IA — Amélioration de documents"
      badge="Claude Sonnet"
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['text', 'pdf'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              background: mode === m ? '#6366f1' : 'white',
              color: mode === m ? 'white' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            {m === 'text' ? 'Coller du texte' : 'Uploader un PDF'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Input panel */}
        <div
          style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Document original
          </div>

          {mode === 'text' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le CV ou la lettre de motivation de l'étudiant(e)..."
              style={{
                width: '100%',
                minHeight: 200,
                background: '#f9fafb',
                border: '1px dashed #d1d5db',
                borderRadius: 6,
                padding: 10,
                fontSize: 11,
                color: '#374151',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                minHeight: 200,
                background: '#f9fafb',
                border: '1px dashed #d1d5db',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: 8,
              }}
            >
              {file ? (
                <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>
                  {file.name}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  Cliquer pour uploader un PDF
                </span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ display: 'none' }}
              />
            </div>
          )}

          <button
            onClick={handleImprove}
            disabled={loading || !canRun}
            style={{
              marginTop: 10,
              background: '#6366f1',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: loading || !canRun ? 'not-allowed' : 'pointer',
              opacity: loading || !canRun ? 0.5 : 1,
            }}
          >
            {loading ? 'Amélioration...' : 'Améliorer →'}
          </button>
        </div>

        {/* Output panel */}
        <div
          style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Résultat
          </div>

          {error && (
            <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>
          )}

          {!result && !error && (
            <div
              style={{
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d1d5db',
                fontSize: 11,
              }}
            >
              Le document amélioré apparaîtra ici
            </div>
          )}

          {result && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: '#374151',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {result.rewritten}
              </p>
              <div style={{ margin: '12px 0', borderTop: '1px solid #f3f4f6' }} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Changements
              </div>
              {result.changes.map((change, i) => (
                <div key={i} style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#fef9c3',
                      color: '#ca8a04',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      marginRight: 4,
                    }}
                  >
                    Modifié
                  </span>
                  {change}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
