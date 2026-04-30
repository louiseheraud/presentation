'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Agent IA', href: '/admin/agent' },
  { label: 'Mes règles', href: '/admin/regles' },
  { label: 'Mes exemples', href: '/admin/exemples' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div
      style={{
        width: 180,
        background: '#111827',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '20px 0',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          color: 'white',
          fontWeight: 900,
          fontSize: 15,
          padding: '0 16px 20px',
          borderBottom: '1px solid #1f2937',
        }}
      >
        Cap<span style={{ color: '#6366f1' }}>Oral</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '10px 16px',
                fontSize: 12,
                color: active ? 'white' : '#9ca3af',
                background: active ? '#1f2937' : 'transparent',
                borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid #1f2937',
          fontSize: 10,
          color: '#4b5563',
        }}
      >
        Louise Heraud
        <br />
        Admin
      </div>
    </div>
  )
}
