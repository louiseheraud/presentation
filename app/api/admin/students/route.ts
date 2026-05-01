import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const students = data.users.map((u) => ({ id: u.id, email: u.email ?? '' }))
  return NextResponse.json(students)
}
