# EPIC: Granicus Find a Park Take-Home and Bryq Assessment

**Status:** release — app + docs ready; zip / GitHub / AI logs left  
**Owner:** candidate  
**Timebox (eng take-home):** 90 minutes to 2 hours, then stop  
**Priority:** engineering take-home first; Bryq second  
**Repo:** `/Users/olu/sandbox/interview/granicus-find-a-park`

## Source briefs (do not lose)

| Artifact | Path | Role |
|---|---|---|
| Find a Park take-home | `docs/source/local-parks-candidate.pdf` | Primary delivery. Granicus Lighthouse technical interview. |
| Bryq assessment guide | `docs/source/Granicus_Bryq_Test_Guide.pdf` | Secondary, separate timed cognitive + personality test. |
| Recruiter note | original `notes.md` | Recruiter asked for timeline, questions, and a public GitHub repo when finished. |
| Sample data (not copied yet) | `../Granicus Ai engineering/parks.sample.json` | Required dataset for the app. Copy into this repo during implementation, not before. |

---

## 1. Initiation

### Problem

Residents need a small web app to find local parks: see them on a map, browse a list, and open details. Municipality may be real or fictional.

### Why this epic exists

This is a hiring exercise, not a product launch. Granicus is scoring a modest working app, clear decisions, AI accountability, and verification — not extra features.

### Stakeholders

- Recruiter: timeline, questions, zip + public GitHub when done.
- Interviewers (30-minute follow-up): demo, code walkthrough, tradeoffs, AI use, release thinking.
- End user of the app: a resident who may be on phone or desktop, may not grant location, may use keyboard only.

### Hard constraints

- Whole submission including testing and README: 90 minutes to 2 hours. Stop at two hours and record what was left unfinished.
- Save the full, unredacted AI transcript from every tool, starting with the first prompt. Submit logs with the code. Do not edit, shorten, or excerpt.
- Using AI is expected. Candidate owns and must understand all submitted code.
- No private credentials in the repo. If a map key is required, document how the interviewer supplies it.
- Backend, accounts, and hosted deployment are not required.
- Search, filters, and current-location support are optional and only after the core works.

### Success definition

A small, polished working app a resident can use to find a park and view details, plus a README that explains decisions, gaps, time spent, and next steps. A modest app that works and is well explained beats an ambitious app with a broken core.

---

## 2. Requirements

### 2.1 Functional — must have

1. **Map of parks.** Show park locations. Selecting a park opens details or clearly links to them. Must work without the resident’s location.
2. **List of parks.** Residents can find and select parks without using the map.
3. **Park details.** Show available information: name, address, description, amenities, hours, images. Handle missing information without crashing or inventing details.
4. **Accessible interface.** Main tasks work on phone and desktop. Readable text and clear labels. Keyboard: select a park from the list and open its details, with a visible focus indicator. List and details are the alternative to map markers.

### 2.2 Functional — out of scope unless core is done

- Search
- Filters
- Current-location / “near me”
- Backend
- Accounts
- Hosted deployment
- Extra features of any kind

### 2.3 Data requirements

Use `parks.sample.json` (or an extended / public dataset, with changes described in the README). Placeholder images are fine.

Expected shape (fields may be missing or null; arrays may be empty):

- `id`, `name`, `description`
- `location.lat`, `location.lng`, `location.address` (address may be absent)
- `amenities[]`, `hours`, `images[]`, `acreage`, `rating`

Planted gaps in the sample (must be handled, never invented):

- null `description` (Old Mill Botanical Garden)
- null `rating` (Cedar Hill Nature Preserve)
- empty `images` (Cedar Hill, East Ridge Trailhead)
- missing `address` (Highland Dog Park)
- unstructured `hours` strings (`Dawn to dusk`, `24 hours`)
- placeholder image URLs that will 404

### 2.4 Non-functional

