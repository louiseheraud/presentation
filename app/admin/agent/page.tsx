'use client'

import { useState, useRef, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

type Result = { rewritten: string; changes: string[] }
type Student = { id: string; email: string }

export default function AgentPage() {
  const [mode, setMode] = useState<'text' | 'pdf'>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [sendLabel, setSendLabel] = useState('')
  const [sendType, setSendType] = useState<'cv' | 'ldm'>('cv')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const canRun = mode === 'text' ? text.trim().length > 0 : file !== null

  useEffect(() => {
    fetch('/api/admin/students')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setStudents(data) })
      .catch(() => {})
  }, [])

  async function handleImprove() {
    setLoading(true)
    setError('')
    setResult(null)
    setSent(false)

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
              content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
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

  async function handleSend() {
    if (!selectedStudent || !sendLabel.trim() || !result) return
    setSending(true)
    const student = students.find((s) => s.id === selectedStudent)
    if (!student) return

    const inputText = mode === 'text' ? text : '[PDF uploadé]'

    await fetch('/api/admin/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: student.id,
        student_email: student.email,
        type: sendType,
        label: sendLabel.trim(),
        before_text: inputText,
        after_text: result.rewritten,
      }),
    })
    setSending(false)
    setSent(true)
  }

  const btnStyle = (active: boolean) => ({
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid #e5e7eb',
    background: active ? '#6366f1' : 'white',
    color: active ? 'white' : '#6b7280',
    cursor: 'pointer',
  })

  return (
    <AdminLayout title="Agent IA — Amélioration de documents" badge="Claude Sonnet">
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['text', 'pdf'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={btnStyle(mode === m)}>
            {m === 'text' ? 'Coller du texte' : 'Uploader un PDF'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Input panel */}
        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Document original
          </div>

          {mode === 'text' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le CV ou la lettre de motivation de l'étudiant(e)..."
              style={{ width: '100%', minHeight: 200, background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 6, padding: 10, fontSize: 11, color: '#374151', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{ minHeight: 200, background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}
            >
              {file ? (
                <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{file.name}</span>
              ) : (
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Cliquer pour uploader un PDF</span>
              )}
              <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
            </div>
          )}

          <button
            onClick={handleImprove}
            disabled={loading || !canRun}
            style={{ marginTop: 10, background: '#6366f1', color: 'white', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: loading || !canRun ? 'not-allowed' : 'pointer', opacity: loading || !canRun ? 0.5 : 1 }}
          >
            {loading ? 'Amélioration...' : 'Améliorer →'}
          </button>
        </div>

        {/* Output panel */}
        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Résultat
          </div>

          {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}

          {!result && !error && (
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: 11 }}>
              Le document amélioré apparaîtra ici
            </div>
          )}

          {result && (
            <div>
              <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {result.rewritten}
              </p>
              <div style={{ margin: '12px 0', borderTop: '1px solid #f3f4f6' }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Changements
              </div>
              {result.changes.map((change, i) => (
                <div key={i} style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>
                  <span style={{ display: 'inline-block', background: '#fef9c3', color: '#ca8a04', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, marginRight: 4 }}>
                    Modifié
                  </span>
                  {change}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send to student panel */}
      {result && (
        <div style={{ marginTop: 12, background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Envoyer à un étudiant
          </div>

          {sent ? (
            <p style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
              ✓ Correction envoyée — l'étudiant a reçu un email.
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>Étudiant</div>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{ fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', outline: 'none', background: '#f9fafb' }}
                >
                  <option value="">Sélectionner...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.email}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>Type</div>
                <select
                  value={sendType}
                  onChange={(e) => setSendType(e.target.value as 'cv' | 'ldm')}
                  style={{ fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', outline: 'none', background: '#f9fafb' }}
                >
                  <option value="cv">CV</option>
                  <option value="ldm">Lettre de motivation</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>Libellé</div>
                <input
                  value={sendLabel}
                  onChange={(e) => setSendLabel(e.target.value)}
                  placeholder="ex: CV Marketing Mai 2026"
                  style={{ width: '100%', fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={sending || !selectedStudent || !sendLabel.trim()}
                style={{ background: '#6366f1', color: 'white', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: sending || !selectedStudent || !sendLabel.trim() ? 'not-allowed' : 'pointer', opacity: sending || !selectedStudent || !sendLabel.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}
              >
                {sending ? 'Envoi...' : 'Envoyer →'}
              </button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
