import { createClient } from '@supabase/supabase-js'

export type Rule = {
  id: string
  text: string
  order: number
  created_at: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
