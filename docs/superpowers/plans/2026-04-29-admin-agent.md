# Admin AI Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected admin space at `/admin` with an AI agent that rewrites student documents using Claude, and a rules editor backed by Supabase.

**Architecture:** Next.js middleware intercepts all `/admin/*` requests and checks a session cookie; the login route sets that cookie. The AI agent page calls a Route Handler that fetches rules from Supabase and sends them with the document to the Claude API, returning a rewritten version plus a list of changes.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, `@supabase/supabase-js`, `@anthropic-ai/sdk`, `pdfjs-dist`, Jest + React Testing Library

**⚠️ IMPORTANT before writing any code:** Read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `node_modules/next/dist/docs/01-app/02-guides/authentication.md` — this is Next.js 16 and APIs may differ from your training data.

---

## File map

| File | Action | Purpose |
|---|---|---|
| `middleware.ts` | Create | Protect `/admin/*` and `/api/admin/*` routes |
| `lib/supabase.ts` | Create | Server-side Supabase client (service role) |
| `components/admin/AdminSidebar.tsx` | Create | Dark sidebar with logo + nav |
| `components/admin/AdminLayout.tsx` | Create | Sidebar + main content wrapper |
| `app/admin/login/page.tsx` | Create | Login form page |
| `app/api/admin/login/route.ts` | Create | POST: verify password, set session cookie |
| `app/api/admin/rules/route.ts` | Create | GET + POST rules |
| `app/api/admin/rules/[id]/route.ts` | Create | PATCH + DELETE a rule |
| `app/api/admin/improve/route.ts` | Create | POST: call Claude with rules + document |
| `app/admin/regles/page.tsx` | Create | Rules editor UI |
| `app/admin/agent/page.tsx` | Create | AI agent UI |
| `__tests__/admin/middleware.test.ts` | Create | Middleware unit tests |
| `__tests__/admin/login-api.test.ts` | Create | Login route unit tests |
| `__tests__/admin/rules-api.test.ts` | Create | Rules route unit tests |
| `__tests__/admin/improve-api.test.ts` | Create | Improve route unit tests |
| `__tests__/admin/AdminSidebar.test.tsx` | Create | Sidebar component tests |
| `__tests__/admin/ReglesPage.test.tsx` | Create | Rules page integration test |
| `__tests__/admin/AgentPage.test.tsx` | Create | Agent page integration test |

---

## Task 1: Install dependencies and configure environment

**Files:**
- Modify: `package.json` (devDependencies)
- Create: `.env.local` (not committed — already in .gitignore)

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/louiseheraud/Desktop/Presentation
npm install @supabase/supabase-js @anthropic-ai/sdk pdfjs-dist
```

Expected: packages added to `dependencies` in package.json, no errors.

- [ ] **Step 2: Create .env.local with placeholder values**

Create the file `.env.local` at the project root:

```
ADMIN_PASSWORD=changeme
ADMIN_SESSION_TOKEN=supersecret-token-change-this
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> These are placeholders. Louise will fill in real values from her Supabase project and Anthropic account before running.

- [ ] **Step 3: Verify dev server still starts**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000 with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add supabase, anthropic, pdfjs-dist dependencies"
```

---

## Task 2: Supabase client + table migration

**Files:**
- Create: `lib/supabase.ts`
- Create: `supabase/migrations/20260429_create_rules.sql`

- [ ] **Step 1: Create the Supabase server client**

Create `lib/supabase.ts`:

```typescript
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
```

- [ ] **Step 2: Create the migration file**

Create directory `supabase/migrations/` and the file `supabase/migrations/20260429_create_rules.sql`:

```sql
create table if not exists rules (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  "order"     integer not null default 0,
  created_at  timestamptz default now()
);
```

> To run this migration: go to your Supabase dashboard → SQL Editor → paste and run this SQL.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase.ts supabase/
git commit -m "feat: add supabase client and rules table migration"
```

---

## Task 3: Middleware (route protection)

**Files:**
- Create: `middleware.ts`
- Create: `__tests__/admin/middleware.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/middleware.test.ts`:

