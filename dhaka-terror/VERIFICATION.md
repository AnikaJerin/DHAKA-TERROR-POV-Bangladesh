# Dhaka Terror: POV Bangladesh — Verification Notes

## Changes made
- Fixed the invalid stall-selection CSS selector that could throw a `DOMException` while building the main menu.
- Updated the menu to show exactly four vehicle choices (Bus, CNG, Bike, Rickshaw) and three stall choices (Footpath Stall, Tea Stall, Fuchka Wala).
- Added a standalone stall-management screen for the three stall choices. It does not create or load the 3D city map.
- Added basic order validation, stock deduction, cash accounting, restocking, tea preparation, shift completion, English/Bangla labels, and return-to-menu handling.
- Added syntax checks for the new menu and standalone stall module to the build command.

## Checks performed
- `npm run build` — passed.
- `node --check` on every JavaScript file under `dist/` — passed.
- Relative JavaScript import scan — 51 imports checked; 0 missing local modules.
- HTML/CSS local asset scan — passed with no missing local references.
- HTTP smoke checks for `/`, `/app.js`, `/main-menu.js`, and `/characters/stall/standalone-game.js` — all returned HTTP 200 with expected content types.
- A full interactive Chromium test could not be completed in this environment because its browser policy blocks both `localhost` and `file://` navigation. Therefore, no claim is made that all gameplay interactions have been browser-verified.

## Run locally
From the `dhaka-terror` directory:

```bash
npm run build
npm run dev
```

Then open `http://127.0.0.1:5173` in your browser. Vehicle gameplay uses the existing 3D systems and requires a working internet connection for the Three.js CDN import.
