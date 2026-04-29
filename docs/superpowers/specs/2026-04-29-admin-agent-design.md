# Admin AI Agent — Design Spec

**Date:** 2026-04-29  
**Status:** Approved

---

## Goal

Build a password-protected admin space accessible only to Louise, with two features: an AI agent that rewrites student CVs and lettres de motivation according to her rules, and a rules editor to manage those rules.

## Architecture

### Routes

| Route | Description |
|---|---|
| `/admin/login` | Password form. On success, sets a session cookie and redirects to `/admin/agent`. |
| `/admin/agent` | AI agent interface — paste text or upload PDF, run improvement, view result. |
| `/admin/regles` | Rules editor — list, edit, add, delete rules. |

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/admin/login` | POST | Receives `{ password: string }`, compares to `ADMIN_PASSWORD`, sets session cookie, returns 200 or 401. |
| `/api/admin/improve` | POST | Receives `{ text: string }`, fetches rules from Supabase, calls Claude API, returns `{ rewritten: string, changes: string[] }`. |
| `/api/admin/rules` | GET | Returns all rules ordered by `order` field. |
| `/api/admin/rules` | POST | Creates a new rule. Body: `{ text: string }`. |
| `/api/admin/rules/[id]` | PATCH | Updates rule text. Body: `{ text: string }`. |
| `/api/admin/rules/[id]` | DELETE | Deletes a rule. |

### Middleware

`middleware.ts` intercepts all `/admin/*` requests (except `/admin/login`). Checks for a `admin_session` cookie. If absent or invalid, redirects to `/admin/login`. The session value is compared against `ADMIN_SESSION_TOKEN` env var (a static secret set at deploy time).

---

## Data

### Supabase table: `rules`

```sql
create table rules (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  "order" integer not null default 0,
  created_at timestamptz default now()
);
```

Rules are fetched ordered by `order ASC, created_at ASC`. New rules append at the end.

---

## UI

### Shared: AdminLayout + AdminSidebar

Dark sidebar (bg `#111827`, width 180px):
- Logo: "Trem**plin**" (plin in indigo)
- Nav items: "Agent IA" → `/admin/agent`, "Mes règles" → `/admin/regles`. Active item: white text + indigo left border + dark background.
- Footer: "Louise Heraud / Admin"

Main area: light gray background (`#f7f8fc`), padding 20px. Topbar with page title left + badge right.

### `/admin/login`

Centered card on gray background. Logo, subtitle "Espace administration", password input, "Accéder →" button. On submit: POST to `/api/admin/login`, receives session cookie, redirects to `/admin/agent`.

Add `/api/admin/login` route: POST, compares password to `ADMIN_PASSWORD` env var, sets `admin_session` cookie with value = `ADMIN_SESSION_TOKEN`, returns 200.

### `/admin/agent`

Topbar: "Agent IA — Amélioration de documents" + badge "Claude Sonnet".

Toggle row: "Coller du texte" / "Uploader un PDF" (toggles visible panel).

Two-column layout:
- Left panel "Document original": textarea (text mode) or file dropzone (PDF mode) + "Améliorer →" button. Button disabled while loading.
- Right panel "Résultat": empty state when no result. After run: rewritten text at top, horizontal divider, "Changements" section with colored badge + description per change item.

PDF mode: extract text client-side using `pdfjs-dist` before sending to API. Show filename + page count after upload.

### `/admin/regles`

Topbar: "Mes règles d'amélioration" + badge "Appliquées à chaque document".

Numbered list of rules. Each rule row:
- Number badge (indigo circle)
- Rule text (editable inline on click)
- ✏️ button (enters edit mode for that row)
- 🗑️ button (deletes with confirmation)

Inline editing: clicking ✏️ replaces text with an input + "Sauvegarder" / "Annuler" buttons. Saves via PATCH.

"+ Ajouter une règle" at bottom: text input + "Ajouter" button. Saves via POST, appends to list.

---

## Claude Integration

System prompt structure:
```
Tu es un assistant spécialisé dans l'amélioration de CVs et lettres de motivation pour les candidatures aux grandes écoles françaises.

Voici les règles à appliquer impérativement :
{rules.map((r, i) => `${i+1}. ${r.text}`).join('\n')}

Réponds en JSON avec ce format exact :
{
  "rewritten": "le document réécrit complet",
  "changes": ["description du changement 1", "description du changement 2", ...]
}
```

Model: `claude-sonnet-4-6`. Max tokens: 4096.

---

## Environment Variables

| Variable | Description |
|---|---|
| `ADMIN_PASSWORD` | Password shown on login page |
| `ADMIN_SESSION_TOKEN` | Secret stored in session cookie |
| `ANTHROPIC_API_KEY` | Claude API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |

---

## File Structure

```
app/
  admin/
    login/
      page.tsx              — Login page
    agent/
      page.tsx              — AI agent interface
    regles/
      page.tsx              — Rules editor
  api/
    admin/
      login/
        route.ts            — POST: set session cookie
      improve/
        route.ts            — POST: call Claude with rules
      rules/
        route.ts            — GET, POST rules
        [id]/
          route.ts          — PATCH, DELETE rule
components/
  admin/
    AdminLayout.tsx         — Sidebar + main wrapper
    AdminSidebar.tsx        — Dark sidebar nav
lib/
  supabase.ts               — Supabase client (server-side, service role)
middleware.ts               — Protect /admin/* routes
```

---

## Security Notes

- Session cookie: `httpOnly: true, secure: true, sameSite: 'strict'`, max age 7 days.
- All `/api/admin/*` routes (except `/api/admin/login`) also verify the session cookie server-side.
- `SUPABASE_SERVICE_ROLE_KEY` is never sent to the client.
- PDF text extraction happens client-side; raw file bytes never hit the server.