```typescript
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'

function makeRequest(pathname: string, cookieValue?: string): NextRequest {
  const url = `http://localhost${pathname}`
  const req = new NextRequest(url)
  if (cookieValue) {
    req.cookies.set('admin_session', cookieValue)
  }
  return req
}

const VALID_TOKEN = 'test-token'

beforeEach(() => {
  process.env.ADMIN_SESSION_TOKEN = VALID_TOKEN
})

describe('middleware', () => {
  it('allows /admin/login through without a cookie', async () => {
    const req = makeRequest('/admin/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('redirects unauthenticated requests to /admin/agent', async () => {
    const req = makeRequest('/admin/agent')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/admin/login')
  })

  it('allows authenticated requests to /admin/agent', async () => {
    const req = makeRequest('/admin/agent', VALID_TOKEN)
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('returns 401 for unauthenticated API requests', async () => {
    const req = makeRequest('/api/admin/improve')
    const res = await middleware(req)
    expect(res.status).toBe(401)
  })

  it('allows authenticated API requests', async () => {
    const req = makeRequest('/api/admin/improve', VALID_TOKEN)
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })

  it('allows /api/admin/login through without a cookie', async () => {
    const req = makeRequest('/api/admin/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="middleware" --no-coverage
```

Expected: FAIL — "Cannot find module '@/middleware'"

- [ ] **Step 3: Implement middleware.ts**

Create `middleware.ts` at the project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginRoute =
    pathname === '/admin/login' || pathname === '/api/admin/login'

  if (isLoginRoute) {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')
  const isValid = session?.value === process.env.ADMIN_SESSION_TOKEN

  if (!isValid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="middleware" --no-coverage
```

Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add middleware.ts __tests__/admin/middleware.test.ts
git commit -m "feat: add admin middleware for route protection"
```

---

## Task 4: Login API route

**Files:**
- Create: `app/api/admin/login/route.ts`
- Create: `__tests__/admin/login-api.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/login-api.test.ts`:

```typescript
import { POST } from '@/app/api/admin/login/route'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = 'secret'
const ADMIN_SESSION_TOKEN = 'session-token'

beforeEach(() => {
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD
  process.env.ADMIN_SESSION_TOKEN = ADMIN_SESSION_TOKEN
})

function makePostRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/login', () => {
  it('returns 401 for wrong password', async () => {
    const req = makePostRequest({ password: 'wrong' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 200 for correct password', async () => {
    const req = makePostRequest({ password: ADMIN_PASSWORD })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('sets admin_session cookie on success', async () => {
    const req = makePostRequest({ password: ADMIN_PASSWORD })
    const res = await POST(req)
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain('admin_session')
    expect(setCookie).toContain(ADMIN_SESSION_TOKEN)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="login-api" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement the login route**

Create `app/api/admin/login/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', process.env.ADMIN_SESSION_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="login-api" --no-coverage
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/login/ __tests__/admin/login-api.test.ts
git commit -m "feat: add admin login API route"
```

---

## Task 5: AdminSidebar + AdminLayout components

**Files:**
- Create: `components/admin/AdminSidebar.tsx`
- Create: `components/admin/AdminLayout.tsx`
- Create: `__tests__/admin/AdminSidebar.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/AdminSidebar.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import AdminSidebar from '@/components/admin/AdminSidebar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/agent',
}))

describe('AdminSidebar', () => {
  it('renders Tremplin logo', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('plin')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Agent IA')).toBeInTheDocument()
    expect(screen.getByText('Mes règles')).toBeInTheDocument()
  })

  it('marks Agent IA as active when pathname is /admin/agent', () => {
    render(<AdminSidebar />)
    const agentLink = screen.getByText('Agent IA').closest('a')
    expect(agentLink).toHaveStyle({ color: 'white' })
  })

  it('renders footer with Louise Heraud', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Louise Heraud')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="AdminSidebar" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Create AdminSidebar component**

Create `components/admin/AdminSidebar.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Agent IA', href: '/admin/agent' },
  { label: 'Mes règles', href: '/admin/regles' },
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
        Trem<span style={{ color: '#6366f1' }}>plin</span>
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
```

- [ ] **Step 4: Create AdminLayout component**

Create `components/admin/AdminLayout.tsx`:

```typescript
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="AdminSidebar" --no-coverage
```

Expected: PASS — 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add components/admin/ __tests__/admin/AdminSidebar.test.tsx
git commit -m "feat: add AdminSidebar and AdminLayout components"
```

---

## Task 6: Login page

**Files:**
- Create: `app/admin/login/page.tsx`

No separate test file — the login page is a thin form that delegates to the API. The API is already tested in Task 4. We'll do a smoke render test inline here.

- [ ] **Step 1: Create the login page**

Create `app/admin/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/agent')
    } else {
      setError('Mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f7f8fc',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: '40px 48px',
          width: 360,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,.06)',
        }}
      >
        <div
          style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 4 }}
        >
          Trem<span style={{ color: '#6366f1' }}>plin</span>
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>
          Espace administration
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            style={{
              width: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#374151',
              marginBottom: 12,
              background: '#f9fafb',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 10 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#6366f1',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              padding: 11,
              borderRadius: 8,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Connexion...' : 'Accéder →'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/
git commit -m "feat: add admin login page"
```

---

## Task 7: Rules API routes

**Files:**
- Create: `app/api/admin/rules/route.ts`
- Create: `app/api/admin/rules/[id]/route.ts`
- Create: `__tests__/admin/rules-api.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/rules-api.test.ts`:

```typescript
import { GET, POST } from '@/app/api/admin/rules/route'
import { PATCH, DELETE } from '@/app/api/admin/rules/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

import { supabase } from '@/lib/supabase'

const mockFrom = supabase.from as jest.Mock

function makeRequest(method: string, body?: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/rules', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
}

function makeIdRequest(method: string, id: string, body?: object): NextRequest {
  return new NextRequest(`http://localhost/api/admin/rules/${id}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('GET /api/admin/rules', () => {
  it('returns rules from supabase', async () => {
    const fakeRules = [{ id: '1', text: 'Rule 1', order: 0, created_at: '' }]
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: fakeRules, error: null }),
        }),
      }),
    })

    const res = await GET()
    const data = await res.json()
    expect(data).toEqual(fakeRules)
    expect(res.status).toBe(200)
  })

  it('returns 500 if supabase errors', async () => {
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: null, error: { message: 'db error' } }),
        }),
      }),
    })

    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/admin/rules', () => {
  it('creates a rule and returns 201', async () => {
    const newRule = { id: '2', text: 'New rule', order: 1, created_at: '' }
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [{ order: 0 }], error: null }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: newRule, error: null }),
        }),
      }),
    })

    const req = makeRequest('POST', { text: 'New rule' })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })
})

