# Daily Intentionality Scheduler

iPad-first PWA for planning a day as a stack of intention blocks—not a grid of fixed appointments. Pick blocks from an inventory chest, line them up on a nine-slot hotbar, ripple the timeline forward when life happens, then export to Apple Calendar with one tap.

**Short name on the home screen:** Intentional

**Live app:** [daily-intentionality-scheduler-jeizu-projects.vercel.app](https://daily-intentionality-scheduler-jeizu-projects.vercel.app)

## What it does

- **Stack from a start time** — Set “Day starts,” add blocks in order; clock times are computed from durations (including a 15-minute buffer between blocks).
- **Hotbar + inventory** — Minecraft-inspired UI: one block in hand, up to nine on the bar, presets in the chest.
- **Ripple (+15)** — Slide everything after a block forward by 15 minutes without re-editing each slot.
- **Biome tint** — Morning / afternoon / evening styling follows the computed schedule, not manual toggles.
- **Save & Quit to Calendar** — Downloads an RFC 5545 `.ics` file; on iPadOS, open it to add events to Calendar.
- **Works offline** — Service worker caches the app shell; schedules persist in IndexedDB (with localStorage fallback).

## Tech

| Layer | Choice |
|--------|--------|
| UI | HTML, CSS (custom properties, no framework) |
| Logic | Vanilla JavaScript (`scheduler.js`, `app.js`) |
| PWA | `manifest.json`, service worker (`sw.js`) |
| Storage | IndexedDB + localStorage fallback |
| Fonts | Pixelify Sans (bundled WOFF2) |

No build step, no npm dependencies in the shipped app.

## Run locally

Serve the repo root over HTTP (required for the service worker and reliable storage):

```bash
npx serve .
# or: python -m http.server 8080
```

Open `http://localhost:3000` (or your port), then use the app. For the best experience, try **Add to Home Screen** on iPad or iPhone.

## Deploy

Static hosting only—point the host at the repository root with no build command. Works well on [Vercel](https://vercel.com), GitHub Pages, or any static CDN.

## Project layout

```
index.html      App shell and landmarks
styles.css      Hotbar / field / chest styling
app.js          UI state, gestures, inventory, export
scheduler.js    Timeline math, persistence, .ics generation
sw.js           Offline cache
manifest.json   PWA metadata
assets/         Block textures (SVG)
icons/          App icons
fonts/          Pixelify Sans
DESIGN.md       Design system (colors, type, spacing)
PRODUCT.md      Product intent and constraints
tools/          Icon generation helper (dev-only)
```

## Design

Visual direction is deliberately **block-game inspired** (dirt field, stone/grass buttons, chunky pixel type)—not a corporate timetable. Tokens and rationale live in [DESIGN.md](./DESIGN.md).

## Author

**Jeizu** — [GitHub](https://github.com/jeizu-ri) · [justinerivera.tech@gmail.com](mailto:justinerivera.tech@gmail.com)
