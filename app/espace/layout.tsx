// app/espace/layout.tsx
import Link from 'next/link'
import EspaceLogout from '@/components/espace/EspaceLogout'

const navItems = [
  { label: 'Documents', href: '/espace/documents', icon: '📄' },
  { label: 'Corrections', href: '/espace/corrections', icon: '✏️' },
  { label: 'Notes de session', href: '/espace/notes', icon: '📝' },
  { label: 'Chat', href: '/espace/chat', icon: '💬' },
]

export default function EspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900">
          Cap<span className="text-indigo-500">Oral</span>
        </Link>
        <EspaceLogout />
      </header>

      <div className="flex flex-1">
        <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-100 py-6">
          <p className="px-5 pb-3 text-xs font-bold tracking-widest uppercase text-gray-400">
            Mon espace
          </p>
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
