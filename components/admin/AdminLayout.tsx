import AdminSidebar from './AdminSidebar'

type Props = {
  children: React.ReactNode
  title: string
  badge: string
}

export default function AdminLayout({ children, title, badge }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          background: '#f7f8fc',
          padding: 20,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
            {title}
          </h1>
          <span
            style={{
              background: '#ede9fe',
              color: '#6366f1',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 20,
            }}
          >
            {badge}
          </span>
        </div>
        {children}
      </main>
    </div>
  )
}