- Language, framework, and map library are candidate’s choice.
- Include setup needed to run the app locally.
- Phone + desktop.
- Keyboard operable list and details with visible focus.
- Failures (missing fields, broken images) fail visibly and safely.

### 2.5 Submission requirements

Zip containing:

1. Source code
2. README: run instructions, what works, what was left out, important decisions, known issues, how the result was checked, approximate time spent, most important next steps before public use
3. Unredacted AI conversation logs from every tool used

Also: public GitHub repo when finished (recruiter request).

### 2.6 Follow-up chat requirements (not a deliverable in the zip)

30 minutes. App and code ready to share. No slides. No extra features.

Be ready to:

- Demo the app and walk through the code
- Explain decisions, trade-offs, and what was left out
- Discuss how AI was used, reviewed, and checked
- Explain what would change before release: deployment, maintenance, likely failures
- Ask questions about the team and role
- Show a specific piece of code reviewed closely and how it was checked
- If a mistake was found: how it was found and corrected
- If none was found: what was checked and what is still unsure

### 2.7 Secondary workstream — Bryq (do not block the take-home)

Separate assessment. Not pass/fail, but can affect advancement.

- Cognitive: numerical, logical/abstract, verbal reasoning. Some sections timed. Calculator and pen/paper allowed.
- Personality: work style. Honest, consistent answers. Do not game it.
- Environment: quiet space, computer, stable internet, read carefully, pace timed sections.

---

## 3. Analysis

### 3.1 How they evaluate (map work to this, not to feature count)

1. **Usefulness for residents** — can someone find a park and view details? Accessible? Main tasks prioritized?
2. **Communication** — can you explain what you chose, why, and what you left out?
3. **Code quality and maintainability** — readable, straightforward to extend, missing data and failures handled sensibly
4. **AI direction and accountability** — guided the tools, checked output, took responsibility
5. **Review and verification** — show how code and behavior were checked, including problems passing tests might miss

### 3.2 Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep (search, filters, geo, hosting) | Broken core inside 2 hours | Core only until list + map + details + a11y work |
| Map library API key | Interviewer cannot run the app | Prefer a no-key option, or document env var and never commit secrets |
| 404 placeholder images | Broken UI | Empty/error image state, no fake photos |
| Null/missing fields | Crash or invented copy | Explicit empty states (“No description provided”) |
| Map-only interaction | Fails a11y requirement | List and details fully keyboard-usable |
| AI-generated code not understood | Fails follow-up | Review one slice deeply; keep logs; note what is still unsure |
| Spending time on Bryq first | Take-home late or thin | Recruiter: prioritize eng take-home |
| Edited AI logs | Disqualifying | Export full unredacted transcripts |

### 3.3 Assumptions (record in README during build)

- Municipality: New York–area parks from the sample JSON is enough; no extra dataset required.
- No geolocation permission will be requested for the core.
- Local run is sufficient; no deploy.
- Placeholder images may fail to load; that is expected.
- 12 sample parks are enough to demo map + list.
- Stack will be whatever the candidate can finish and explain in two hours.

---

## 4. Design (approach only — no implementation in this phase)

### 4.1 Product shape

Three cooperating surfaces, one selected park:

- **List** — browse and select without the map
- **Map** — markers from `lat`/`lng`; selection opens or links to details
- **Details** — available fields only; missing fields shown as absent, not guessed

Shared selection is the only important state. List, map, and details stay in sync.

### 4.2 Accessibility shape

- List items and the control that opens details are keyboard reachable
- Visible focus ring
- Map is supplementary; list + details fulfill the task if the map is unusable
- Readable type, labels, and touch targets on a phone

### 4.3 Data handling shape

- Load static JSON (no backend)
- Treat null, missing, and empty as first-class cases
- Do not fabricate description, address, rating, or images

### 4.4 Stack decision (locked)

Full write-up: `docs/DESIGN-tech-stack.md`

