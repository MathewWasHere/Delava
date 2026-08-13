"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { toFa } from "@/lib/format";
import { RESTAURANT } from "@/lib/data/catalog";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle, ThemeSwitch } from "@/components/theme/ThemeToggle";
import { OpenStatus } from "@/components/shell/OpenStatus";

const LINKS = [
  { href: "/", label: "خانه" },
  { href: "/menu", label: "منو" },
  { href: "/orders", label: "سفارش‌ها" },
  { href: "/about", label: "درباره دلاوا" },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, cartPulse, state } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer is closed by the links themselves (onClick below) rather than by
  // an effect watching the pathname, which would cause a cascading render.

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-xl transition-all duration-300",
        // The bar always carries its own themed surface. It previously forced a
        // dark palette while unscrolled, which broke contrast in light mode
        // whenever the first section below it was light (e.g. the live-order
        // banner). A translucent themed scrim is correct over both.
        scrolled
          ? "border-b border-[var(--surface-border)] bg-[var(--scrim)] shadow-[0_2px_16px_-8px_rgba(0,0,0,0.25)]"
          : "border-b border-transparent bg-[var(--scrim)]/85",
      )}
    >
      <div>
        <div className="shell flex h-14 items-center gap-1.5 sm:h-[72px] sm:gap-3">
          <Logo width={72} withSub={false} />

          <nav className="mr-4 hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  className={cn(
                    "relative flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium transition-colors",
                    active ? "text-mist-100" : "text-mist-400 hover:text-mist-100",
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-flame-500 shadow-[0_0_12px_rgba(238,109,27,0.9)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
            {/* Open/closed indicator — moved out of the hero (item 3). */}
            <OpenStatus />

            <a
              href={`tel:${RESTAURANT.phone}`}
              className="hidden min-h-11 items-center gap-2 rounded-xl border border-flame-600/25 bg-flame-600/8 px-3 text-[13px] font-bold text-flame-500 transition-colors hover:bg-flame-600/15 xl:inline-flex"
            >
              <Icon name="phone" className="size-4" />
              <span className="num" dir="ltr">
                {toFa(RESTAURANT.phoneDisplay)}
              </span>
            </a>

            <ThemeToggle className="hidden sm:grid" />

            <Link
              href={state.user ? "/account" : "/auth"}
              prefetch={false}
              aria-label="حساب کاربری"
              className="hidden size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a6)] text-mist-200 transition-colors hover:border-flame-600/40 hover:text-mist-100 sm:grid"
            >
              <Icon name="user" className="size-5" />
            </Link>

            <Link
              href="/cart"
              prefetch={false}
              aria-label={`سبد خرید، ${cartCount} کالا`}
              className="relative grid size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a6)] text-mist-200 transition-colors hover:border-flame-600/40 hover:text-mist-100"
            >
              <Icon name="cart" className="size-5" />
              {cartCount > 0 && (
                <span
                  key={cartPulse}
                  className="num absolute -top-1.5 -left-1.5 grid min-w-5 animate-pop place-items-center rounded-full bg-flame-600 px-1 text-[13px] font-extrabold text-white"
                >
                  {toFa(cartCount)}
                </span>
              )}
            </Link>

            <Link
              href="/menu"
              className="hidden h-11 items-center rounded-xl bg-gradient-to-l from-flame-700 to-flame-500 px-5 text-[13px] font-bold text-white transition-all hover:brightness-110 lg:inline-flex"
            >
              سفارش آنلاین
            </Link>

            {/* Hamburger — phones & tablets */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="منوی اصلی"
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a6)] text-mist-200 transition-colors hover:border-flame-600/40 hover:text-mist-100 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile drawer ----------------
          Rendered through a portal onto <body>. The header sets
          `backdrop-blur`, and a backdrop-filter establishes a containing block
          for fixed-position descendants — so a drawer nested inside the header
          would be clipped to the 56px bar instead of filling the viewport. */}
      {menuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-ink-900 shadow-2xl animate-slide-in-right">
            <div className="flex h-14 items-center justify-between border-b border-[var(--hairline)] px-4">
              <Logo width={86} withSub={false} priority={false} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="بستن منو"
                className="grid size-11 place-items-center rounded-xl text-mist-400 hover:text-mist-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  className="size-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-1">
                {LINKS.map((l) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-3.5 text-[15px] font-bold transition-colors",
                        active
                          ? "bg-flame-600/12 text-flame-500"
                          : "text-mist-200 hover:bg-[var(--white-a6)]",
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <Link
                  href={state.user ? "/account" : "/auth"}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3.5 text-[15px] font-bold text-mist-200 transition-colors hover:bg-[var(--white-a6)]"
                >
                  {state.user ? "حساب کاربری" : "ورود / ثبت‌نام"}
                </Link>
              </div>

              <div className="mt-5 border-t border-[var(--hairline)] pt-5">
                <div className="mb-2.5 text-[12px] font-bold text-mist-500">حالت نمایش</div>
                <ThemeSwitch />
              </div>

              <div className="mt-5 border-t border-[var(--hairline)] pt-5">
                <a
                  href={`tel:${RESTAURANT.phone}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center gap-2.5 rounded-xl border border-flame-600/25 bg-flame-600/8 px-3.5 text-[14px] font-bold text-flame-500"
                >
                  <Icon name="phone" className="size-4 shrink-0" />
                  <span className="num" dir="ltr">
                    {toFa(RESTAURANT.phoneDisplay)}
                  </span>
                </a>
              </div>
            </nav>

            <div className="border-t border-[var(--hairline)] p-4">
              <Link
                href="/menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-13 items-center justify-center rounded-xl bg-gradient-to-l from-flame-700 to-flame-500 text-[15px] font-bold text-white"
              >
                سفارش آنلاین
              </Link>
            </div>
          </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
