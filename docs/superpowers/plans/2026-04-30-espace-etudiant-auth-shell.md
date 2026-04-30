# Espace Étudiant — Auth + Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a private student space to Tremplin — signup/login with Supabase Auth, protected `/espace` routes, and a dashboard shell with four placeholder sections.

**Architecture:** Students authenticate via email/password using Supabase Auth with cookies (via `@supabase/ssr`). The `proxy.ts` middleware validates sessions server-side before serving any `/espace/*` page. The dashboard shows four placeholder cards (Documents, Corrections, Notes, Chat) to be filled in sub-projects 2–4.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase Auth, `@supabase/ssr`, `@supabase/supabase-js` v2, Jest + React Testing Library.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/supabase-browser.ts` | Create | `createBrowserClient` factory for client components |
| `lib/supabase-server.ts` | Create | `createServerClient` factory + response for proxy/API |
| `proxy.ts` | Modify | Add async espace route protection |
| `components/ParcoursNav.tsx` | Modify | Replace Calendly button with "Accéder à ton espace" |
| `components/espace/EspaceLogout.tsx` | Create | Client component: logout button |
| `app/espace/layout.tsx` | Create | Server layout: header + sidebar + main |
| `app/espace/connexion/page.tsx` | Create | Login / signup tabs page |
| `app/espace/page.tsx` | Create | Dashboard home with placeholder cards |
| `__tests__/espace/proxy-espace.test.ts` | Create | Proxy espace route protection tests |
| `__tests__/espace/ConnexionPage.test.tsx` | Create | Login/signup UI tests |
| `__tests__/espace/EspaceLogout.test.tsx` | Create | Logout button tests |
| `__tests__/espace/EspacePage.test.tsx` | Create | Dashboard placeholder cards tests |

---

## Task 1: Install @supabase/ssr

**Files:**
- Modify: `package.json` (auto-updated by npm)

- [ ] **Step 1: Install the package**

```bash
npm install @supabase/ssr
```

Expected: `added N packages` with no errors.

- [ ] **Step 2: Verify install**

```bash
node -e "require('@supabase/ssr'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @supabase/ssr for cookie-based auth"
```

---

## Task 2: Supabase browser client

**Files:**
- Create: `lib/supabase-browser.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase-browser.ts
git commit -m "feat: add Supabase browser client factory"
```

---

## Task 3: Supabase server client + update proxy.ts

**Files:**
- Create: `lib/supabase-server.ts`
- Modify: `proxy.ts`
- Create: `__tests__/espace/proxy-espace.test.ts`

- [ ] **Step 1: Write the failing proxy tests**

```typescript
// __tests__/espace/proxy-espace.test.ts
/**
 * @jest-environment node
 */
import { proxy } from '@/proxy'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase-server', () => ({
  createSupabaseServer: jest.fn(),
}))

import { createSupabaseServer } from '@/lib/supabase-server'

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`)
}

describe('proxy - espace routes', () => {
  it('allows /espace/connexion through without a session', async () => {
    const res = await proxy(makeRequest('/espace/connexion'))
    expect(res.status).not.toBe(307)
  })

  it('redirects /espace to /espace/connexion when no session', async () => {
    ;(createSupabaseServer as jest.Mock).mockReturnValue({
      supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
      response: { cookies: { set: jest.fn() } },
    })
    const res = await proxy(makeRequest('/espace'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/espace/connexion')
  })

  it('allows /espace when session is valid', async () => {
    ;(createSupabaseServer as jest.Mock).mockReturnValue({
      supabase: { auth: { getUser: async () => ({ data: { user: { email: 'test@example.com' } } }) } },
      response: new Response(null, { status: 200 }),
    })
    const res = await proxy(makeRequest('/espace'))
    expect(res.status).not.toBe(307)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern="proxy-espace" --no-coverage
```

Expected: FAIL — `createSupabaseServer` not found, `proxy` is not async.

- [ ] **Step 3: Create lib/supabase-server.ts**

```typescript
// lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createSupabaseServer(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}
```

