"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { faNumber, faTime, toFa } from "@/lib/format";
import { STATUS_SHORT, STATUS_TONE } from "@/lib/order-machine";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { products } from "@/lib/data/catalog";
import { useNow } from "@/lib/use-now";

export default function AdminDashboard() {
  const { state } = useStore();
  const orders = state.orders;
  const now = useNow(60_000);

  const stats = useMemo(() => {
    const today = now === 0 ? orders : orders.filter((o) => now - o.createdAt < 86_400_000);
    const revenue = today.reduce((s, o) => s + (o.status === "CANCELLED" ? 0 : o.total), 0);
    const aov = today.length ? Math.round(revenue / today.length) : 0;
    const delivered = today.filter((o) => o.status === "DELIVERED").length;
    return { count: today.length, revenue, aov, delivered };
  }, [orders, now]);

  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => (map[o.status] = (map[o.status] ?? 0) + 1));
    return map;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; image: string; qty: number; revenue: number }>();
    orders.forEach((o) =>
      o.items.forEach((i) => {
        const cur = map.get(i.productId) ?? { name: i.name, image: i.image, qty: 0, revenue: 0 };
        cur.qty += i.quantity;
        cur.revenue += i.lineTotal;
        map.set(i.productId, cur);
      }),
    );
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const week = useMemo(() => {
    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
    const base = [4.2, 3.1, 3.8, 4.6, 6.9, 8.4, 7.2];
    return days.map((d, i) => ({ day: d, value: Math.round(base[i] * 1_000_000) }));
  }, []);
  const maxWeek = Math.max(...week.map((w) => w.value));

  const live = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-mist-100">داشبورد</h1>
          <p className="mt-1 text-[12px] text-mist-500">نمای کلی عملکرد امروز رستوران</p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-xl bg-gradient-to-l from-flame-700 to-flame-500 px-4 py-2.5 text-[12px] font-extrabold text-white"
        >
          مدیریت سفارش‌های زنده
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="tag" label="فروش امروز" value={`${faNumber(stats.revenue)}`} unit="تومان" trend="+۱۲٪" />
        <StatCard icon="receipt" label="سفارش‌های امروز" value={toFa(stats.count)} unit="سفارش" trend="+۵٪" />
        <StatCard icon="chart" label="میانگین سبد" value={faNumber(stats.aov)} unit="تومان" trend="+۳٪" />
        <StatCard icon="bike" label="تحویل‌شده امروز" value={toFa(stats.delivered)} unit="سفارش" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {/* Weekly revenue */}
        <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-extrabold text-mist-100">درآمد هفته</h2>
            <span className="num text-[11px] text-mist-500">تومان</span>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-2">
            {week.map((w, i) => (
              <div key={w.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="num text-[10px] text-mist-500 opacity-0 transition-opacity group-hover:opacity-100">
                  {faNumber(Math.round(w.value / 1000))}k
                </span>
                <div
                  className={cn(
                    "w-full min-h-1 rounded-t-lg transition-all duration-500",
                    i === week.length - 2
                      ? "bg-gradient-to-t from-flame-700 to-flame-400 shadow-[0_-6px_24px_-6px_rgba(255,122,0,0.7)]"
                      : "bg-[var(--white-a10)] group-hover:bg-flame-600/50",
                  )}
                  style={{ height: `${Math.max(4, (w.value / maxWeek) * 100)}%` }}
                />
                <span className="text-[10px] text-mist-500">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
          <h2 className="text-[14px] font-extrabold text-mist-100">سفارش‌ها بر اساس وضعیت</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-24 rounded-lg border px-2 py-1 text-center text-[11px] font-bold",
                    STATUS_TONE[status as keyof typeof STATUS_TONE],
                  )}
                >
                  {STATUS_SHORT[status as keyof typeof STATUS_SHORT]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--white-a6)]">
                  <div
                    className="h-full rounded-full bg-flame-600/70"
                    style={{ width: `${(count / orders.length) * 100}%` }}
                  />
                </div>
                <span className="num w-6 text-left text-[12px] font-bold text-mist-100">{toFa(count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {/* Live orders */}
        <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[14px] font-extrabold text-mist-100">
              <span className="size-2 animate-pulse-dot rounded-full bg-flame-500" />
              سفارش‌های در جریان
            </h2>
            <Link href="/admin/orders" className="text-[12px] font-bold text-flame-400">
              همه ←
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {live.length === 0 && (
              <p className="py-8 text-center text-[13px] text-mist-500">سفارش فعالی وجود ندارد.</p>
            )}
            {live.map((o) => (
              <Link
                key={o.id}
                href="/admin/orders"
                className="flex items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-3 transition-colors hover:border-flame-600/40"
              >
                <span className="num text-[13px] font-extrabold text-mist-100">#{toFa(o.number)}</span>
                <span className="min-w-0 flex-1 truncate text-[12px] text-mist-400">
                  {o.customer.name} — {o.items.map((i) => i.name).join("، ")}
                </span>
                <span className="num hidden text-[11px] text-mist-500 sm:block">{faTime(o.createdAt)}</span>
                <span className="num text-[12px] font-bold text-flame-400">{faNumber(o.total)}</span>
                <span className={cn("rounded-lg border px-2 py-1 text-[10px] font-bold", STATUS_TONE[o.status])}>
                  {STATUS_SHORT[o.status]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
          <h2 className="text-[14px] font-extrabold text-mist-100">پرفروش‌ترین محصولات</h2>
          <div className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="num w-4 text-[12px] font-extrabold text-mist-500">{toFa(i + 1)}</span>
                <Image src={p.image} alt={p.name} width={36} height={36} className="size-9 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-bold text-mist-100">{p.name}</div>
                  <div className="num text-[10px] text-mist-500">{toFa(p.qty)} فروش</div>
                </div>
                <span className="num text-[12px] font-bold text-flame-400">{faNumber(p.revenue)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-mist-400">محصولات ناموجود</span>
              <span className="num font-bold text-red-400">
                {toFa(products.filter((p) => !p.available).length)}
              </span>
            </div>
            <Link href="/admin/products" className="mt-2 block text-[11px] font-bold text-flame-400">
              مدیریت موجودی ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  trend,
}: {
  icon: IconName;
  label: string;
  value: string;
  unit: string;
  trend?: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--surface-border)] bg-gradient-to-b from-ink-850 to-ink-900 p-5">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-2xl bg-flame-600/12 text-flame-500">
          <Icon name={icon} className="size-5" />
        </span>
        {trend && (
          <span className="num rounded-lg bg-emerald-500/12 px-2 py-1 text-[10px] font-bold text-emerald-300">
            {trend}
          </span>
        )}
      </div>
      <div className="num mt-4 text-2xl font-extrabold text-mist-100">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-mist-500">
        <span>{label}</span>
        <span className="text-mist-500">· {unit}</span>
      </div>
    </div>
  );
}
