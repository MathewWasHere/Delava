"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useCurrentAdmin, usePermission } from "@/lib/use-roles";
import type { Permission } from "@/lib/roles";
import { Logo } from "@/components/brand/Logo";
import { useStore } from "@/lib/store";
import { toFa } from "@/lib/format";

/** Each entry declares the permission required to see it (item 18/22). */
const NAV: Array<{
  href: string;
  label: string;
  icon: IconName;
  badge?: boolean;
  permission: Permission;
}> = [
  { href: "/admin", label: "داشبورد", icon: "chart", permission: "dashboard.view" },
  { href: "/admin/orders", label: "سفارش‌های زنده", icon: "receipt", badge: true, permission: "orders.view" },
  { href: "/admin/driver", label: "پیک من", icon: "bike", permission: "driver.view" },
  { href: "/admin/products", label: "محصولات", icon: "box", permission: "products.view" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "grid", permission: "categories.edit" },
  { href: "/admin/customers", label: "مشتریان", icon: "user", permission: "customers.view" },
  { href: "/admin/discounts", label: "تخفیف‌ها", icon: "tag", permission: "discounts.edit" },
  { href: "/admin/delivery", label: "مناطق ارسال", icon: "bike", permission: "delivery.edit" },
  { href: "/admin/settings", label: "تنظیمات", icon: "settings", permission: "settings.view" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const newOrders = state.orders.filter((o) => o.status === "PENDING").length;
  const currentUser = useCurrentAdmin();
  const allow = usePermission();
  // Never render a link the current role cannot open (no dead nav items).
  const nav = NAV.filter((item) => allow(item.permission));

  return (
    <div className="min-h-screen bg-ink-950 lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-60 w-64 border-l border-[var(--surface-border)] bg-ink-900 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-13 items-center gap-2.5 border-b border-[var(--surface-border)] px-4 lg:h-14">
          <Logo width={58} withSub={false} href={nav[0]?.href ?? "/admin"} />
          <span className="rounded bg-flame-600/12 px-1.5 py-0.5 text-[9.5px] font-extrabold text-flame-600">
            ADMIN
          </span>
        </div>

        <nav className="space-y-0.5 p-2.5">
          {nav.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-bold transition-colors",
                  active
                    ? "bg-flame-600/10 text-flame-600"
                    : "text-mist-400 hover:bg-[var(--white-a4)] hover:text-mist-100",
                )}
              >
                <Icon name={item.icon} className="size-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && newOrders > 0 && (
                  <span className="num grid size-[18px] place-items-center rounded-full bg-flame-600 text-[10.5px] font-extrabold leading-none tabular-nums text-white">
                    <span className="block translate-y-[0.5px] leading-none">{toFa(newOrders)}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] px-3.5 py-2.5 text-[12px] font-bold text-mist-400 transition-colors hover:text-mist-100"
          >
            <Icon name="logout" className="size-4" />
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-55 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-50 flex h-13 items-center gap-2.5 border-b border-[var(--surface-border)] bg-[var(--scrim)] px-3 backdrop-blur-xl lg:h-14 lg:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="منو"
            className="grid size-9 place-items-center rounded-lg border border-[var(--surface-border)] text-mist-300 lg:hidden"
          >
            <Icon name="menu" className="size-[18px]" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-extrabold leading-tight text-mist-100">
              پنل مدیریت دلاوا
            </div>
            <div className="truncate text-[11px] leading-tight text-mist-500">
              فست فود دلاوا — فسا
            </div>
          </div>

          <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/8 px-2.5 py-1.5 text-[11px] font-bold text-emerald-600 md:flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500 text-emerald-500/45" />
            باز است
          </span>

          {/* Same theme system as the customer app. */}
          <ThemeToggle className="size-9" />

          {/* Current admin user — name + role, no avatar placeholder. */}
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--white-a4)] py-1 pl-2.5 pr-2.5">
            <div className="min-w-0 text-right leading-tight">
              <div className="truncate text-[12px] font-extrabold text-mist-100">
                {currentUser.name}
              </div>
              <div className="truncate text-[10.5px] text-flame-600">{currentUser.roleLabel}</div>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
