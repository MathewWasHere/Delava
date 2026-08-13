"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { toFa } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";

const TABS: Array<{ href: string; label: string; icon: IconName; match: (p: string) => boolean }> = [
  { href: "/", label: "خانه", icon: "home", match: (p) => p === "/" },
  { href: "/menu", label: "منو", icon: "menu", match: (p) => p.startsWith("/menu") || p.startsWith("/product") },
  { href: "/cart", label: "سبد خرید", icon: "cart", match: (p) => p.startsWith("/cart") || p.startsWith("/checkout") },
  { href: "/orders", label: "سفارش‌ها", icon: "receipt", match: (p) => p.startsWith("/orders") },
  { href: "/account", label: "حساب", icon: "user", match: (p) => p.startsWith("/account") || p.startsWith("/auth") },
];

export function BottomNav() {
  const pathname = usePathname();
  const { cartCount, cartPulse } = useStore();

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-[var(--surface-border)] bg-ink-950/95 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href} className="flex-1">
              <Link
              prefetch={false}
                href={tab.href}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[13px] font-bold transition-colors",
                  active ? "text-flame-500" : "text-mist-500",
                )}
              >
                {active && (
                  <span className="absolute -top-px h-0.5 w-8 rounded-full bg-flame-500 shadow-[0_0_14px_rgba(255,138,0,1)]" />
                )}
                <span className="relative">
                  <Icon name={tab.icon} filled={active && tab.icon !== "cart"} className="size-6.5" />
                  {tab.icon === "cart" && cartCount > 0 && (
                    <span
                      key={cartPulse}
                      className="num absolute -top-1.5 -left-2 grid min-w-4.5 animate-pop place-items-center rounded-full bg-flame-600 px-1 text-[9px] font-extrabold text-white"
                    >
                      {toFa(cartCount)}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
