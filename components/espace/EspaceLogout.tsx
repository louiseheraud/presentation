'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function EspaceLogout() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      Se déconnecter
    </button>
  )
}
