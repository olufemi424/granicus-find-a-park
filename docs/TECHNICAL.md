# Technical documentation

Find a Park — architecture, data flow, and module boundaries.

Related: `README.md` (run / submit), `docs/EPIC-granicus-find-a-park-take-home-and-bryq.md`, `docs/DESIGN-tech-stack.md`, `docs/TASKS.md`.

---

## 1. System context

No database, no auth, no map API key. The browser talks only to this app. The app reads a static JSON file on the server. Map tiles come from OpenStreetMap.

```
  Resident                 This app                      OSM
  --------                 --------                      ---
     |                         |                          |
     |  GET /  or  /?park=...  |                          |
     |------------------------>|                          |
     |                         |  read parks.sample.json  |
     |                         |  (createServerFn)        |
     |  HTML + JS (SSR)        |                          |
     |<------------------------|                          |
     |                         |                          |
     |  tile requests          |                          |
     |--------------------------------------------------->|
     |  PNG tiles              |                          |
     |<---------------------------------------------------|
```

Out of band: keyboard users never need OSM. List + details are enough.

---

## 2. Runtime stack

```
+------------------------------------------------------+
|  Browser                                              |
|  React 19  +  TanStack Router (hydrated)              |
|  Leaflet map (client-only chunk)                      |
+----------------------------^-------------------------+
                             |  RPC stub for getParks
+----------------------------v-------------------------+
|  TanStack Start  (Vite, SSR + hydration)              |
|  Route loader  ->  createServerFn(getParks)           |
|  Node readFile  src/data/parks.sample.json            |
+------------------------------------------------------+
```

Not used: Next.js, React Router, TanStack Query, databases, env secrets.

---

## 3. Request lifecycle

```
  request  /?park=prospect-park&q=trail&amenity=restrooms
      |
      v
  __root.tsx          document shell, skip links, CSS
      |
      v
  index.tsx
      |  validateSearch  ->  { park, q, amenity[] }
      |  loader          ->  getParks()
      v
  ParksPage
      |  filterParks(parks, { q, amenity })
      |  selected = parks.find(id === park)
      v
  +----------+  +-----------+  +-------------+
  | ParkList |  | ParkMap   |  | ParkDetails |
  +----------+  +-----------+  +-------------+
```

Loader returns the **full** park set. Filtering is client-side from URL search params so typing in search does not refetch.

---

## 4. URL is the state

One route: `/`. Selection, query, and filters live in the search string. Shareable, back-button friendly, typed.

```
  /?park=<id>&q=<text>&amenity=<a>&amenity=<b>
       |         |           |
       |         |           +-- AND match on park.amenities
       |         +-------------- case-insensitive name/desc/address/amenity
       +------------------------ selected park (details + locator)
```

```
  validateParksSearch
        |
        +-- park?: string
        +-- q?: string
        +-- amenity?: string[]     (single string coerced to [string])
```

Navigate always spreads previous search so list clicks do not drop filters:

```
  search: (prev) => ({ ...prev, park: id })
```

---

## 5. Module map

```
src/
|-- router.tsx                 getRouter()
|-- routeTree.gen.ts           generated — do not edit
|-- styles.css                 Tailwind + Leaflet + pin CSS
|-- data/
|   `-- parks.sample.json      source of truth
|-- functions/
|   `-- parks.functions.ts     getParks  (server only handler)
|-- lib/
|   |-- park.ts                Park type, parse, filter, amenities
|   |-- parkSearch.ts          validateSearch
|   `-- parkPin.ts             Leaflet divIcon SVG
|-- routes/
|   |-- __root.tsx             html/body, skip links
|   `-- index.tsx              loader + page composition
`-- components/
    |-- Panel.tsx              shared card chrome
    |-- ParkFilters.tsx        amenity chips (+ desktop search)
    |-- ParkSearchBar.tsx      phone search overlay
    |-- ParkList.tsx           keyboard list of Links
    |-- ParkDetails.tsx        missing-data safe article + photos
    |-- ParkMap.tsx            dynamic import wrapper
    `-- ParkMapInner.tsx       Leaflet (window required)
```

Import alias: `#/*` → `src/*`.

---

## 6. Data pipeline

```
  parks.sample.json
          |
          |  readFile  (server)
          v
     JSON.parse  ->  unknown
          |
          v
     parseParks[]
          |
          |  drop objects missing id, name, lat, lng
          |  null description / rating stay null
          |  missing address stays undefined
          |  empty arrays stay empty
          v
     Park[]
          |
          +-- uniqueAmenities(parks)     filter chips
          +-- filterParks(parks, q, amenity)     list + map
          +-- parks.find(id)             details (full set)
```

