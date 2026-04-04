# Gamebook Auth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single demo user flow with real Google sign-in, session-backed user scoping, and logged-out empty states without exposing private library data.

**Architecture:** Add `Auth.js` on top of the existing Prisma-backed `User` model, extend the schema with standard auth tables, and route all library/account/note access through the current-user session. Keep the current service and adapter layering intact; only change how the current user is resolved and how logged-out states are handled.

**Tech Stack:** Next.js 16 App Router, Auth.js, Prisma, PostgreSQL, React 19, TypeScript, Vitest

---

### Task 1: Add Auth.js and Prisma auth schema

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/package.json`
- Modify: `/Users/cl/Projects/Gamebook/prisma/schema.prisma`
- Create: `/Users/cl/Projects/Gamebook/prisma/migrations/<timestamp>_add_auth_tables/`
- Create: `/Users/cl/Projects/Gamebook/src/lib/auth.ts`
- Create: `/Users/cl/Projects/Gamebook/src/app/api/auth/[...nextauth]/route.ts`

**Step 1: Write the failing schema/auth shape test or validation check**

- Add a small auth config test file, or a Prisma schema smoke assertion if the repo already prefers that.
- Cover:
  - `User` can relate to `Account` and `Session`
  - auth helper exports a server-side session reader

**Step 2: Run the focused test**

Run: `npm test`
Expected: FAIL because auth modules and/or schema relations do not exist yet.

**Step 3: Implement the minimal schema and auth config**

- Add dependencies:
  - `next-auth`
  - `@auth/prisma-adapter`
- Extend `User` with auth relations.
- Add `Account`, `Session`, and `VerificationToken` models in Prisma.
- Create `src/lib/auth.ts` with:
  - Auth.js config
  - Google provider
  - Prisma adapter
  - exported `auth`, `signIn`, `signOut` helpers if supported by the installed Auth.js version
- Create the auth route handler under `src/app/api/auth/[...nextauth]/route.ts`.

**Step 4: Generate and verify Prisma artifacts**

Run:
- `npm run prisma:generate`
- `npx prisma migrate dev --name add_auth_tables`

Expected:
- Prisma client regenerates
- migration directory is created cleanly

**Step 5: Run tests again**

Run: `npm test`
Expected: PASS for the new auth shape check and existing tests.

**Step 6: Commit**

```bash
git add package.json package-lock.json prisma/schema.prisma prisma/migrations src/lib/auth.ts src/app/api/auth/[...nextauth]/route.ts
git commit -m "feat: add auth infrastructure"
```

### Task 2: Replace demo-user with session-backed current user

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/demo-user.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/lib/library-service.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/auth-guards.ts`

**Step 1: Write the failing service tests**

- Add or extend service/API-adjacent tests to cover:
  - logged-out current user returns `null`
  - protected mutations reject when no session exists
  - logged-in user resolution maps to the matching Prisma `User`

**Step 2: Run the focused test**

Run: `npm test`
Expected: FAIL because services still upsert and use the fixed demo user.

**Step 3: Implement current-user resolution**

- Replace the demo helper with session-backed logic.
- Add a guard helper for:
  - `getOptionalCurrentUser()`
  - `requireCurrentUser()`
- Update `library-service` so:
  - read flows can tolerate logged-out state where needed
  - connect/sync/note mutations require an authenticated user

**Step 4: Run tests**

Run: `npm test`
Expected: PASS for the new auth guard behavior.

**Step 5: Commit**

```bash
git add src/lib/demo-user.ts src/lib/auth-guards.ts src/lib/library-service.ts
git commit -m "refactor: resolve current user from auth session"
```