- [ ] **Step 4: Update proxy.ts — make async, add espace block**

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes — cookie-based auth (unchanged)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
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

  // Espace routes — Supabase session auth
  if (pathname.startsWith('/espace')) {
    if (pathname === '/espace/connexion') {
      return NextResponse.next()
    }

    const { supabase, response } = createSupabaseServer(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/espace/connexion', request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/espace/:path*'],
}
```

- [ ] **Step 5: Run all tests — expect PASS**

```bash
npm test -- --no-coverage
```

Expected: all existing admin tests still pass, new espace proxy tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase-server.ts proxy.ts __tests__/espace/proxy-espace.test.ts
git commit -m "feat: add Supabase server client and espace route protection in proxy"
```

---

## Task 4: Update ParcoursNav button

**Files:**
- Modify: `components/ParcoursNav.tsx`

- [ ] **Step 1: Replace the Calendly anchor with a Next.js Link**

In `components/ParcoursNav.tsx`, replace lines 41–49:

```tsx
// Before (remove this):
<a
  href="https://calendly.com/louiseh217/30min"
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
>
  Réserver un créneau
</a>

// After (add this):
<Link
  href="/espace"
  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
>
  Accéder à ton espace
</Link>
```

The `Link` import is already at the top of the file.

- [ ] **Step 2: Run tests**

```bash
npm test -- --no-coverage
```

Expected: all tests pass (ParcoursNav has no dedicated test but existing tests must still pass).

- [ ] **Step 3: Commit**

```bash
git add components/ParcoursNav.tsx
git commit -m "feat: replace Calendly button with espace link in nav"
```

---

## Task 5: Connexion page (login + signup)

**Files:**
- Create: `app/espace/connexion/page.tsx`
- Create: `__tests__/espace/ConnexionPage.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/espace/ConnexionPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ConnexionPage from '@/app/espace/connexion/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      signUp: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}))

describe('ConnexionPage', () => {
  it('renders connexion tab by default with email and password fields', () => {
    render(<ConnexionPage />)
    expect(screen.getByText('Connexion')).toBeTruthy()
    expect(screen.getByPlaceholderText('ton@email.com')).toBeTruthy()
    expect(screen.queryByText('Confirmer le mot de passe')).toBeNull()
  })

  it('shows confirm password field on inscription tab', () => {
    render(<ConnexionPage />)
    fireEvent.click(screen.getByText('Créer un compte'))
    expect(screen.getByText('Confirmer le mot de passe')).toBeTruthy()
  })

  it('shows error when passwords do not match on inscription', async () => {
    render(<ConnexionPage />)
    fireEvent.click(screen.getByText('Créer un compte'))
    fireEvent.change(screen.getByPlaceholderText('ton@email.com'), {
      target: { value: 'test@test.com' },
    })
    const passwordFields = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(passwordFields[0], { target: { value: 'password1' } })
    fireEvent.change(passwordFields[1], { target: { value: 'password2' } })
    fireEvent.submit(screen.getByRole('form'))
    expect(await screen.findByText('Les mots de passe ne correspondent pas.')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern="ConnexionPage" --no-coverage
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create app/espace/connexion/page.tsx**

```tsx
// app/espace/connexion/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Tab = 'connexion' | 'inscription'

export default function ConnexionPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()

    if (tab === 'inscription') {
      if (password !== confirm) {
        setError('Les mots de passe ne correspondent pas.')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(
          error.message === 'User already registered'
            ? 'Un compte existe déjà avec cet email.'
            : error.message
        )
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou mot de passe incorrect.')
        setLoading(false)
        return
      }
    }

    router.push('/espace')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
      <header className="px-8 py-5 bg-white border-b border-gray-100">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900">
          Trem<span className="text-indigo-500">plin</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1">
            {(['connexion', 'inscription'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'connexion' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <form role="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="ton@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="••••••••"
              />
            </div>

            {tab === 'inscription' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {loading
                ? '...'
                : tab === 'connexion'
                ? 'Se connecter'
                : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern="ConnexionPage" --no-coverage
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/espace/connexion/page.tsx __tests__/espace/ConnexionPage.test.tsx
git commit -m "feat: add /espace/connexion login and signup page"
```

---

## Task 6: EspaceLogout component

**Files:**
- Create: `components/espace/EspaceLogout.tsx`
- Create: `__tests__/espace/EspaceLogout.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/espace/EspaceLogout.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EspaceLogout from '@/components/espace/EspaceLogout'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockSignOut = jest.fn().mockResolvedValue({})

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: { signOut: mockSignOut },
  }),
}))