describe('PATCH /api/admin/rules/[id]', () => {
  it('updates a rule and returns updated data', async () => {
    const updated = { id: '1', text: 'Updated rule', order: 0, created_at: '' }
    mockFrom.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: updated, error: null }),
          }),
        }),
      }),
    })

    const req = makeIdRequest('PATCH', '1', { text: 'Updated rule' })
    const res = await PATCH(req, { params: Promise.resolve({ id: '1' }) })
    const data = await res.json()
    expect(data.text).toBe('Updated rule')
  })
})

describe('DELETE /api/admin/rules/[id]', () => {
  it('deletes a rule and returns 204', async () => {
    mockFrom.mockReturnValue({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    })

    const req = makeIdRequest('DELETE', '1')
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(204)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="rules-api" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement GET + POST rules route**

Create `app/api/admin/rules/route.ts`:

```typescript
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
```

- [ ] **Step 4: Implement PATCH + DELETE rules/[id] route**

Create `app/api/admin/rules/[id]/route.ts`:

```typescript
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="rules-api" --no-coverage
```

Expected: PASS — all tests passing.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/rules/ __tests__/admin/rules-api.test.ts
git commit -m "feat: add admin rules CRUD API routes"
```

---

## Task 8: Improve API route (Claude integration)

**Files:**
- Create: `app/api/admin/improve/route.ts`
- Create: `__tests__/admin/improve-api.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/improve-api.test.ts`:

```typescript
import { POST } from '@/app/api/admin/improve/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({
          data: [
            { text: 'Commencer par un verbe d\'action', order: 0 },
            { text: 'Quantifier les résultats', order: 1 },
          ],
          error: null,
        }),
      }),
    }),
  },
}))