### Task 3: Protect API routes with auth-aware behavior

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/library/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/library/[userGameId]/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/library/[userGameId]/notes/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/notes/[noteId]/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/connected-accounts/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/connected-accounts/[platform]/connect/route.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/api/connected-accounts/[platform]/sync/route.ts`

**Step 1: Write failing API tests**

- Add tests for:
  - unauthenticated `POST /notes` -> `401`
  - unauthenticated `POST /connect` -> `401`
  - unauthenticated `POST /sync` -> `401`
  - unauthenticated library read follows the chosen empty-state behavior

**Step 2: Run the focused test**

Run: `npm test`
Expected: FAIL because routes currently call service methods directly without auth-aware handling.

**Step 3: Implement minimal route guards**

- Return `401` for unauthenticated write routes.
- Return safe empty results or explicit auth errors for read routes as designed.
- Keep existing platform validation and error serialization.

**Step 4: Run tests**

Run: `npm test`
Expected: PASS for the new API auth cases.

**Step 5: Commit**

```bash
git add src/app/api/library/route.ts src/app/api/library/[userGameId]/route.ts src/app/api/library/[userGameId]/notes/route.ts src/app/api/notes/[noteId]/route.ts src/app/api/connected-accounts/route.ts src/app/api/connected-accounts/[platform]/connect/route.ts src/app/api/connected-accounts/[platform]/sync/route.ts
git commit -m "feat: enforce auth on private api routes"
```

### Task 4: Add logged-out UI states and login entry points

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/app/page.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/app/settings/page.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/app/library/[userGameId]/page.tsx`
- Create: `/Users/cl/Projects/Gamebook/src/components/auth-button.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/components/app-shell-header.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/components/library-grid.tsx`

**Step 1: Write the failing page/component tests**

- Cover:
  - home renders login CTA and empty-state copy when logged out
  - settings renders login prompt when logged out
  - library detail redirects or blocks when logged out

**Step 2: Run the focused test**

Run: `npm test`
Expected: FAIL because pages assume a current user and always fetch private data.

**Step 3: Implement minimal UI changes**

- Add a reusable login/logout button component.
- Home:
  - keep public shell
  - only render library grid with real items for authenticated users
  - show empty-state prompt otherwise
- Settings:
  - show sign-in prompt when logged out
- Detail:
  - enforce login before showing private content

**Step 4: Run tests**

Run: `npm test`
Expected: PASS for the logged-out rendering behavior.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/settings/page.tsx src/app/library/[userGameId]/page.tsx src/components/auth-button.tsx src/components/app-shell-header.tsx src/components/library-grid.tsx
git commit -m "feat: add logged-out states for auth"
```

### Task 5: Add user-isolation coverage

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/domain/library.test.ts`
- Create: `/Users/cl/Projects/Gamebook/src/app/api/library/library-auth.test.ts`
- Create: `/Users/cl/Projects/Gamebook/src/app/api/notes/notes-auth.test.ts`
- Create: `/Users/cl/Projects/Gamebook/src/test/auth-test-helpers.ts`

**Step 1: Write the isolation tests**

- Cover:
  - user A cannot read user B library item
  - user A cannot update/delete user B note
  - logged-in user only receives their own connected accounts

**Step 2: Run the focused test**

Run: `npm test`
Expected: FAIL until the route/service boundary fully scopes data to session user.

**Step 3: Implement any missing gaps**

- Add test helpers for fake sessions or mocked `auth()`.
- Tighten any remaining service or route conditions exposed by the tests.

**Step 4: Run tests**

Run: `npm test`
Expected: PASS with stable coverage of auth boundaries.

**Step 5: Commit**

```bash
git add src/lib/domain/library.test.ts src/app/api/library/library-auth.test.ts src/app/api/notes/notes-auth.test.ts src/test/auth-test-helpers.ts
git commit -m "test: cover auth isolation"
```

### Task 6: Update docs and verify the full change

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/README.md`
- Modify: `/Users/cl/Projects/Gamebook/.env.example` (if present; otherwise create it)

**Step 1: Write the failing documentation checklist**

- Confirm README still claims demo-user behavior and lacks auth setup steps.

**Step 2: Update docs**

- Document:
  - Google auth setup
  - required env vars
  - logged-out home behavior
  - private library/user isolation behavior

**Step 3: Run verification**

Run:
- `npm test`
- `npm run lint`
- `npm run build`

Expected:
- all pass

**Step 4: Commit**

```bash
git add README.md .env.example
git commit -m "docs: document auth setup and user isolation"
```
