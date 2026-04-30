# Espace Étudiant — Auth + Shell Design

## Goal

Add a private student space to the Tremplin coaching site. Students register with email/password, get immediate access, and land on a private dashboard. Louise's existing admin area is unchanged.

## Scope (sub-project 1 of 4)

This spec covers only: auth (signup/login/logout) + the espace shell layout with empty placeholder sections. Documents, corrections, notes, and chat are built in later sub-projects.

## Stack

- **Auth:** Supabase Auth (email + password), session stored in HttpOnly cookies
- **New package:** `@supabase/ssr` — handles cookie-based session for Next.js
- **Existing:** `@supabase/supabase-js` v2, Next.js 16, Tailwind CSS v4, `proxy.ts` for route protection

## Supabase Clients

Two separate clients, never mixed:

| File | Function | Used in |
|---|---|---|
| `lib/supabase-browser.ts` | `createBrowserClient(url, anonKey)` | Client components (`'use client'`) |
| `lib/supabase-server.ts` | `createServerClient(url, anonKey, { cookies })` factory | `proxy.ts`, future API routes |

The existing `lib/supabase.ts` (service role key, admin use) is left untouched.

## Route Protection

`proxy.ts` is extended with a second matcher block:

**Existing (unchanged):**
- `/admin/:path*` and `/api/admin/:path*` — cookie `admin_session` check

**New:**
- Matcher: `/espace/:path*`
- Passthrough (no auth): `/espace/connexion`
- Protected: all other `/espace/*` paths — validate Supabase session via `createServerClient`; if no valid session → redirect to `/espace/connexion`

## Pages

### `/espace/connexion`

- `'use client'` page
- Two tabs: **"Connexion"** and **"Créer un compte"**
- Fields: email + password (+ confirm password on signup tab)
- On login success → `router.push('/espace')`
- On signup success → `router.push('/espace')` (immediate access, no email confirmation)
- Error messages displayed inline (wrong password, email already used, etc.)
- Light design matching the public site (white card, indigo accents)
- Link in header: "Tremplin" logo → `/`

### `/espace/layout.tsx`

Server component wrapping all `/espace/*` pages (except connexion handled by proxy redirect).

Layout structure:
- **Top header:** "Tremplin" logo (left) + student email + "Se déconnecter" button (right)
- **Body:** sidebar (left, 200px) + main content (right, flex-1)
- Sidebar nav links: Documents, Corrections, Notes de session, Chat
- Light background (`#f7f8fc`) consistent with public site

### `/espace/page.tsx`

- `'use client'` — reads user session to display email
- Welcome message: "Bonjour, [prénom ou email]"
- Four placeholder cards (one per section: Documents, Corrections, Notes, Chat) with "À venir" state
- Each card links to its future sub-section route (`/espace/documents`, etc.) — routes don't exist yet, cards are visual only

## Navigation Change

`components/ParcoursNav.tsx`: replace the Calendly "Réserver un créneau" button with:

```tsx
<Link href="/espace" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
  Accéder à ton espace
</Link>
```

## Supabase Configuration

Supabase Auth must have **email confirmation disabled** so students get immediate access after signup. This is set in the Supabase dashboard: Authentication → Providers → Email → uncheck "Confirm email".

The `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL` env vars are already set in `.env.local` and on Vercel (Production).

## Error Handling

- Wrong credentials → Supabase returns error, displayed inline
- Already registered email → display "Un compte existe déjà avec cet email"
- Session expired → proxy redirects to `/espace/connexion` automatically
- Logout → call `supabase.auth.signOut()`, redirect to `/`

## Out of Scope

- Password reset / forgot password flow (can be added later)
- OAuth providers (Google, etc.)
- Student profile editing
- Any content (documents, corrections, notes, chat) — those are sub-projects 2–4
