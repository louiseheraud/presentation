import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const { text } = await request.json()

  const { data, error } = await supabase
    .from('rules')
    .update({ text })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  const { error } = await supabase.from('rules').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
