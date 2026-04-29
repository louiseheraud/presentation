import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { text } = await request.json()

  const { data: existing } = await supabase
    .from('rules')
    .select('order')
    .order('order', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)

  const nextOrder =
    existing && existing.length > 0 ? existing[0].order + 1 : 0

  const { data, error } = await supabase
    .from('rules')
    .insert({ text, order: nextOrder })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
