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

## Keeping it in sync with the form

New sign-ups do **not** publish themselves. A GitHub Action reads the form every
three hours, regenerates the data, runs both gates, and **opens a pull request**.
You read the diff and merge. Nothing reaches the public page without a human.

### One-time setup

1. Open the Google Sheet with the form responses.
2. **File → Share → Publish to web**. Pick the responses sheet, choose
   **Comma-separated values (.csv)**, publish, and copy the URL.
3. Do the same for the programs sheet, if it is separate.
4. In this repo: **Settings → Secrets and variables → Actions → New repository
   secret**, and add:
   - `FORM_CSV_ESTUDIANTES` — the students CSV URL
   - `FORM_CSV_PROGRAMAS` — the programs CSV URL (optional)
5. **Actions → sincronizar con el formulario → Run workflow** to test it.

Publishing the sheet to the web makes it readable by anyone holding that URL.
The URL lives in a GitHub secret, but keep that in mind: it is the same data as
the site, plus the timestamps.

### Running it by hand

```bash
npm run sync -- --estudiantes <url|file> --programas <url|file> --dry   # no escribe
npm run sync -- --estudiantes <url|file> --programas <url|file>         # escribe
npm run verificar
```

`npm run sync:prueba` runs it against the committed fixtures in
`scripts/fixtures/`, which is how the pipeline is tested without the live form.

### What the sync does and refuses to do

- Maps a country name to its region and flag automatically (209 names and
  aliases in `scripts/paises.js`, cities included, so "Summer in Rome" lands in
  Europe).
- Merges two sign-ups for the same country into one table.
- Cleans host names: drops "tbd", "only me", stray counts like `6 (`, and the
  country typed into the hosts field.
- Resolves "I want to sit next to…" free text to a real table.
- Updates the totals line in the footer of `index.html`.
- **Refuses to guess.** A country it cannot place aborts the run, writes
  nothing, and names the row. The Action then fails and GitHub e-mails you.
- **Never commits and never publishes.**

Manual corrections live in `data/overrides.json` and survive every sync. The
gate fails if an override points at a table that does not exist.

## Editing the roster

`data/tables.js` is **generated**. Do not hand-edit it between the
`INICIO TABLES` / `FIN TABLES` markers: the next sync overwrites you. Put
corrections in `data/overrides.json` instead, which is applied last and always
wins. Then run `npm run verificar`.

## Structure

```
index.html              the page
assets/styles.css       festival palette, layout, motion
assets/app.js           rendering, search, filters, mail buttons
data/tables.js          the roster — the only file you normally edit
verificar.js            the verification gate
scripts/sync.js         reads the form, regenerates the roster
scripts/paises.js       country/city -> ISO code + region
scripts/fixtures/       CSV copies of the form, so the sync is testable
data/overrides.json     manual corrections that survive every sync
verificar-render.js     loads the page in a real DOM and checks what renders
scripts/fuente.xlsx     original sign-up export
```
