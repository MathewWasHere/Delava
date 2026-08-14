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
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-extrabold text-mist-100">داشبورد</h1>
          <p className="mt-0.5 text-[11.5px] text-mist-500">نمای کلی عملکرد امروز رستوران</p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-lg bg-flame-600 px-3 py-2 text-[12px] font-extrabold text-white transition-colors hover:bg-flame-500"
        >
          مدیریت سفارش‌های زنده
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard icon="tag" label="فروش امروز" value={`${faNumber(stats.revenue)}`} unit="تومان" trend="+۱۲٪" />
        <StatCard icon="receipt" label="سفارش‌های امروز" value={toFa(stats.count)} unit="سفارش" trend="+۵٪" />
        <StatCard icon="chart" label="میانگین سبد" value={faNumber(stats.aov)} unit="تومان" trend="+۳٪" />
        <StatCard icon="bike" label="تحویل‌شده امروز" value={toFa(stats.delivered)} unit="سفارش" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        {/* Weekly revenue */}
        <div className="rounded-xl border border-[var(--surface-border)] bg-ink-900 p-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-extrabold text-mist-100">درآمد هفته</h2>
            <span className="num text-[11px] text-mist-500">تومان</span>
          </div>
          <div className="mt-3 flex h-32 items-end justify-between gap-1.5">
            {week.map((w, i) => (
              <div key={w.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="num text-[10px] text-mist-500 opacity-0 transition-opacity group-hover:opacity-100">
                  {faNumber(Math.round(w.value / 1000))}k
                </span>
                <div
                  className={cn(
                    "w-full min-h-1 rounded-t-lg transition-all duration-500",
                    i === week.length - 2
                      ? "bg-flame-600 shadow-[0_-6px_24px_-6px_rgba(194,13,0,0.7)]"
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
        <div className="rounded-xl border border-[var(--surface-border)] bg-ink-900 p-3.5">
          <h2 className="text-[13px] font-extrabold text-mist-100">سفارش‌ها بر اساس وضعیت</h2>
          <div className="mt-3 space-y-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "w-[70px] shrink-0 rounded border px-1.5 py-0.5 text-center text-[10.5px] font-bold",
                    STATUS_TONE[status as keyof typeof STATUS_TONE],
                  )}
                >
                  {STATUS_SHORT[status as keyof typeof STATUS_SHORT]}
                </span>
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--white-a6)]">
                  <div
                    className="h-full rounded-full bg-flame-600/70"
                    style={{ width: `${(count / orders.length) * 100}%` }}
                  />
                </div>
                <span className="num w-5 shrink-0 text-left text-[11.5px] font-bold text-mist-100">{toFa(count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        {/* Live orders */}
        <div className="rounded-xl border border-[var(--surface-border)] bg-ink-900 p-3.5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[13px] font-extrabold text-mist-100">
              <span className="size-2 animate-pulse-dot rounded-full bg-flame-500" />
              سفارش‌های در جریان
            </h2>
            <Link href="/admin/orders" className="-my-2 inline-flex min-h-9 shrink-0 items-center text-[11.5px] font-bold text-flame-600">
              همه ←
            </Link>
          </div>
          <div className="mt-3 space-y-1.5">
            {live.length === 0 && (
              <p className="py-6 text-center text-[12.5px] text-mist-500">سفارش فعالی وجود ندارد.</p>
            )}
            {live.map((o) => (
              /* Two-line row. The single flex line used to overflow: the item
                 list has no natural width limit, and the price + status chips
                 are shrink-resistant, so the row pushed past its container.
                 Now the meta sits on its own line and every flexible cell has
                 min-w-0 + truncate. */
              <Link
                key={o.id}
                href="/admin/orders"
                className="block rounded-lg border border-[var(--surface-border)] bg-ink-850 px-2.5 py-2 transition-colors hover:border-flame-600/40"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="num shrink-0 text-[12.5px] font-extrabold text-mist-100">
                    #{toFa(o.number)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-mist-400">
                    {o.customer.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold",
                      STATUS_TONE[o.status],
                    )}
                  >
                    {STATUS_SHORT[o.status]}
                  </span>
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-[11px] text-mist-500">
                    {o.items.map((i) => i.name).join("، ")}
                  </span>
                  <span className="num shrink-0 text-[11px] text-mist-500">
                    {faTime(o.createdAt)}
                  </span>
                  <span className="num shrink-0 text-[12px] font-bold text-flame-600">
                    {faNumber(o.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-[var(--surface-border)] bg-ink-900 p-3.5">
          <h2 className="text-[13px] font-extrabold text-mist-100">پرفروش‌ترین محصولات</h2>
          <div className="mt-2.5 space-y-1.5">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex min-w-0 items-center gap-2">
                <span className="num w-3.5 shrink-0 text-[11px] font-extrabold text-mist-500">{toFa(i + 1)}</span>
                <Image src={p.image} alt="" aria-hidden="true" width={28} height={28} className="size-7 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11.5px] font-bold leading-tight text-mist-100">{p.name}</div>
                  <div className="num text-[10px] leading-tight text-mist-500">{toFa(p.qty)} فروش</div>
                </div>
                <span className="num shrink-0 text-[11.5px] font-bold text-flame-600">{faNumber(p.revenue)}</span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 rounded-lg border border-[var(--surface-border)] bg-ink-850 px-2.5 py-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-mist-400">محصولات ناموجود</span>
              <span className="num font-bold text-flame-600">
                {toFa(products.filter((p) => !p.available).length)}
              </span>
            </div>
            <Link href="/admin/products" className="mt-1.5 inline-flex min-h-9 items-center text-[11px] font-bold text-flame-600">
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
    /* Horizontal row: the icon sits beside the value instead of stacking above
       it, which removes ~40px of dead height per card without shrinking text. */
    <div className="flex items-center gap-2.5 rounded-lg border border-[var(--surface-border)] bg-ink-900 px-3 py-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-flame-600/10 text-flame-600">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1">
          <span className="num truncate text-[17px] font-extrabold leading-none text-mist-100">
            {value}
          </span>
          <span className="shrink-0 text-[10px] text-mist-500">{unit}</span>
        </div>
        <div className="mt-1 truncate text-[10.5px] text-mist-500">{label}</div>
      </div>
      {trend && (
        <span className="num shrink-0 rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
          {trend}
        </span>
      )}
    </div>
  );
}