describe('EspaceLogout', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSignOut.mockClear()
  })

  it('renders the logout button', () => {
    render(<EspaceLogout />)
    expect(screen.getByText('Se déconnecter')).toBeTruthy()
  })

  it('calls signOut and redirects to / on click', async () => {
    render(<EspaceLogout />)
    fireEvent.click(screen.getByText('Se déconnecter'))
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern="EspaceLogout" --no-coverage
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create components/espace/EspaceLogout.tsx**

```tsx
// components/espace/EspaceLogout.tsx
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern="EspaceLogout" --no-coverage
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/espace/EspaceLogout.tsx __tests__/espace/EspaceLogout.test.tsx
git commit -m "feat: add EspaceLogout client component"
```

---

## Task 7: Espace layout

**Files:**
- Create: `app/espace/layout.tsx`

> Note: Next.js server components cannot be rendered in Jest without additional setup. This layout is verified by manual testing in Task 9.

- [ ] **Step 1: Create app/espace/layout.tsx**

```tsx
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
          Trem<span className="text-indigo-500">plin</span>
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
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/espace/layout.tsx
git commit -m "feat: add espace layout with sidebar and header"
```

---

## Task 8: Espace dashboard page

**Files:**
- Create: `app/espace/page.tsx`
- Create: `__tests__/espace/EspacePage.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/espace/EspacePage.test.tsx
import { render, screen } from '@testing-library/react'
import EspacePage from '@/app/espace/page'

jest.mock('@/lib/supabase-browser', () => ({
  createSupabaseBrowser: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { email: 'sophie@example.com' } },
      }),
    },
  }),
}))

describe('EspacePage', () => {
  it('renders the four placeholder section cards', () => {
    render(<EspacePage />)
    expect(screen.getByText('Documents')).toBeTruthy()
    expect(screen.getByText('Corrections')).toBeTruthy()
    expect(screen.getByText('Notes de session')).toBeTruthy()
    expect(screen.getByText('Chat')).toBeTruthy()
  })

  it('renders À venir badges on each card', () => {
    render(<EspacePage />)
    const badges = screen.getAllByText('À venir')
    expect(badges).toHaveLength(4)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern="EspacePage" --no-coverage
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create app/espace/page.tsx**

```tsx
// app/espace/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const sections = [
  {
    label: 'Documents',
    icon: '📄',
    description: 'Les fichiers partagés par Louise.',
  },
  {
    label: 'Corrections',
    icon: '✏️',
    description: 'Les corrections de tes documents.',
  },
  {
    label: 'Notes de session',
    icon: '📝',
    description: 'Le compte-rendu de tes séances.',
  },
  {
    label: 'Chat',
    icon: '💬',
    description: 'Échange directement avec Louise.',
  },
]

export default function EspacePage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  const firstName = email ? email.split('@')[0] : ''

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
        Bonjour{firstName ? ` ${firstName}` : ''} 👋
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Bienvenue dans ton espace Tremplin.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {sections.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h2 className="font-bold text-gray-900 mb-1">{s.label}</h2>
            <p className="text-xs text-gray-500 mb-4">{s.description}</p>
            <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">
              À venir
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern="EspacePage" --no-coverage
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/espace/page.tsx __tests__/espace/EspacePage.test.tsx
git commit -m "feat: add espace dashboard home page with placeholder sections"
```

---

## Task 9: Full test run + deploy

- [ ] **Step 1: Run all tests**

```bash
npm test -- --no-coverage
```

Expected: all tests pass (previously 41 + new ~9 = ~50 total).

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Disable email confirmation in Supabase**

Go to: **supabase.com → project rmffadshdcozpgbsyerm → Authentication → Providers → Email**
Uncheck **"Confirm email"** → Save.

This is required for immediate access after signup.

- [ ] **Step 4: Push and deploy**

```bash
git push origin main
vercel --prod --yes
```

Expected: deployment `● Ready`, all routes including `/espace/connexion` and `/espace` listed.

- [ ] **Step 5: Smoke test in browser**

1. Go to `https://presentation-navy-seven.vercel.app` — check button says "Accéder à ton espace"
2. Click button — should land on `/espace/connexion`
3. Create an account with a real email
4. Should redirect to `/espace` and show welcome + 4 placeholder cards
5. Click "Se déconnecter" — should return to `/`
6. Navigate directly to `/espace` — should redirect to `/espace/connexion`
