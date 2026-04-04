<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Gamebook Project Notes

## Product Shape

- Home page only shows the user's library.
- Authorization and platform connection live in `/settings`.
- Notes are private and attached to individual games.
- Home page keeps a lightweight manual sync button.

## Platform Support

- `Steam`: real auth + real sync is implemented.
- `PlayStation`: not implemented; do not reintroduce mock sync or mock persisted data.
- `Xbox` / `Switch`: reserved in types only.

## Steam Constraints

- Sync is based on Steam Web API plus OpenID.
- Owned games are not the same as a complete history of everything the user played.
- Family sharing / borrowed games may be missing.
- Prefer `rtime_last_played` for recent-play ordering.
- `GetRecentlyPlayedGames` is supplemental only and may return empty.

## Stack

- `Next.js 16 App Router`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Prisma + PostgreSQL`
- `Vitest`

## Important Files

- `src/app/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/library/[userGameId]/page.tsx`
- `src/lib/library-service.ts`
- `src/lib/platforms/steam.ts`
- `src/lib/platforms/adapters.ts`
- `prisma/schema.prisma`

## Working Rules

- Do not add account controls back onto the home page.
- Do not restore PlayStation mock data.
- Keep platform integrations behind the adapter layer.
- Update `README.md` whenever product capability changes materially.
