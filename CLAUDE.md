# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## Project overview

**Megaparc** is a single-page marketing website for *Megaparc SRL*, an
investment and construction company based in Chișinău, Moldova. The site
presents the company, its services, its real-estate portfolio, its
vision/mission, and contact details.

It is a **static website** — plain HTML, CSS, and vanilla JavaScript. There is
**no build step, no framework, no package manager, and no backend**. The files
are served as-is.

The primary language of the content (and of commit messages so far) is
**Romanian**. The UI is trilingual: Romanian (RO, default), Russian (RU), and
English (EN).

## Repository structure

```
site-megaparc/
├── index.html        # The entire page markup (single HTML file)
├── css/
│   └── style.css     # All styles (~920 lines), design tokens in :root
├── js/
│   ├── i18n.js       # Translation dictionary (RO/RU/EN) + language switching
│   └── main.js       # All interactive behavior (nav, routing, animations)
└── img/              # JPG photos of projects + hero/vision imagery
```

That's the whole project. There are no config files, no tests, no CI, no
tooling directories.

## Running / previewing

There is no build. To preview, serve the folder over a static HTTP server (so
relative paths and `fetch`-based fonts behave) and open the page:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` mostly works but a local server is
preferred.

## Architecture & key conventions

### Single-page, hash-routed "pages"
Although it's one HTML document, the content is split into client-side "pages"
using `<div class="page" data-page="...">` wrappers (`acasa`, `despre`,
`servicii`, `proiecte`, `viziune`, `contact`). `js/main.js` implements a small
hash router:
- `showPage(name, animate)` toggles the `.active` class so only one page shows
  at a time, scrolls to top, and updates the active nav link (`.current`).
- `routeFromHash()` maps `location.hash` to a page (defaults to `acasa`).
- Clicks on `a[href^="#"]` whose target matches a `data-page` are intercepted,
  pushed to history, and routed. `#top` is aliased to `acasa`.

When adding a new section, create a new `<div class="page" data-page="x">`,
add a matching nav link `<a href="#x">`, and the router picks it up
automatically (it reads `data-page` values at load).

### Internationalization (`js/i18n.js`)
- All translatable strings live in the `I18N` object, keyed by language
  (`ro`/`ru`/`en`) then by a dotted string key (e.g. `hero.l1`,
  `proj.3p`).
- In the HTML, translatable elements carry `data-i18n="<key>"`. The default
  (Romanian) text is written inline as the fallback/initial content.
- `applyLang(lang)` sets `<html lang>`, the `<title>`, the meta description,
  and replaces every `[data-i18n]` element's `innerHTML` with the dictionary
  value. **Values may contain HTML** (e.g. `<br>`, `<em>`), so `innerHTML`
  (not `textContent`) is used intentionally.
- The chosen language persists in `localStorage` under `megaparc-lang`.

**Rule when editing content:** every `data-i18n` key must exist in **all three**
language dictionaries. When you add/change a string in `index.html`, update the
matching key in `ro`, `ru`, and `en`. When you add a new translatable element,
add a `data-i18n` attribute and a corresponding entry in each language block.
Keep the inline Romanian text in `index.html` in sync with the `ro` dictionary.

### Interactions & animations (`js/main.js`)
All behavior is plain DOM JS, no dependencies:
- **Intro overlay** (`#intro`): animated SVG logo reveal, removed on
  `animationend`, on click, or after a 6.5s timeout.
- **Sticky topbar**: adds `.solid` after scrolling 40px.
- **Mobile burger menu**: toggles `.open` on `#nav`, manages ARIA state.
- **Scroll reveals**: elements with `.reveal` get `.visible` via
  `IntersectionObserver` (with a scroll fallback).
- **Counters**: `[data-count]` numbers animate up when scrolled into view.
- **Parallax**: `[data-parallax="<speed>"]` translate on scroll.
- **Tilt / magnet / custom cursor**: only on fine-pointer, hover-capable
  devices (`finePointer`), applied to `.tilt`, `[data-magnet]`, and `#cursor`.
- The current year is injected into `#year`.

**Accessibility / motion:** the code respects `prefers-reduced-motion`
(`reduceMotion`) — counters jump to final values, parallax/tilt/cursor are
skipped, and the intro finishes immediately. Preserve this when adding motion:
gate new animations behind the `reduceMotion` / `finePointer` checks already
defined at the top of `main.js`.

### Styling (`css/style.css`)
- A single stylesheet. **Design tokens are CSS custom properties in `:root`**
  (brand reds `--red`/`--red-hot`/`--red-soft`, dark inks `--ink*`, neutrals,
  and `--font-display` = League Spartan, `--font-body` = Public Sans). Use these
  variables rather than hardcoding colors/fonts.
- Fonts are loaded from Google Fonts in `index.html`.
- Fluid sizing via `clamp()` is used throughout for responsive type/spacing.
- Responsive breakpoints: `1024px`, `768px`, `720px`, `520px`, plus
  pointer/motion media queries (`hover: none`, `prefers-reduced-motion`).
- Class naming is descriptive/component-style (e.g. `.hero-content`,
  `.project-media`, `.vision-card`), kebab-case, no CSS methodology framework.

## Brand facts (keep consistent across languages and pages)
- Company: „Megaparc" SRL · Reg./C/f **1005600025867**
- Tagline: **"We build the Future"** (kept in English in all locales)
- Address: bd. Dacia 31, MD-2060, Chișinău
- Phones: +373 22 882 035 (landline), +373 78 803 010 (mobile/reception)
- Email: receptie@imc.md
- Brand color: red `#CB0102`
- Portfolio projects: Dacia 31, Moscova 9, Moscova 20, Vasile Lupu 48, Vatra,
  Florilor (each with an image in `img/` and a `proj.*` i18n entry).

## Git workflow
- Active development branch for this work: **`claude/claude-md-docs-fiigc0`**.
- Commit messages in history are in Romanian and describe user-facing changes
  (e.g. "Adaptare varianta mobila"). Match that style — short, descriptive,
  in Romanian — when committing content/layout changes.
- Push with `git push -u origin <branch>`, then open a draft PR.

## When making changes — checklist
- Editing copy? Update `index.html` **and** all three dictionaries in
  `js/i18n.js` for the affected `data-i18n` keys.
- Adding a section/page? Add the `.page[data-page]` block, a nav link, and i18n
  keys; the router and reveal/counter logic pick up new elements automatically.
- Adding imagery? Place files in `img/`, reference with `loading="lazy"`
  (except the hero, which uses `fetchpriority="high"`), and give meaningful,
  localized `alt` text.
- Adding motion/interaction? Use the existing `reduceMotion` / `finePointer`
  guards and prefer `requestAnimationFrame` for scroll/pointer work, as the
  current code does.
- Use the `:root` CSS variables for colors and fonts.
- No build/test commands exist — verify changes by loading the page in a
  browser (ideally via a local static server) and checking RO/RU/EN.
