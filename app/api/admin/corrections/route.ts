import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const { data, error } = await supabase
    .from('corrections')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const { student_id, student_email, type, label, before_text, after_text } =
    await request.json()

  if (!student_id || !student_email || !type || !label || !before_text || !after_text) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
  }

  const { error } = await supabase.from('corrections').insert({
    student_id,
    student_email,
    type,
    label,
    before_text,
    after_text,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { error: emailError } = await resend.emails.send({
    from: 'CapOral <onboarding@resend.dev>',
    to: student_email,
    subject: `Nouvelle correction disponible sur CapOral`,
    html: `
      <p>Bonjour,</p>
      <p>Louise a partagé une nouvelle correction avec toi sur CapOral : <strong>${label}</strong>.</p>
      <p>Connecte-toi à ton espace pour la consulter : <a href="https://presentation-navy-seven.vercel.app/espace/corrections">Voir ma correction →</a></p>
      <p>À bientôt,<br/>L'équipe CapOral</p>
    `,
  })
  if (emailError) {
    console.error('Resend error:', emailError)
  }

  return NextResponse.json({ ok: true })
}
