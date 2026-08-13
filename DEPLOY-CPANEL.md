# 🚀 آپلود دلاوا روی cPanel — Deploy guide

Ready-to-upload package: **`delava-cpanel.zip`** (6 MB, 254 files)

No Node.js, no database, no terminal. It is plain HTML/CSS/JS and runs on the
cheapest shared hosting.

---

## Upload in 5 steps

1. **cPanel → File Manager**
2. Open **`public_html`**
   *(for a subfolder demo use `public_html/delava` — all links are relative, it still works)*
3. **Upload** → choose `delava-cpanel.zip`
4. Right-click the uploaded zip → **Extract**
5. Delete the zip

Open your domain. Done.

> **Check `.htaccess` exists after extracting.**
> File Manager hides dotfiles by default: **Settings → Show Hidden Files**.

---

## ⚠️ Turn on HTTPS

cPanel → **SSL/TLS Status** → **Run AutoSSL**.

Without HTTPS Android will not offer "Install app", and the offline mode is
disabled by the browser. Everything else still works.

---

## What's inside

| | |
| --- | --- |
| `index.html`, `menu/`, `cart/`, `checkout/`, `admin/` … | every page, pre-rendered |
| `_next/` | JS + CSS bundles (hashed, cached 1 year) |
| `food/`, `brand/`, `icons/` | photography and the DELAVA logo |
| `manifest.webmanifest`, `sw.js` | PWA — installable + offline |
| `.htaccess` | routing, HTTPS redirect, gzip, caching, security headers |
| `UPLOAD-GUIDE.md` | this guide, inside the zip |

The `.htaccess` handles clean URLs (`/menu` → `/menu/index.html`), forces HTTPS,
gzips text assets, caches immutable bundles for a year, and never caches `sw.js`
so updates ship immediately.

---

## Rebuilding after changes

```bash
npm run build:cpanel
```

Produces a fresh `out/` folder and `delava-cpanel.zip`. Your development setup is
untouched — the script swaps the export config in and out automatically.

---

## Showing the client

| What | How |
| --- | --- |
| Customer app | Open the domain **on a phone** — this is the real experience |
| Install as app | Chrome ⋮ → *Install app* → DELAVA icon on the home screen |
| Login | Any `09xxxxxxxxx`, OTP **۱۲۳۴۵** |
| Coupons | `DELAVA10` (10% first order) or `FASA20` |
| Kitchen view | `yourdomain.com/admin` → **سفارش‌های زنده** |

---

## Be honest with the client about this stage

This is a **fully working prototype**, not the finished system.

**Works now:** the entire ordering journey, the menu, the cart, OTP screens,
address book, order tracking, reorder, loyalty, and the full admin panel.

**Not yet real:** orders live in each visitor's own browser (localStorage).
A customer's order does **not** reach the restaurant's screen, the OTP is not a
real SMS, and payment is simulated.

That requires Stage 2 — PostgreSQL, real OTP via an Iranian SMS provider,
Zarinpal payments, and live sync between the customer and the kitchen. Stage 2
needs Node.js hosting or a small VPS; basic shared hosting cannot run it.
The database schema and the architecture for all of it are already written
(`prisma/schema.prisma`, `ARCHITECTURE.md`), so it is a build, not a redesign.
