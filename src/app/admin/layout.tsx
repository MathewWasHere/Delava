"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/brand/Logo";
import { useStore } from "@/lib/store";
import { toFa } from "@/lib/format";

const NAV: Array<{ href: string; label: string; icon: IconName; badge?: boolean }> = [
  { href: "/admin", label: "داشبورد", icon: "chart" },
  { href: "/admin/orders", label: "سفارش‌های زنده", icon: "receipt", badge: true },
  { href: "/admin/products", label: "محصولات", icon: "box" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "grid" },
  { href: "/admin/customers", label: "مشتریان", icon: "user" },
  { href: "/admin/discounts", label: "تخفیف‌ها", icon: "tag" },
  { href: "/admin/delivery", label: "مناطق ارسال", icon: "bike" },
  { href: "/admin/settings", label: "تنظیمات", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const newOrders = state.orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-ink-950 lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-60 w-64 border-l border-[var(--surface-border)] bg-ink-900 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[var(--surface-border)] px-5">
          <Logo width={78} withSub={false} href="/admin" />
          <span className="rounded-md bg-flame-600/15 px-2 py-0.5 text-[10px] font-extrabold text-flame-400">
            ADMIN
          </span>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition-all",
                  active
                    ? "bg-flame-600/12 text-flame-400"
                    : "text-mist-400 hover:bg-[var(--white-a4)] hover:text-mist-100",
                )}
              >
                <Icon name={item.icon} className="size-4.5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && newOrders > 0 && (
                  <span className="num grid size-5 place-items-center rounded-full bg-flame-600 text-[10px] font-extrabold text-white">
                    {toFa(newOrders)}
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
        <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--scrim)] px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="منو"
            className="grid size-10 place-items-center rounded-xl border border-[var(--surface-border)] text-mist-300 lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <div className="flex-1">
            <div className="text-[13px] font-extrabold text-mist-100">پنل مدیریت دلاوا</div>
            <div className="text-[11px] text-mist-500">فست فود دلاوا — فسا</div>
          </div>
          <span className="hidden items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3 py-2 text-[11px] font-bold text-emerald-300 sm:flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            رستوران باز است
          </span>
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-flame-600 to-flame-800 text-[12px] font-extrabold text-white">
            م
          </span>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
