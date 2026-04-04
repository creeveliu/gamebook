# Library Sort Options Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users manually choose stable Steam-backed library sorting modes and default the home page to recent two-week playtime.

**Architecture:** Extend the shared library sort enum and comparator to support two-week playtime, total playtime, and recent notes. Thread the selected sort through the home page and library API via query params, and expand the existing filter UI into platform + sort controls.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest

---

### Task 1: Add failing sort tests

**Files:**
- Modify: `src/lib/domain/library.test.ts`

**Step 1: Write the failing test**

Add tests covering:
- sorting by `playtimeLastTwoWeeksMinutes` descending
- sorting by `playtimeForeverMinutes` descending
- tie-breaking with note date and sync date when needed

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/domain/library.test.ts`

**Step 3: Write minimal implementation**

Update the sort enum and comparator to satisfy the new test cases.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/domain/library.test.ts`

**Step 5: Commit**

```bash
git add src/lib/domain/library.test.ts src/lib/domain/library.ts
git commit -m "feat: add stable library sort modes"
```

### Task 2: Thread sort through page and API

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/api/library/route.ts`
- Modify: `src/lib/library-service.ts`

**Step 1: Write the failing test**

Reuse domain tests for backend sort behavior; URL parsing is simple glue code.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/domain/library.test.ts`

**Step 3: Write minimal implementation**

Read `sort` from search params and API query params, validate it, and default to `two-week-playtime`.

**Step 4: Run test to verify it passes**

Run: `npm test`

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/api/library/route.ts src/lib/library-service.ts
git commit -m "feat: wire library sort selection"
```

### Task 3: Add manual sort controls

**Files:**
- Modify: `src/components/library-filters.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Write the failing test**

Keep scope small and verify via integration test run after implementation.

**Step 2: Run test to verify it fails**

Skip isolated red step for this UI glue and rely on full-suite verification.

**Step 3: Write minimal implementation**

Add a second dropdown for sort, preserve both query params when either control changes, and render the controls on the home page for logged-in users.

**Step 4: Run test to verify it passes**

Run: `npm test`

**Step 5: Commit**

```bash
git add src/components/library-filters.tsx src/app/page.tsx
git commit -m "feat: add manual library sort controls"
```
