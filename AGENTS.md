# AGENTS.md — AI Agent Change Log

This file documents all significant changes made by AI agents (Antigravity / Gemini) to this codebase.
Each section corresponds to a session or commit group.

---

## Session 1 — Auth, Mobile UX & Guest Progress

**Commits:** `3a373d1` → `4c9097f` → `d23fc99` → `0e4dba6`

### Changes Made

#### `client/src/components/AuthModal.tsx` *(created)*
- Full auth modal with Login / Register / Reset Password tabs
- Password visibility toggle (eye icon)
- Confirm password field with live match indicator (green/red border)
- "Forgot password?" link that switches to reset mode
- "Transfer guest progress" checkbox on register (copies SM-2 flashcard data + lesson progress)
- Error banners: rose for general errors, amber for "user not found" with a "Create account" prompt

#### `client/src/` (multiple components)
- Added Sign In button to mobile header and dashboard banner (always visible)
- Fixed mobile App Shell layout using flex column to eliminate overscroll blank space

#### `server/auth.js` *(created)*
- `authMiddleware`: async Express middleware — validates HMAC-based JWT tokens from `Authorization: Bearer` header
- Custom JWT implementation using Node.js `crypto` (scrypt password hashing, HMAC-SHA256 token signing)
- No external JWT library dependency

#### `server/app.js` — Auth Routes Added
- `POST /api/auth/register` — hashes password with scrypt, stores user, optionally migrates guest progress
- `POST /api/auth/login` — validates credentials, returns signed token + user object
- `POST /api/auth/reset-password` — verifies username + optional email, updates password hash
- `POST /api/auth/logout` — stateless confirmation response

---

## Session 2 — API Intercept, Error Handling & Proxy Fixes

**Commits:** `d1c05ee` → `13e4981`

### Changes Made

#### `client/src/services/apiInterceptor.ts` *(created)*
- Wraps all `/api/` fetch calls globally
- Peeks at `Content-Type` header — if response is HTML (e.g. a 404 page from SPA routing), treats it as a backend failure and falls back to local store
- Falls back to `handleLocalApi()` on status codes: `404`, `405`, `500`, or non-JSON body
- **Does NOT fall back on `409` (Conflict)** — lets server-side "username taken" error reach the frontend correctly
- Prevents the `SyntaxError: Unexpected token '<'` console error from JSON-parsing HTML error pages

#### `server/app.js`
- Added Express 404 catch-all at the bottom: returns `{ error: 'Not Found' }` JSON instead of HTML
- This prevents Vite's `index.html` being returned for unknown API routes on local dev

---

## Session 3 — Cross-Device Sync, QR Code & Render Config

**Commit:** `3153dbd`

### Changes Made

#### `client/src/` (sync components)
- Added QR code generation for cross-device sync link
- Added "Copy Link" button for sharing session/progress sync URL
- Render.com deployment configuration added (`render.yaml` or equivalent)

---

## Session 4 — Turso Cloud DB, Vercel Serverless & Auto-Seeding

**Commits:** `c9749c3` → `b6dc183`

### Changes Made

#### `server/db.js` *(full rewrite)*
- Replaced `node:sqlite` (`DatabaseSync` — sync, local-only) with `@libsql/client` (async, supports remote Turso)
- When `TURSO_DATABASE_URL` env var is set → connects to Turso cloud database
- When not set → falls back to local SQLite file (`file:./gate_study.db`)
- Exports async wrapper `db` object with `.prepare(sql).all(args)` / `.get(args)` / `.run(args)` methods
- Exports `initSchema()` — idempotent schema creation (all `CREATE TABLE IF NOT EXISTS`)
- Exports `SCHEMA_SQL` string for schema inspection

#### `server/app.js` *(created — was previously inline in index.js)*
- Extracted all routes into a pure Express `app` (no `app.listen()`)
- Added `ensureDbInitialized()` middleware — Promise-cached, idempotent, runs schema + seed once per cold start
- All route handlers are `async`/`await` using `db.prepare(...).get/all/run()`
- Added `GET /api` and `GET /api/health` status endpoints (returns `{ status: 'ok', tursoConnected: true/false }`)

#### `server/index.js` *(simplified)*
- Now only: imports `app`, serves `client/dist` static files, calls `ensureDbInitialized()`, starts `app.listen(3001)`

