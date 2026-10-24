# Find a Park — SDL task tracker

**Last updated:** 2026-10-24  
**Current phase:** 7 Release — app + docs ready; zip / GitHub / AI-log export still on you  
**Timebox:** 90–120 min lab; this repo was built in SDL stages

## Status key

- `[ ]` not started
- `[🔄]` in progress
- `[✅]` complete
- `[⏸️]` deferred
- `[❌]` cancelled

## Progress

| Phase | Status |
|---|---|
| 1 Initiation | ✅ |
| 2 Requirements | ✅ |
| 3 Analysis | ✅ |
| 4 Design | ✅ `docs/DESIGN-tech-stack.md` |
| 5 Implementation | ✅ stories 0–5 + search/filters + mobile Directory/Map |
| 6 Verification | ✅ typecheck, lint, build, manual cases in README |
| 7 Release | 🔄 docs done; zip + GitHub + AI logs left |
| 8 Follow-up chat prep | ✅ notes in README |
| Bryq | ⏸️ after take-home |

## Story 0 — Clock, scaffold, data ✅

- [✅] AI logging on
- [✅] TanStack CLI scaffold
- [✅] Sample JSON copied
- [✅] Stack locked in design doc

## Story 1 — List ✅

- [✅] `getParks` server function + index loader
- [✅] List without the map
- [✅] Typed `?park=`

## Story 2 — Details + missing data ✅

- [✅] Available fields only
- [✅] Old Mill / Cedar Hill / Highland cases
- [✅] 404 photos fail closed

## Story 3 — Map ✅

- [✅] Leaflet + OSM, no key, no geolocation
- [✅] Locator pins + selected-park card

## Story 4 — Selection sync + layout ✅

- [✅] Shared selection
- [✅] Desktop locked viewport; phone stacked

## Story 5 — Keyboard and focus ✅

- [✅] List links, skip links to list and details
- [✅] Visible focus (white ring on selected row)
- [✅] Details `aria-live="polite"`
- [✅] Map is supplementary

## Story 6 — README / stop / submit 🔄

- [✅] README: run, works, left out, decisions, issues, checks, time, next steps
- [ ] Export unredacted AI logs
- [ ] Zip source + README + logs
- [ ] Public GitHub
- [ ] Recruiter send

## Optional

- [✅] Search (`q` in URL; phone typing opens Directory)
- [✅] Filters (amenity AND chips)
- [⏸️] Current location

## Verification ✅

- [✅] No location permission
- [✅] Keyboard path (list → details)
- [✅] Layout: phone map + Directory/Map; desktop list | map | details
- [✅] Missing-data parks
- [✅] Map locator and list both open details
- [✅] Broken images fail closed
- [✅] `npm run typecheck && npm run lint && npm run build`
