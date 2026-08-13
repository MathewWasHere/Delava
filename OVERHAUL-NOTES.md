# DELAVA — Brand & UX Overhaul

All 17 requested items, what changed, and how each was verified.

**Live preview:** running in the workspace on port 3000.
**cPanel package:** `delava-cpanel.zip` (402 files, 7.0 MB)

---

## 1. Official brand assets everywhere

The supplied pack was copied verbatim into `public/brand/` — **nothing was
redrawn, traced, regenerated or approximated**. `delava-brand-guide.md` and
`delava-assets.json` were read first and followed exactly:

| Context | Light mode | Dark mode |
| --- | --- | --- |
| Wordmark (header, footer, drawer, admin, auth, 404, offline) | `delava-logo-orange.png` (#EE6D1B) | `delava-logo-white.png` |
| Square icon lockup (`LogoMark`) | `delava-icon-orange.png` | `delava-icon-light.png` |
| Social / OG card | `delava-social-dark.png` | — |
| PWA icons | regenerated **from** `delava-icon-*.png` | — |

Both variants are in the DOM and swapped by CSS keyed on `data-theme`, so the
right mark paints on the very first frame — no hydration flash, no JS. Contexts
that sit on the night photograph (`.on-photo`) always force the white mark.

The old extracted `logo-word.png` is no longer referenced anywhere
(`grep` for `logo-word|logo-full|logo-delava|logo-sub` → 0 hits). The brand
orange ramp was also re-based on the official **#EE6D1B**.

**The unlisted file** in the pack was `ChatGPT Image Aug 13, 2026, 11_50_20 PM.png`
— the night storefront render with the round illuminated «فست فود دلاوا» sign.
It is the mobile hero source (item 2).

## 2. Mobile hero — purpose-built, not a squeezed desktop image

`scripts/prepare-brand.py` generates three focal crops instead of dropping one
image into every breakpoint:

| Output | Size | Used for |
| --- | --- | --- |
| `hero-mobile.webp` | 900×1200 (3:4) | phones |
| `hero-mobile-sm.webp` | 720×900 | short phones |
| `hero-desktop.webp` | 1600×900 | tablet + desktop |

The crop is anchored on the sign (focal point ~74% across, right-of-centre in
the artwork) so it is never sliced. Content sits in the lower half
(`content-end` + `pt-[38vw]`), the sign reads clearly above it, and the scrim is
tuned per breakpoint — bottom-up on mobile, side-sweep on desktop.

## 3. "هم اکنون باز است" moved into the header

Removed from the hero entirely. Now `components/shell/OpenStatus.tsx`: a compact
pill beside the cart that computes real open state (18:00–01:00) from the clock.
It collapses to a dot + «باز» on phones and only reveals the hours at `lg`, so
it never crowds the cart. RTL spacing tuned; ≥12.5px text.

## 4. Category belt

`.belt` in `globals.css`: native momentum scroll, **`scroll-snap-type: none`**
(deliberately no snapping), scrollbar hidden cross-browser, `flex-wrap: nowrap`,
RTL-aware edge fades hinting more content. Items are 88px so a partial tile is
always visible. Scoped under `max-width: 639.98px` so `sm:grid` takes over on
tablet — a bug caught in the audit where the unscoped class collapsed grid
items to 2px.

Verified: `scrollWidth 522 > clientWidth 390` → genuinely scrollable.

## 5. Best sellers → exactly 3

`items.slice(0, 3)` with a `sm:grid-cols-3` grid so the row stays balanced
rather than leaving a hole where cards 4–8 were.

## 6. First-order discount card

Rebuilt compact: one horizontal band, `py-6`, smaller type ramp, **«درباره
دلاوا» button removed**, and the reclaimed space absorbed by the flex layout
(single CTA, no gap).

## 7. Live order tracking above the hero

`components/home/LiveOrderBanner.tsx`, rendered **before** `<Hero />`. Shows
only while an order is active. Status icon + ETA + progress on phones; a full
labelled step rail from `sm` up. Verified geometrically: banner top `57px`,
hero top `203px` → provably above.

## 8. Tracking icon alignment

The old timeline used **text glyphs** (`✓`, `●`, `○`) which sit on a font
baseline and can never centre reliably. Replaced with SVGs drawn on a shared
24×24 grid, centred on (12,12), absolutely positioned and stretched inside a
fixed 32px circle at a uniform 62% inset.

Measured across all states:

| Step state | Circle | Icon offset X | Icon offset Y |
| --- | --- | --- | --- |
| done (green ✓) | 32×32 | 0.01px | −0.01px |
| active (orange) | 32×32 | 0.00px | 0.00px |
| todo (neutral) | 32×32 | 0.00px | 0.00px |

Connectors now start exactly at the circle edge and share its axis.

## 9. Real Google Maps in حضوری

`components/home/LocationMap.tsx` — an actual interactive embed for
`28.9526502, 53.6216568`, click-to-load behind a branded placeholder so phones
pay no third-party cost until asked. Plus directions, Google Maps link, call and
copy-address actions (all ≥48px). **No raw URL text appears anywhere**
(asserted in tests).

## 10. Mobile footer height

Removed the «دلاوا» / «دسته‌بندی‌ها» / «حساب کاربری» link columns — 12 links
that duplicated the bottom nav and header. What remains: brand + socials,
contact essentials, legal line. This is a structural reduction, **not hidden
text**. Mobile footer is now **429px** (was roughly triple).

## 11. Admin live-orders — semantic colour

`STATUS_ACTION_TONE` + `ACTION_BUTTON_CLASS` in `order-machine.ts` give colour
meaning rather than decoration:

- **green** — forward progress / success (تایید شده، آماده، تحویل شده)
- **red** — failure / cancellation (ناموفق، لغو)
- **neutral** — contextual, non-committal

Solid high-contrast fills, `min-h-9` on board chips and `min-h-12` in the
drawer, `title` + `aria-label` on every action.

## 12. Light + dark, light is default

The UI is built on semantic tokens (`ink-*` surfaces, `mist-*` text), so each
theme **re-maps the tokens** instead of duplicating a design system.

- Default: **light**. `THEME_INIT_SCRIPT` runs in `<head>` before paint.
- Switcher in the **header** (icon) and the **mobile drawer** (labelled segmented control).
- Persisted to `localStorage` (`delava.theme.v1`), synced across tabs.
- `ThemeProvider` uses `useSyncExternalStore` — no setState-in-effect (React Compiler clean).
- `.on-photo` islands stay dark in both themes so the night hero never washes out.

A codemod converted 295 hard-coded dark-only utilities across 30 files
(`text-white`→`text-mist-100`, `border-white/N`→`var(--surface-border)`, etc.),
skipping coloured fills where white text is correct. Also fixed `mist-300`,
which was used 34 times but never defined, and the admin's hard-coded `#080808`.

## 13. Customer cards ~6 across

Rebuilt from full-width rows into a density-first card grid:
`grid-cols-2 → sm:3 → lg:4 → xl:5 → 2xl:6`. Real proportion changes — 12px
padding, 32px avatar, two-column stat footer — not just a smaller font.

## 14. Settings: restaurant name removed

Field deleted outright; no disabled or empty input remains. The row reflows to a
clean single-column stack. Asserted: page no longer contains «نام رستوران».

## 15. Settings: Google Maps URL input

Labelled «لینک گوگل مپ» under Address, `inputMode="url"`, LTR value in an RTL
form, validated against `maps.app.goo.gl` / `google.com/maps` / `goo.gl/maps`,
inline error + `aria-invalid`, save blocked while invalid. Works in both themes.

## 16. Responsive audit

Automated sweep at **320 / 360 / 375 / 390 / 414 / 768 / 1024 / 1440**, six
routes, **both themes** (plus admin at three widths):

| Metric | Before | After |
| --- | --- | --- |
| Total problems | 192 | **0** |
| Horizontal overflow | 0 | **0** |
| Text below 12.5px | 84 instances | **0** |
| Tap targets under 44px | 108 instances | **0** |
| Console / page errors | 0 | **0** |

Fixes were reflow and resizing — **no content was hidden to make mobile work**.

## 17. Quality

- E2E re-verified: add to cart → OTP → address + zone → delivery → payment →
  `order?id=…&new=1`. Cart badge `۱`, order created, **0 errors**.
- `tsc --noEmit` clean · `eslint src` clean · `next build` 48 pages.
- Zero 4xx/5xx on any asset; official brand images confirmed loading with
  correct light/dark visibility.
- No unrelated functionality touched.

---

### Notes for the client

- Menu **prices are still estimates** pending the real list — one file:
  `src/lib/data/catalog.ts`.
- Instagram/Telegram in `RESTAURANT` are placeholders awaiting real handles.
- Regenerate hero crops / PWA icons any time with
  `python3 scripts/prepare-brand.py`.

---

# Follow-up round

## 1. «چرا دلاوا» section removed
`WhyDelava` deleted from `Sections.tsx` and the homepage, along with its
`REASONS` data. (`TrackingPreview`, which lived next to it, was rebuilt — it now
reuses the perfectly-centred `StepCircle` from item 8 instead of its own
`✓ / ● / ○` text glyphs, so its icons are aligned too.)

## 2. Smaller logo
Header **92px → 72px**, footer **100px → 78px**.

## 3. Hamburger menu fixed  🐞
**Root cause:** the drawer was `position: fixed` but rendered *inside* the
`<header>`, which sets `backdrop-blur-xl`. A `backdrop-filter` creates a
**containing block for fixed-position descendants**, so `inset-0` resolved
against the 56px header box instead of the viewport — the panel was clipped to a
sliver and its links were unreachable.

**Fix:** the drawer is now rendered through `createPortal(..., document.body)`,
escaping the header's containing block (z-index raised to 100).

Verified: panel is 335×844 (fills viewport), `parentIsBody: true`, links
hit-testable, and tapping «منو» navigates to `/menu`.

## 4. Header pill reads «باز است»
`OpenStatus` now shows «باز است» / «بسته است» (was «باز» / «بسته»).

## 5. Performance

| Change | Saving |
| --- | --- |
| Subset fonts to Persian+Latin (811 → 557 glyphs) | 199 KB → 99 KB |
| Dropped the unused 500 weight (aliased to 400) | one less file |
| Deleted 4 orphaned logos (0 references) | −1.9 MB from the package |
| Brand photos JPG → WebP, resized | 572 KB → 290 KB |
| Logos → the pack's own `.webp` twins | 42 KB → 16 KB each |
| Hero: one `<picture>` w/ media sources | was downloading **both** crops |
| Inactive (CSS-hidden) logo variant → `loading="lazy"` | −16 KB/page |
| Below-fold product cards no longer `priority` | frees the critical path |
| `prefetch={false}` on always-mounted chrome | **16 → 6** RSC requests |
| SW: lean install + `requestIdleCallback` | no longer competes with first paint |
| `removeConsole`, immutable cache headers, font preload | — |

**Also fixed:** `sw.js` precached `/brand/logo-word.png`, which no longer
exists. A single missing URL makes `cache.addAll()` reject, so the app shell was
silently never being cached at all. Bumped to `delava-v2`.

### Measured (mobile 390×844, production build)

| | Before | After |
| --- | --- | --- |
| Requests | 46 | **31** |
| Transferred | 551 KB | **510 KB** |
| FCP (unthrottled) | 178 ms | **190 ms** |
| FCP (fast 3G, 1.6 Mbps) | 781 ms | **820 ms** |
| cPanel package | 7.0 MB | **4.7 MB** |

FCP is essentially unchanged because it was already fast; the wins are in
bandwidth and request count, which is what matters on real phones on Iranian
mobile data — and on repeat visits, where the font/image cache headers and a
working service worker now apply.

### Regression
8 widths × 6 routes × both themes + admin: **0 problems** — no overflow, no
sub-12.5px text, no tap target under 44px, no console/page errors.
