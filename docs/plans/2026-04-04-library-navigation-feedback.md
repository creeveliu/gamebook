# Library Navigation Feedback Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add immediate visual feedback when a user opens a game detail page from the library.

**Architecture:** Keep the data flow unchanged. Split the clickable library card into a testable presentational component, make the grid a thin client wrapper that marks the clicked card as pending, and add an App Router `loading.tsx` skeleton for the detail route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest

---

### Task 1: Add failing presentation tests

**Files:**
- Create: `src/components/library-card.test.tsx`
- Modify: `src/components/library-card-meta.test.ts`

**Step 1: Write the failing test**

Add tests for a card that renders normal CTA text by default and a busy state when `isPending` is true.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/library-card.test.tsx`

**Step 3: Write minimal implementation**

Create the presentational card component and any tiny helper needed for the busy label.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/library-card.test.tsx src/components/library-card-meta.test.ts`

**Step 5: Commit**

```bash
git add docs/plans/2026-04-04-library-navigation-feedback.md src/components/library-card.test.tsx src/components/library-card.tsx src/components/library-card-meta.ts src/components/library-card-meta.test.ts
git commit -m "feat: add library navigation feedback states"
```

### Task 2: Wire pending state into the grid

**Files:**
- Modify: `src/components/library-grid.tsx`

**Step 1: Write the failing test**

Covered by Task 1 at the card layer to keep test scope small.

**Step 2: Run test to verify it fails**

Reuse the same test command from Task 1.

**Step 3: Write minimal implementation**

Track the clicked card ID in the client grid and pass `isPending` to the matching card.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/library-card.test.tsx src/components/library-card-meta.test.ts`

**Step 5: Commit**

```bash
git add src/components/library-grid.tsx
git commit -m "feat: show pending library card state"
```

### Task 3: Add route-level loading feedback

**Files:**
- Create: `src/app/library/[userGameId]/loading.tsx`

**Step 1: Write the failing test**

No route-level test currently exists; verify through targeted component tests plus app build/test run.

**Step 2: Run test to verify it fails**

Skip isolated red step here because App Router loading state is visual-only in this codebase.

**Step 3: Write minimal implementation**

Add a skeleton screen matching the detail page layout so the route shows feedback during server load.

**Step 4: Run test to verify it passes**

Run: `npm test`

**Step 5: Commit**

```bash
git add src/app/library/[userGameId]/loading.tsx
git commit -m "feat: add game detail loading skeleton"
```
