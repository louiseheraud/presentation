import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase
    .from('cv_examples')
    .select('*')
    .order('created_at', { ascending: true })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const { label, before_text, after_text } = await request.json()
  const { data, error } = await supabase
    .from('cv_examples')
    .insert({ label, before_text, after_text })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