`Park` (simplified):

```
  Park
  |-- id, name
  |-- description: string | null
  |-- hours: string | null
  |-- rating: number | null
  |-- acreage?: number
  |-- amenities: string[]
  |-- images: string[]
  `-- location
      |-- lat, lng
      `-- address?: string
```

Null vs missing is intentional. The UI prints “not available”; it does not invent copy or photos.

---

## 7. UI layout

The map is the page. List and details float on top.

```
+---------------------------------------------------------------+
|                      MAP (full viewport)                      |
|   +-------------+                      +------------------+   |
|   | SEARCH      |         * pins       | DETAILS          |   |
|   | FILTERS     |                      | (when selected)  |   |
|   | LIST        |                      |                  |   |
|   +-------------+                      +------------------+   |
+---------------------------------------------------------------+
```

Desktop: list left (`w-80`), details right, map padding so pins sit in the open center. Filter chips scroll horizontally inside the aside (scrollbar hidden; fieldset `min-w-0` so chips do not bleed).

Phone: map is the default surface.

```
  Search bar (top)
  Map
  [ Directory ]          -> flips to full list
  Compact details card   -> when a park is selected (no overflow sheet)
```

Typing in search sets `mobilePane` to `directory` so results appear in the list. **Map** in the directory header returns to the map. `mobilePane` is React state, not a URL param.

---

## 8. Selection sync

Three surfaces, one `park` search param.

```
  List Link                Map marker click
       \                       /
        \                     /
         v                   v
        navigate({ search: prev => ({ ...prev, park: id }) })
                     |
                     v
              URL  ?park=id
                     |
         +-----------+-----------+
         v           v           v
       List       Map pin     Details
       highlight             article
```

List uses `<Link>` so keyboard (Tab / Enter) is the same as click.

---

## 9. Map client boundary

Leaflet needs `window`. The inner map is a separate chunk, loaded after mount.

```
  ParkMap  (SSR-safe)
     |
     |  useEffect -> import('./ParkMapInner')
     |
      +-- placeholder "Loading map..."
      |
     v
  ParkMapInner  (client chunk)
     |
     +-- MapContainer + OSM TileLayer
     +-- FitVisibleParks     refit when filter set changes
     +-- FlyToSelected       skip first load; fly on later changes
     `-- Marker + Tooltip    SVG tree locator pins
```

If the chunk or tiles fail, list and details still work.

---

## 10. Search and filters

```
  q = "trail"
  amenity = ["restrooms", "parking"]     AND

  for each park:
      amenities include restrooms AND parking ?
          no  -> drop
          yes -> haystack = name + description + address + amenities
                 haystack contains "trail" ?
                     no  -> drop
                     yes -> keep
```

Empty result: list shows “No parks match this search.” Map has no markers. Details still show a previously selected park if its id is in the full set.

Clear resets `q` and `amenity`, keeps `park`.

On phone, a non-empty `q` opens the directory so matches are visible in the list.

---

## 11. Missing data and photos

```
  field value                 UI
  -------------------------   -----------------------------
  description: null           "No description provided"
  rating: null                "Rating not available"
  address missing             "Address not available"
  hours: null                 "Hours not available"
  amenities: []               "No amenities listed"
  images: []                  "No photos available"
  images: [404 URL]           hidden img onError -> same copy
```

Photos are not shown until `onLoad`. Failed URLs never occupy layout height. That stops the 404 collapse shift.

Planted fixtures:

```
  old-mill-botanical-garden     description null
  cedar-hill-nature-preserve    rating null, images []
  highland-dog-park             address omitted
```

---

## 12. Accessibility path

Map is supplementary.

```
  Tab
   |
   +--> Skip to park list
   +--> Skip to park details
   |
   v
  Search input
   |
   v
  Filter buttons  (aria-pressed)
   |
   v
  List links  (aria-current on selected, visible focus ring)
   |
   Enter
   |
   v
  URL ?park=...   details aria-live="polite"
```

Selected list row uses a white focus ring (green ring is invisible on the green background).

---

## 13. Failure modes

```
  JSON unreadable / parse empty
      -> route errorComponent  "Unable to load parks"

  Unknown ?park= id
      -> details: "That park was not found."

  Map JS fails to load
      -> "Loading map..." then list/details still usable

  OSM tiles down
      -> grey map container; pins may still exist; list works

  Image 404
      -> "No photos available"; no layout jump
```

---

## 14. Commands

```
  npm run dev          Vite on port 3000 (or next free)
  npm run typecheck    tsc --noEmit
  npm run lint         eslint
  npm run build        client + SSR bundles
```

No secrets. `getParks` reads from `process.cwd()/src/data/parks.sample.json`.