- **App:** TanStack Start (React), CLI: `npx @tanstack/cli@latest create`
- **Router:** file-based TanStack Router in `src/routes/`, `createFileRoute` only
- **Server:** `createServerFn()` — no Next.js `'use server'`
- **Data:** route `loader` loads parks; selected park is a typed search param `?park=`
- **UI:** TypeScript + Tailwind
- **Map:** Leaflet + OSM, no API key, client-only mount
- **Not used for core:** TanStack Query, extra routes, auth, hosting

### 4.5 AI operating rules

- Use AI as during normal work
- Candidate writes the prompts, reviews diffs, and runs the app
- Keep every conversation log from the first prompt
- Be ready to show one reviewed slice and one check tests would miss (a11y, 404 images, null fields)

---

## 5. Implementation plan (stories — not started)

Do not write application code until a 2-hour block is reserved. Stack is chosen.

### Story 0 — Clock and logs

Done. App scaffolded with TanStack CLI. Sample JSON copied to `src/data/parks.sample.json`. AI logs continue in this conversation.

### Story 1 — Load parks and render a list

Done. Index loader calls `getParks`. List is keyboard-selectable via typed `?park=` links.

### Story 2 — Park details with missing data

Done. Details render available fields only. Null description/rating, missing address, empty images, and 404 image URLs fail closed.

### Story 3 — Map of parks

Done. Leaflet + OSM, client-only, no geolocation. Marker click sets `?park=`.

### Story 4 — Selection sync and layout

Done. Shared search param. Desktop: sticky list + map + details. Phone: stacked.

### Story 5 — Keyboard and focus

Done. Skip links, list links, visible focus, details live region. Map is supplementary.

### Story 6 — README, stop, submit artifacts

README done. Remaining: export AI logs, zip, public GitHub, send to recruiter.

### Optional stories (only if Stories 1–5 are done)

- Search
- Amenity filters
- Current location

### Suggested timebox inside the 2 hours

| Window | Focus |
|---|---|
| 0–10 min | Stack + layout + log capture |
| 10–70 min | Stories 1–3 |
| 70–100 min | Stories 4–5, missing-data and broken-image passes |
| 100–120 min | Story 6, then stop |

---

## 6. Verification

### 6.1 Manual checks (tests can miss these)

- Open the app with no location permission
- Keyboard-only: list → select → details, visible focus
- Phone-width and desktop-width
- Old Mill: no invented description
- Cedar Hill: no rating shown as a fake number; empty images do not break layout
- Highland Dog Park: missing address does not crash
- Click a map marker and a list row; both reach details
- Broken placeholder images fail closed

### 6.2 Follow-up evidence to keep

- One code slice reviewed closely
- Any AI mistake caught, and how
- If none: what was checked and what is still unsure

---

## 7. Release / submission

Not a production deploy. “Release” means interviewer-runnable.

1. Local run instructions in README
2. No secrets in git
3. Zip: source, README, AI logs
4. Public GitHub repo
5. Recruiter: estimated timeline and any questions before starting the clock

---

## 8. Operations / follow-up

Treat the 30-minute chat as the operations review:

- What would change before public use
- Deployment, maintenance, likely failures (bad JSON, 404 images, map tile outage, missing key)
- Questions for the Granicus / Lighthouse team and role

Bryq is a separate operational event: quiet room, computer, stable internet, timed cognitive sections, honest personality answers. Do it after the take-home plan is clear, not instead of it.

---

## SDLC status

| Phase | Status |
|---|---|
| 1. Initiation | done in this epic |
| 2. Requirements | done in this epic |
| 3. Analysis | done in this epic |
| 4. Design | stack locked — see `docs/DESIGN-tech-stack.md` |
| 5. Implementation | stories 0–5 + search/filters + mobile Directory/Map |
| 6. Verification | typecheck, lint, build, manual cases |
| 7. Release | docs done; zip / GitHub / logs left |
| 8. Follow-up / ops | notes in README |
| Bryq | not started |

## Explicitly not in this commit of work

- Zip + public GitHub + AI log export (you)
- Bryq
- Automated tests
