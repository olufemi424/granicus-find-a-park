# Design: Tech stack

**Phase:** 4 Design  
**Status:** scaffolded; stories 0–2 implemented  
**Clock:** implementation started

## Decision

TanStack Start (React), created with the TanStack CLI. TypeScript everywhere. No Next.js APIs.

```bash
npx @tanstack/cli@latest create
```

CLI add-ons when prompted: **Tailwind CSS** (layout/a11y speed) and **ESLint**. Prefer the default Vite path unless the CLI defaults to Rsbuild.

Official docs: [Start overview](https://tanstack.com/start/latest), [CLI quick start](https://tanstack.com/start/latest/docs/framework/react/quick-start), [routing](https://tanstack.com/start/latest/docs/framework/react/guide/routing), [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions).

## Why this stack for this take-home

| Criterion | Fit |
|---|---|
| Two-hour local run | CLI scaffold, then product code |
| Typed URLs | Selected park as a search param, not ad-hoc React state |
| No required backend | Static JSON via a server function + route loader |
| Interviewer can run it | `npm install && npm run dev`; no cloud account |
| Explainable in 30 min | Router + loader + one server function is a clean walkthrough |

Rejected for this exercise:

- Next.js — forbidden by this stack choice; also heavier than needed
- SPA-only Vite + React Router — weaker type-safe URL story
- Mapbox / Google Maps — API keys in a take-home are a footgun

## Locked choices

| Layer | Choice |
|---|---|
| Framework | TanStack Start (React), SSR + hydration |
| Router | TanStack Router, file-based, `src/routes/` |
| Data load | Route `loader` calls `createServerFn()` |
| Client cache | Not required for static parks. TanStack Query only if a later optional feature needs it |
| UI | React + Tailwind |
| Map | Leaflet + OpenStreetMap tiles (no key). Render map **client-only** because Leaflet needs `window` |
| Language | TypeScript, strict |

## Hard rules (do not violate in generated code)

1. Routes live in `src/routes/` and export `createFileRoute('/path')` (root uses `createRootRoute`).
2. Never `page.tsx`, never React Router, never Next.js `'use server'` / server actions / `fetch` cache.
3. Mutations and server-only reads use `createServerFn()` from `@tanstack/react-start`.
4. Page data uses the route `loader`. Components read it with `Route.useLoaderData()`.
5. Path params and search params stay schema-typed (`validateSearch`).
6. Server and client may share a module; do not dynamically import server functions.

## App architecture

One URL, three surfaces, one selected park.

```
/                    list + map + details
/?park=prospect-park same layout, Prospect Park selected
```

Search param (not a second route) keeps list/map/details in sync, is shareable, and stays keyboard-friendly. A `/parks/$parkId` route is optional later; skip it unless the index is already solid.

### Intended files (when implementation starts)

```
src/
  router.tsx
  routes/
    __root.tsx              document shell, title, skip link
    index.tsx               loader + layout: list | map | details
  functions/
    parks.functions.ts      createServerFn: read JSON, return typed parks
  lib/
    park.ts                 Park type, missing-field helpers (client-safe)
    parkSearch.ts           validateSearch schema for { park?: string }
  components/
    ParkList.tsx
    ParkDetails.tsx
    ParkMap.tsx             client-only map wrapper
  data/
    parks.sample.json       copied at implementation start
```

### Data flow

1. `getParks` server function reads `src/data/parks.sample.json` on the server.
2. Index route `loader` awaits `getParks()` and returns `{ parks }`.
3. Index component reads parks from the loader.
4. `validateSearch` types `park` as optional string (park id).
5. List click and map marker both `navigate({ search: { park: id } })`.
6. Details render the park whose `id` matches search, or a “select a park” empty state.

No geolocation. Map always has a default center/bounds from the park coordinates.

## Type-safe sketches (reference only — not source)

These are the patterns to follow. They are not the app.

### Park type — missing data is explicit

```ts
export type ParkLocation = {
  lat: number
  lng: number
  address?: string
}

export type Park = {
  id: string
  name: string
  description: string | null
  location: ParkLocation
  amenities: string[]
  hours: string
  images: string[]
  acreage: number
  rating: number | null
}
```

### Server function — not Next.js `'use server'`

```ts
import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Park } from '../lib/park'

export const getParks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Park[]> => {
    const file = join(process.cwd(), 'src/data/parks.sample.json')
    const raw = await readFile(file, 'utf8')
    return JSON.parse(raw) as Park[]
  },
)
```

### Index route — file route + loader + typed search

```ts
import { createFileRoute } from '@tanstack/react-router'
import { getParks } from '../functions/parks.functions'

type ParksSearch = {
  park?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): ParksSearch => ({
    park: typeof search.park === 'string' ? search.park : undefined,
  }),
  loader: async () => {
    const parks = await getParks()
    return { parks }
  },
  component: ParksPage,
})
```

### Selecting a park (list or map)

```ts
const navigate = Route.useNavigate()
const { park: selectedId } = Route.useSearch()
const { parks } = Route.useLoaderData()
const selected = parks.find((p) => p.id === selectedId)

navigate({
  to: '/',
  search: { park: nextId },
})
```

### Details — never invent fields

Render only what exists. Null description → “No description provided”. Missing address → omit or “Address not available”. Empty images → no gallery, no fake photos. Broken URLs → `onError` hide/replace, do not swap in a real park photo.

### Map — client-only boundary

Leaflet cannot SSR. Keep `ParkMap` behind a client-only import (or a component that mounts after `useEffect`). Keyboard users never need the map: list + details are the required path.

## What we will not pull in during the 2 hours

- TanStack Query unless something actually refetches
- Auth, DB, hosting adapters
- Search/filter UI
- Map API keys
- Extra routes beyond `/` and `__root`

## Interview talking points this stack gives you

- Why a typed search param beats `useState` for “which park is open”
- Why a loader + server function is enough and a backend is not
- Why the map is client-only in an SSR framework
- Why list/details exist even though there is a map (a11y + no geolocation)

## Next SDLC step

Implementation Story 0: start the 2-hour clock, run the CLI in this repo (or a `app/` subfolder if you want docs and app split), copy `parks.sample.json`, keep AI logs.