jest.mock('@anthropic-ai/sdk', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                rewritten: 'Document amélioré',
                changes: ['Verbes d\'action ajoutés', 'Résultats chiffrés'],
              }),
            },
          ],
        }),
      },
    })),
  }
})

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/admin/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/improve', () => {
  it('returns rewritten document and changes', async () => {
    const req = makeRequest({ text: 'CV original' })
    const res = await POST(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveProperty('rewritten')
    expect(data).toHaveProperty('changes')
    expect(Array.isArray(data.changes)).toBe(true)
  })

  it('returns 400 if text is missing', async () => {
    const req = makeRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="improve-api" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement the improve route**

Create `app/api/admin/improve/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { text } = body

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  const { data: rules } = await supabase
    .from('rules')
    .select('text, order')
    .order('order', { ascending: true })

  const rulesText =
    rules && rules.length > 0
      ? rules.map((r, i) => `${i + 1}. ${r.text}`).join('\n')
      : '(aucune règle définie)'

  const systemPrompt = `Tu es un assistant spécialisé dans l'amélioration de CVs et lettres de motivation pour les candidatures aux grandes écoles françaises.

Voici les règles à appliquer impérativement :
${rulesText}

Réponds en JSON avec ce format exact :
{
  "rewritten": "le document réécrit complet",
  "changes": ["description du changement 1", "description du changement 2"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: text }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response from Claude' }, { status: 500 })
  }

  const result = JSON.parse(content.text)
  return NextResponse.json(result)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="improve-api" --no-coverage
```

Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/improve/ __tests__/admin/improve-api.test.ts
git commit -m "feat: add Claude improve API route"
```

---

## Task 9: Rules page (/admin/regles)

**Files:**
- Create: `app/admin/regles/page.tsx`
- Create: `__tests__/admin/ReglesPage.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/ReglesPage.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReglesPage from '@/app/admin/regles/page'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/regles',
}))

const fakeRules = [
  { id: '1', text: 'Commencer par un verbe d\'action', order: 0, created_at: '' },
  { id: '2', text: 'Quantifier les résultats', order: 1, created_at: '' },
]

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => fakeRules,
  } as Response)
})

describe('ReglesPage', () => {
  it('renders list of rules', async () => {
    render(<ReglesPage />)
    await waitFor(() => {
      expect(screen.getByText('Commencer par un verbe d\'action')).toBeInTheDocument()
      expect(screen.getByText('Quantifier les résultats')).toBeInTheDocument()
    })
  })

  it('renders add rule input', async () => {
    render(<ReglesPage />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nouvelle règle...')).toBeInTheDocument()
    })
  })

  it('calls fetch to add a rule on button click', async () => {
    render(<ReglesPage />)
    await waitFor(() => screen.getByPlaceholderText('Nouvelle règle...'))

    const input = screen.getByPlaceholderText('Nouvelle règle...')
    fireEvent.change(input, { target: { value: 'Nouvelle règle de test' } })

    const addBtn = screen.getByText('+ Ajouter')
    fireEvent.click(addBtn)

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls
      const postCall = calls.find(
        ([url, opts]: [string, RequestInit]) =>
          url === '/api/admin/rules' && opts.method === 'POST'
      )
      expect(postCall).toBeDefined()
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="ReglesPage" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement the rules page**

Create `app/admin/regles/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import type { Rule } from '@/lib/supabase'

export default function ReglesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newText, setNewText] = useState('')

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    const res = await fetch('/api/admin/rules')
    const data = await res.json()
    setRules(data)
  }

  async function handleSave(id: string) {
    await fetch(`/api/admin/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    })
    setEditingId(null)
    fetchRules()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette règle ?')) return
    await fetch(`/api/admin/rules/${id}`, { method: 'DELETE' })
    fetchRules()
  }

  async function handleAdd() {
    if (!newText.trim()) return
    await fetch('/api/admin/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim() }),
    })
    setNewText('')
    fetchRules()
  }

  return (
    <AdminLayout
      title="Mes règles d'amélioration"
      badge="Appliquées à chaque document"
    >
      <div
        style={{
          background: 'white',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          padding: 14,
        }}
      >
        {rules.map((rule, i) => (
          <div
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '8px 0',
              borderBottom: i < rules.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                background: '#ede9fe',
                color: '#6366f1',
                borderRadius: '50%',
                fontSize: 9,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </div>

            {editingId === rule.id ? (
              <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    border: '1px solid #6366f1',
                    borderRadius: 6,
                    padding: '4px 8px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSave(rule.id)}
                  style={{
                    fontSize: 10,
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    fontSize: 10,
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: 4,
                    padding: '3px 8px',
                    cursor: 'pointer',
                    background: 'white',
                  }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <span
                  style={{ flex: 1, fontSize: 11, color: '#374151', lineHeight: 1.5 }}
                >
                  {rule.text}
                </span>
                <button
                  aria-label="Modifier"
                  onClick={() => {
                    setEditingId(rule.id)
                    setEditText(rule.text)
                  }}
                  style={{
                    fontSize: 10,
                    color: '#d1d5db',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ✏️
                </button>
                <button
                  aria-label="Supprimer"
                  onClick={() => handleDelete(rule.id)}
                  style={{
                    fontSize: 10,
                    color: '#d1d5db',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}

        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nouvelle règle..."
            style={{
              flex: 1,
              fontSize: 11,
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '6px 10px',
              outline: 'none',
              background: '#f9fafb',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              fontSize: 11,
              color: '#6366f1',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Ajouter
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="ReglesPage" --no-coverage
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add app/admin/regles/ __tests__/admin/ReglesPage.test.tsx
git commit -m "feat: add rules editor page /admin/regles"
```

---

## Task 10: Agent page (/admin/agent)

**Files:**
- Create: `app/admin/agent/page.tsx`
- Create: `__tests__/admin/AgentPage.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/admin/AgentPage.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AgentPage from '@/app/admin/agent/page'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/agent',
}))

jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  version: '3.0.0',
  getDocument: jest.fn(),
}))

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      rewritten: 'Document amélioré par Claude',
      changes: ['Verbes d\'action ajoutés', 'Résultats chiffrés'],
    }),
  } as Response)
})

describe('AgentPage', () => {
  it('renders mode toggle buttons', () => {
    render(<AgentPage />)
    expect(screen.getByText('Coller du texte')).toBeInTheDocument()
    expect(screen.getByText('Uploader un PDF')).toBeInTheDocument()
  })

  it('renders improve button', () => {
    render(<AgentPage />)
    expect(screen.getByText('Améliorer →')).toBeInTheDocument()
  })

  it('calls improve API and shows result', async () => {
    render(<AgentPage />)

    const textarea = screen.getByPlaceholderText(
      /collez ici le cv/i
    )
    fireEvent.change(textarea, { target: { value: 'Mon CV original' } })

    const btn = screen.getByText('Améliorer →')
    fireEvent.click(btn)

    await waitFor(() => {
      expect(screen.getByText('Document amélioré par Claude')).toBeInTheDocument()
    })
  })

  it('shows changes after improvement', async () => {
    render(<AgentPage />)

    const textarea = screen.getByPlaceholderText(/collez ici le cv/i)
    fireEvent.change(textarea, { target: { value: 'Mon CV original' } })
    fireEvent.click(screen.getByText('Améliorer →'))

    await waitFor(() => {
      expect(screen.getByText('Verbes d\'action ajoutés')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="AgentPage" --no-coverage
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement the agent page**

Create `app/admin/agent/page.tsx`:

```typescript
'use client'

import { useState, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

type Result = { rewritten: string; changes: string[] }

export default function AgentPage() {
  const [mode, setMode] = useState<'text' | 'pdf'>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const canRun = mode === 'text' ? text.trim().length > 0 : file !== null

  async function handleImprove() {
    setLoading(true)
    setError('')
    setResult(null)

    let inputText = text

    if (mode === 'pdf' && file) {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageTexts = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) =>
          pdf
            .getPage(i + 1)
            .then((page) => page.getTextContent())
            .then((content) =>
              content.items.map((item: { str: string }) => item.str).join(' ')
            )
        )
      )
      inputText = pageTexts.join('\n')
    }

    try {
      const res = await fetch('/api/admin/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      setResult(await res.json())
    } catch {
      setError('Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout
      title="Agent IA — Amélioration de documents"
      badge="Claude Sonnet"
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['text', 'pdf'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              background: mode === m ? '#6366f1' : 'white',
              color: mode === m ? 'white' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            {m === 'text' ? 'Coller du texte' : 'Uploader un PDF'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Input panel */}
        <div
          style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Document original
          </div>

          {mode === 'text' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le CV ou la lettre de motivation de l'étudiant(e)..."
              style={{
                width: '100%',
                minHeight: 200,
                background: '#f9fafb',
                border: '1px dashed #d1d5db',
                borderRadius: 6,
                padding: 10,
                fontSize: 11,
                color: '#374151',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                minHeight: 200,
                background: '#f9fafb',
                border: '1px dashed #d1d5db',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: 8,
              }}
            >
              {file ? (
                <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>
                  {file.name}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  Cliquer pour uploader un PDF
                </span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ display: 'none' }}
              />
            </div>
          )}

          <button
            onClick={handleImprove}
            disabled={loading || !canRun}
            style={{
              marginTop: 10,
              background: '#6366f1',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: loading || !canRun ? 'not-allowed' : 'pointer',
              opacity: loading || !canRun ? 0.5 : 1,
            }}
          >
            {loading ? 'Amélioration...' : 'Améliorer →'}
          </button>
        </div>

        {/* Output panel */}
        <div
          style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Résultat
          </div>

          {error && (
            <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>
          )}

          {!result && !error && (
            <div
              style={{
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d1d5db',
                fontSize: 11,
              }}
            >
              Le document amélioré apparaîtra ici
            </div>
          )}

          {result && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: '#374151',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {result.rewritten}
              </p>
              <div style={{ margin: '12px 0', borderTop: '1px solid #f3f4f6' }} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Changements
              </div>
              {result.changes.map((change, i) => (
                <div key={i} style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#fef9c3',
                      color: '#ca8a04',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      marginRight: 4,
                    }}
                  >
                    Modifié
                  </span>
                  {change}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="AgentPage" --no-coverage
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Run all tests to verify nothing is broken**

```bash
npm test -- --no-coverage
```

Expected: all tests passing (existing 12 + new admin tests).

- [ ] **Step 6: Commit**

```bash
git add app/admin/agent/ __tests__/admin/AgentPage.test.tsx
git commit -m "feat: add AI agent page /admin/agent"
```

---

## Task 11: End-to-end smoke check

**No new files — manual verification steps.**

- [ ] **Step 1: Fill in real values in .env.local**

Louise needs to:
1. Go to [supabase.com](https://supabase.com) → create project → Settings → API → copy URL, anon key, service_role key
2. Run the SQL migration from `supabase/migrations/20260429_create_rules.sql` in Supabase SQL Editor
3. Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → create key
4. Update `.env.local` with real values + choose a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN`

- [ ] **Step 2: Start dev server and test login**

```bash
npm run dev
```

Open http://localhost:3000/admin → should redirect to http://localhost:3000/admin/login.
Enter the password from `.env.local` → should redirect to `/admin/agent`.

- [ ] **Step 3: Test rules page**

Navigate to `/admin/regles`. Add a few rules. Verify they persist (refresh the page).
Edit a rule. Delete a rule.

- [ ] **Step 4: Test agent with text**

Navigate to `/admin/agent`. Paste a sample CV text. Click "Améliorer →". Verify the result panel shows the rewritten document and changes.

- [ ] **Step 5: Test agent with PDF**

Switch to "Uploader un PDF". Upload a PDF file. Click "Améliorer →". Verify the result appears.

- [ ] **Step 6: Add environment variables to Vercel**

```bash
vercel env add ADMIN_PASSWORD production
vercel env add ADMIN_SESSION_TOKEN production
vercel env add ANTHROPIC_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Then redeploy:
```bash
vercel --prod
```

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: admin space complete — login, agent, rules"
```