#### `api/index.js` *(created — Vercel serverless entrypoint)*
- Vercel rewrites `/api/(.*)` → `/api` (single serverless function)
- Reads `req.headers['x-matched-path']` to recover the original path (e.g. `/api/auth/login`)
- Normalizes `req.url` so Express routing works correctly inside a serverless function
- Delegates to the shared `app` from `server/app.js`

#### `vercel.json` *(updated)*
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/api",      "destination": "/api" },
    { "source": "/(.*)",     "destination": "/index.html" }
  ]
}
```

#### `server/seed.js` *(updated)*
- Made `seedDatabase()` async, uses `db.batch()` for atomic inserts
- No longer auto-executes on `require()` — called explicitly by `ensureDbInitialized()`
- Calls `seedAllLessons()` after seeding subjects/topics

#### `server/seed_all_lessons.js` *(updated)*
- Replaced top-level sync execution with `seedAllLessons()` async export
- Uses `db.batch()` for bulk lesson insert

#### `server/backup.js` *(updated)*
- All import/export functions made async
- Uses `db.batch()` for atomic multi-table imports

#### `server/auth.js` *(updated)*
- `authMiddleware` made `async` to support `await db.prepare(...).get()`

#### `scripts/push_to_turso.js` *(created)*
- CLI script to bulk-sync local SQLite data to Turso (subjects, topics, lessons, users)
- Run with `npm run turso:push`

#### `client/vite.config.ts`
- Added `build: { sourcemap: true }` to generate `.map` files for production debugging

#### `package.json`
- Added `"turso:push": "node scripts/push_to_turso.js"` script

---

## Session 5 — Performance: Parallelized Queries, Username Availability Check & DB Indexes

**Commit:** `6c8f1c5`

### Changes Made

#### `server/app.js`

**`GET /api/overview` — Parallelized**
- Was: 9 sequential `await db.prepare(...).get/all()` calls (each = 1 HTTPS round-trip to Turso → ~3.2s total)
- Now: All 9 queries fire simultaneously with `Promise.all([...])` → expected ~0.8–1s total (3–5× speedup)

**`GET /api/auth/check-username` — New endpoint**
```
GET /api/auth/check-username?username=<value>
Response: { available: true|false, exists: true|false }
```
- Case-insensitive lookup: `WHERE LOWER(username) = LOWER(?)`
- Returns `available: false, reason: 'too_short'` if username < 3 chars
- Used by frontend for real-time availability checking before form submit

#### `server/db.js` — New DB Indexes
Added 5 indexes to `SCHEMA_SQL` (created on first cold start / schema init):
```sql
CREATE INDEX IF NOT EXISTS idx_users_username       ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_lower_username ON users(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_ulp_user             ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ulp_user_status      ON user_lesson_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_lessons_topic        ON lessons(topic_id);
```

#### `client/src/components/AuthModal.tsx`

**Debounced username availability check (register mode only)**
- 400ms debounce on username input changes
- Calls `GET /api/auth/check-username?username=<value>` when `username.trim().length >= 3`
- Shows inline spinner while checking
- Shows green ✓ + "Username is available!" when `available: true`
- Shows red ✗ + "Username already taken. Try another." when `available: false`
- Input border turns green/red to match availability state
- Submit button is **disabled** when `usernameAvailable === false`

**React hooks added:** `useEffect`, `useRef` (for debounce timer cleanup)

---

## Architecture Overview

```
client/dist/          ← Vite production build (served as static by Vercel CDN)
api/index.js          ← Vercel serverless function (single handler for all /api/* routes)
server/
  app.js              ← Express app with all routes (shared by local dev + Vercel)
  index.js            ← Local dev server (serves static + starts app.listen)
  db.js               ← @libsql/client wrapper (Turso remote or local SQLite fallback)
  auth.js             ← HMAC-JWT middleware + scrypt password hashing
  seed.js             ← Subjects, topics, inline lessons seed (called once at startup)
  seed_all_lessons.js ← 33 detailed lesson objects (called by seed.js)
  backup.js           ← Import/export backup utilities
scripts/
  push_to_turso.js    ← Bulk sync local SQLite → Turso cloud
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TURSO_DATABASE_URL` | Production only | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Production only | Turso auth token |

When neither is set, the server uses a local `gate_study.db` SQLite file automatically.

---

## Test Suite

Run with server on port 3001:
```bash
node server/index.js &
node test_suite.js
```
**62 tests, all passing** as of commit `6c8f1c5`.
