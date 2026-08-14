"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { STATUS_FLOW, STATUS_SHORT, STATUS_SENTENCE, statusIndex } from "@/lib/order-machine";
import { toFa } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { StepCircle } from "@/components/order/OrderTimeline";
import type { Order } from "@/lib/types";

/**
 * LIVE ORDER BANNER — sits above the hero while an order is in flight.
 *
 * Modelled on the "active delivery" cards in mature food-delivery apps: a
 * single high-signal strip that answers "where is my food?" at a glance, with
 * a compact step rail and an ETA. Prominent, but it never becomes a wall — it
 * collapses to one row of essentials on small phones.
 */

const ACTIVE: ReadonlyArray<Order["status"]> = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
];

function pickActiveOrder(orders: Order[]): Order | null {
  const live = orders.filter((o) => ACTIVE.includes(o.status));
  if (live.length === 0) return null;
  return live.reduce((a, b) => (b.createdAt > a.createdAt ? b : a));
}

export function LiveOrderBanner() {
  const { state } = useStore();
  const now = useNow(30_000);
  const order = pickActiveOrder(state.orders);

  if (!order) return null;

  const steps = order.deliveryMethod === "PICKUP"
    ? STATUS_FLOW.filter((s) => s !== "OUT_FOR_DELIVERY")
    : STATUS_FLOW;

  const current = statusIndex(order.status);
  const stepNo = steps.findIndex((s) => s === order.status) + 1;
  const progress = Math.max(6, Math.round((stepNo / steps.length) * 100));

  // ETA — guarded so it never renders a negative number.
  const elapsedMin = now > 0 ? Math.floor((now - order.createdAt) / 60_000) : 0;
  const remaining = Math.max(0, order.etaMinutes - elapsedMin);

  const outForDelivery = order.status === "OUT_FOR_DELIVERY";
  const ready = order.status === "READY";

  return (
    <section className="border-b border-[var(--surface-border)] bg-ink-900">
      <div className="shell py-2 sm:py-4">
        <Link
          href={`/order?id=${order.id}`}
          prefetch={false}
          className="group block rounded-xl border border-flame-600/30 bg-ink-850 p-2.5 transition-colors hover:border-flame-600/55 sm:rounded-2xl sm:p-4"
        >
          {/* ---- Row 1: identity + status ---- */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span
              className={cn(
                "relative grid size-9 shrink-0 place-items-center rounded-full sm:size-11",
                outForDelivery || ready
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-flame-600/15 text-flame-500",
              )}
            >
              <Icon name={outForDelivery ? "bike" : ready ? "check" : "clock"} className="size-4 sm:size-5" />
              <span className="absolute inset-0 animate-ping-slow rounded-full ring-2 ring-flame-500/30" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-extrabold tracking-wide text-flame-500">
                  سفارش فعال
                </span>
                <span className="num text-[12.5px] text-mist-500">#{toFa(order.number)}</span>
              </div>
              <p className="mt-0.5 truncate text-[14px] font-extrabold text-mist-100">
                {STATUS_SENTENCE[order.status]}
              </p>
            </div>

            {/* ETA — the single most useful number, so it gets its own slot. */}
            <div className="shrink-0 text-left">
              {remaining > 0 ? (
                <>
                  <div className="num text-[17px] font-extrabold leading-none text-flame-500 sm:text-[19px]">
                    {toFa(remaining)}
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-none text-mist-500 sm:mt-1">دقیقه</div>
                </>
              ) : (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[12.5px] font-bold text-emerald-500">
                  {STATUS_SHORT[order.status]}
                </span>
              )}
            </div>
          </div>

          {/* ---- Row 2: step rail (compact on phones, labelled from sm) ---- */}
          <div className="mt-2 sm:mt-3.5">
            {/* Progress bar for the tightest widths */}
            <div className="h-1 overflow-hidden rounded-full bg-[var(--white-a10)] sm:hidden">
              <div
                className="h-full rounded-full bg-flame-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px] leading-none text-mist-500 sm:hidden">
              <span>
                مرحله <span className="num">{toFa(stepNo)}</span> از{" "}
                <span className="num">{toFa(steps.length)}</span>
              </span>
              <span className="font-bold text-flame-500">پیگیری سفارش ←</span>
            </div>

            {/* Full rail from sm up */}
            <div className="hidden items-center sm:flex">
              {steps.map((s, i) => {
                const idx = STATUS_FLOW.indexOf(s);
                const state = idx < current ? "done" : idx === current ? "active" : "todo";
                return (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <StepCircle state={state} className="size-7" />
                      <span
                        className={cn(
                          "whitespace-nowrap text-[12.5px] font-bold",
                          state === "todo" ? "text-mist-500" : "text-mist-200",
                        )}
                      >
                        {STATUS_SHORT[s]}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mx-1.5 mb-5 h-0.5 flex-1 rounded-full",
                          idx < current ? "bg-emerald-500/45" : "bg-[var(--white-a10)]",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
