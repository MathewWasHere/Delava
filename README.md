# فست فود دلاوا — DELAVA Ordering Platform

A direct-ordering web app for **DELAVA (دلاوا)**, a real fast-food restaurant in Fasa, Fars, Iran.
Persian-first, RTL, mobile-first, installable as a PWA — built on the production architecture
so the Stage 1 prototype becomes the Stage 2 application without a rewrite.

![stack](https://img.shields.io/badge/Next.js-16-black) ![ts](https://img.shields.io/badge/TypeScript-strict-blue) ![tw](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (48 routes, type-checked)
```

```bash
npm run build:cpanel   # static export + .htaccess + delava-cpanel.zip for shared hosting
```

No environment variables are needed for the prototype — see `.env.example` for Stage 2.

Asset pipelines (re-runnable, only needed when source images change):

```bash
python3 scripts/convert-menu-images.py   # 27 menu photos -> WebP @2 sizes
python3 scripts/prepare-brand.py         # hero focal crops + PWA icons
python3 scripts/optimize-assets.py       # subset Vazirmatn to the used glyphs
```

---

## Routes

**Customer**

| Route | What it does |
| --- | --- |
| `/` | Hero built on the real storefront photo, categories, best-sellers, promo, tracking preview, location |
| `/menu` | Search + sort, sticky category nav (mobile), sidebar nav (desktop), floating cart bar |
| `/product/[slug]` | Gallery, ingredients, add-ons with live price, kitchen note, related items (SSG + JSON-LD) |
| `/cart` | Quantities, add-ons, coupon, live totals, empty state with upsell |
| `/checkout` | 4 steps: OTP login → address → delivery method → payment (gateway simulated) |
| `/orders`, `/order?id=` | Active vs. past orders, live timeline, ETA bar, invoice, one-tap reorder |
| `/account` | Profile, order history, addresses, favorites, DELAVA Rewards |
| `/auth`, `/about`, `/offline` | Login, brand story + contact, PWA offline shell |

**Admin** — `/admin`

Dashboard (KPIs, weekly revenue, status split, top products) · Live-orders kanban with guarded
status transitions and an order detail sheet · Products (inline availability/popular toggles,
full editor) · Categories (reorder, activate) · Customers (spend ranking) · Discounts ·
Delivery zones (fee / ETA / minimum) · Settings (roles, integrations, packaging QR).

---

## Brand

The wordmark in `public/brand/logo-word.png` is **extracted from the restaurant's own
channel-letter sign** — background removed, amber glow preserved — so the app carries the exact
mark that hangs over the terrace. Storefront and signage photos were AI-enhanced and colour
graded; all food photography was generated in one consistent style (black background, amber rim
light, shallow depth of field) to match.

Palette hierarchy: **BLACK → WHITE → ORANGE ACCENT** (`#FF7A00` / `#FF8A00` / `#E85F00`).
Typography: Vazirmatn, self-hosted. Currency is always `۲۸۵,۰۰۰ تومان`; dates are Jalali.

---

## Engineering notes

- **Pricing** (`src/lib/pricing.ts`) is written as a server module: it re-prices every line from
  the catalog, computes zone-based delivery, and validates coupons. The client uses it for
  optimistic display only.
- **Order state machine** (`src/lib/order-machine.ts`) — a `TRANSITIONS` table rejects illegal
  moves; the admin UI only renders legal next states.
- **Store** (`src/lib/store.tsx`) is the single action surface for the whole app. Swapping mock
  persistence for typed `fetch` calls is a one-file change.
- **Database** — `prisma/schema.prisma` is the real normalized schema (users, sessions, hashed
  OTPs, catalog, modifiers, orders, order events, payments, zones, drivers, coupons,
  notifications, audit log).
- **PWA** — manifest, icons, service worker (cache-first assets, network-first documents),
  offline page, standalone display, app shortcuts.
- **SEO** — per-page metadata, Open Graph, `Restaurant` and `Product` JSON-LD.
- **A11y** — semantic landmarks, labelled controls, visible focus rings, `prefers-reduced-motion`.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the money rules, order lifecycle, and the
remaining phases (backend → OTP → payment → realtime → notifications → hardening → deploy).

---

## Demo credentials

- OTP code: **۱۲۳۴۵** (any valid `09xxxxxxxxx` number)
- Coupon: **DELAVA10** (10% off, first order) or **FASA20**
- Admin panel: open `/admin` directly (auth arrives in Phase 7)
