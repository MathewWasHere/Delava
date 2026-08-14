"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CountBadge } from "@/components/ui";

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
                  "relative flex min-h-13 flex-col items-center justify-center gap-0.5 py-1.5 text-[12.5px] font-bold transition-colors",
                  active ? "text-flame-600" : "text-mist-400",
                )}
              >
                {active && (
                  <span className="absolute -top-px h-0.5 w-7 rounded-full bg-flame-600" />
                )}
                <span className="relative">
                  <Icon name={tab.icon} filled={active && tab.icon !== "cart"} className="size-[22px]" />
                  {tab.icon === "cart" && cartCount > 0 && (
                    <CountBadge value={cartCount} pulseKey={cartPulse} className="-top-2 -left-2.5" />
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
