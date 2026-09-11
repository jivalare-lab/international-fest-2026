# Loyola's International Fest 2026 — Registered Tables

A one-page, dependency-free site listing every country and program hosting a
table at Loyola's International Fest, grouped by region and colour-coded.

**September 30th, 2026 · 3:30–5:00 PM · Peace Quad · Brought to you by ISA**

## What it does

- **28 tables** — 26 countries and 2 Loyola study abroad programs
- **6 regions**, each with its own colour taken from the official festival flyer
- Live search across country, host, dish and activity
- Filter chips per region with live counts
- **Email this table** on every card: opens a pre-written message to that host
- Copy-address and call buttons on every card
- A full roster table at the bottom
- Works down to 400px wide, respects `prefers-reduced-motion`, keyboard
  accessible (press `/` to jump to search)

## Running it

It is static. Open `index.html`, or:

```bash
python3 -m http.server 8000
```

## Verifying it

```bash
node verificar.js
```

Read `VERIFICACION.md` before changing anything. This repo publishes personal
contact details of 71 people; the level contract explains what that means.

## Editing the roster

Everything lives in `data/tables.js`. Add or edit a record, then run
`node verificar.js`. If you change the number of tables, countries or programs,
**also update the totals line in the footer of `index.html`** — the gate checks
that those two agree.

## Structure

```
index.html              the page
assets/styles.css       festival palette, layout, motion
assets/app.js           rendering, search, filters, mail buttons
data/tables.js          the roster — the only file you normally edit
verificar.js            the verification gate
scripts/fuente.xlsx     original sign-up export
```
