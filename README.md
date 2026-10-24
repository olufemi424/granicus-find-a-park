# Find a Park

Small resident-facing app for a fictional NYC-area municipality. Browse parks in a list, see them on a map, and open details. Location access is not used.

Granicus Lighthouse take-home. Built with TanStack Start.

## Run

Needs Node 22+ (or current LTS) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the next free port Vite prints).

```bash
npm run typecheck
npm run lint
npm run build
```

No API keys. No `.env`. OSM tiles need network.

## What works

- List of parks from `src/data/parks.sample.json`
- Park details: name, address, description, amenities, hours, size, rating, photos
- Missing/null/empty fields render as unavailable — nothing is invented
- Placeholder image URLs 404; photos fail closed
- Map with park locator pins (Leaflet + OpenStreetMap), no geolocation
- Search and amenity filters (typed URL: `q`, `amenity`) update the list and map
- Selecting a list row or a map pin shares one typed URL: `/?park=prospect-park`
- Keyboard: skip links, tab through the list, Enter/Space opens details, visible focus
- Phone: map-first. Search at the top; **Directory** opens the list; typing search opens the directory. Compact details sit on the map. Desktop: list left, details right, map behind.

Check these planted cases:

| Park | What to look for |
|---|---|
| [Old Mill](http://localhost:3000/?park=old-mill-botanical-garden) | null description → “No description provided” |
| [Cedar Hill](http://localhost:3000/?park=cedar-hill-nature-preserve) | null rating, empty images |
| [Highland Dog Park](http://localhost:3000/?park=highland-dog-park) | missing address |

## Left out

- “Near me” / current location
- Backend, accounts, hosted deploy
- Automated UI/a11y tests
- Replacing placeholder photos with real images

## Decisions

- **TanStack Start** for typed file routes, loaders, and `createServerFn`. No Next.js APIs.
- **Selected park in the URL** (`validateSearch`) so list, map, and details stay in sync without React-only state.
- **Leaflet + OSM** so the interviewer does not need a map key.
- **Map is client-only**; Leaflet needs `window`. List + details still work if the map fails to load.
- **Parse JSON defensively** in `src/lib/park.ts` instead of trusting the file shape.
- **Photos are shown only after `onLoad`** so 404s never flash a broken image and collapse the layout.

## Known issues

- Sample image URLs are placeholders; every photo is “No photos available”
- Map tiles fail without network; list and details still work
- The Leaflet map itself is not a full keyboard map widget; the required path is the list
- TanStack devtools appear in `npm run dev` only
- Work was done in SDL stages, not a single uninterrupted 2-hour sitting

## How it was checked

- `npm run typecheck`, `npm run lint`, `npm run build`
- Manual: no location prompt; keyboard list → details; narrow and wide viewports
- Manual: Old Mill, Cedar Hill, Highland missing-data cases
- Manual: list row and map locator both set `?park=`
- Manual: search and amenity filters update list + map; on phone, typing search opens Directory
- Manual: 404 images do not grow/shrink the details card
- Reviewed closely: `src/lib/park.ts` (null vs missing) and `ParkPhotos` (fail closed)

Still unsure: how well Leaflet markers behave with a screen reader; not tested on a physical phone, only a narrow viewport.

## Time

Planning (epic, stack, tasks) was separate from coding. Implementation of the app (scaffold through map, layout, locators, a11y, README) ran longer than the 2-hour cap because we followed SDL in stages instead of stopping at two hours. If this were the timed lab, stories 1–4 plus README would be the cut line; locators and extra layout polish would be listed as unfinished.

## Next steps before public use

1. Real park photos and a municipality dataset
2. Hosting (Node or static adapter) and a map-tile outage state
3. Automated tests for missing fields and keyboard selection
4. Strip devtools, add monitoring, CMS or API instead of a JSON file

## AI

AI coding tools were used as expected. This conversation is the unredacted log — export it from the tool and include it in the zip. Do not edit it.

Code I would walk through in the follow-up: `src/lib/park.ts` and `src/routes/index.tsx` (loader + `?park=`).

## Submit

Zip should contain:

1. Source (no `node_modules`, no `.env`)
2. This README
3. Unredacted AI logs from every tool

Also publish a public GitHub repo when asked.

## Follow-up (30 min)

- Demo: list, map locator, details, a missing-data park, keyboard path
- Tradeoff: URL search param vs local state; Leaflet vs a keyed map
- Before release: deploy, JSON/tile/image failures, no CMS yet
- Questions for the team: how Lighthouse ships resident apps, how they review AI-assisted PRs
