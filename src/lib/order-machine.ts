import type { OrderStatus } from "@/lib/types";

/**
 * Explicit order state machine. Invalid transitions are rejected — the same
 * table is enforced server-side in Stage 2 before any status write.
 */
export const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "PAYMENT_FAILED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
  PAYMENT_FAILED: ["PENDING", "CANCELLED"],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export const STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "ثبت سفارش",
  CONFIRMED: "تأیید سفارش",
  PREPARING: "در حال آماده‌سازی",
  READY: "آماده تحویل",
  OUT_FOR_DELIVERY: "در مسیر",
  DELIVERED: "تحویل شد",
  CANCELLED: "لغو شد",
  PAYMENT_FAILED: "پرداخت ناموفق",
};

export const STATUS_SHORT: Record<OrderStatus, string> = {
  PENDING: "جدید",
  CONFIRMED: "تأیید شده",
  PREPARING: "آماده‌سازی",
  READY: "آماده",
  OUT_FOR_DELIVERY: "در مسیر",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
  PAYMENT_FAILED: "ناموفق",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "text-flame-400 bg-flame-500/10 border-flame-500/30",
  CONFIRMED: "text-sky-300 bg-sky-400/10 border-sky-400/30",
  PREPARING: "text-flame-400 bg-flame-500/10 border-flame-500/30",
  READY: "text-violet-300 bg-violet-400/10 border-violet-400/30",
  OUT_FOR_DELIVERY: "text-blue-300 bg-blue-400/10 border-blue-400/30",
  DELIVERED: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
  CANCELLED: "text-red-300 bg-red-400/10 border-red-400/30",
  PAYMENT_FAILED: "text-red-300 bg-red-400/10 border-red-400/30",
};

export function statusIndex(status: OrderStatus): number {
  return STATUS_FLOW.indexOf(status);
}

/** Natural-sounding sentence for the customer tracking screen. */
export const STATUS_SENTENCE: Record<OrderStatus, string> = {
  PENDING: "سفارش شما ثبت شد و در انتظار تأیید رستوران است.",
  CONFIRMED: "سفارش شما توسط دلاوا تأیید شد.",
  PREPARING: "سفارش شما در حال آماده‌سازی است.",
  READY: "سفارش شما آماده است و منتظر پیک می‌ماند.",
  OUT_FOR_DELIVERY: "پیک دلاوا سفارش شما را برداشت و در راه است.",
  DELIVERED: "سفارش شما تحویل داده شد. نوش جان! 🎉",
  CANCELLED: "این سفارش لغو شده است.",
  PAYMENT_FAILED: "پرداخت این سفارش ناموفق بود.",
};

/* --------------------------------------------------------------------------
 * SEMANTIC ACTION COLOURS (admin)
 *
 * Colour carries meaning here rather than decoration, so an operator can scan
 * the board without reading every label:
 *   green   -> forward progress / success  (confirm, ready, delivered)
 *   red     -> failure / cancellation
 *   neutral -> contextual, non-committal   (back to pending, etc.)
 * ------------------------------------------------------------------------ */

export type ActionTone = "positive" | "negative" | "neutral";

export const STATUS_ACTION_TONE: Record<OrderStatus, ActionTone> = {
  PENDING: "neutral",
  CONFIRMED: "positive",
  PREPARING: "neutral",
  READY: "positive",
  OUT_FOR_DELIVERY: "neutral",
  DELIVERED: "positive",
  CANCELLED: "negative",
  PAYMENT_FAILED: "negative",
};

/** Solid, high-contrast button styles for the live-orders board. */
export const ACTION_BUTTON_CLASS: Record<ActionTone, string> = {
  positive:
    "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline-emerald-400 border border-emerald-500/60",
  negative:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-400 border border-red-500/60",
  neutral:
    "bg-ink-700 text-mist-100 hover:bg-ink-600 focus-visible:outline-mist-400 border border-[var(--surface-border-strong)]",
};

/** Quieter badge styles (status chips) using the same semantics. */
export const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/12 text-amber-600 border-amber-500/35",
  CONFIRMED: "bg-emerald-500/12 text-emerald-600 border-emerald-500/35",
  PREPARING: "bg-flame-600/12 text-flame-600 border-flame-600/35",
  READY: "bg-emerald-500/18 text-emerald-600 border-emerald-500/45",
  OUT_FOR_DELIVERY: "bg-sky-500/12 text-sky-600 border-sky-500/35",
  DELIVERED: "bg-emerald-600/18 text-emerald-700 border-emerald-600/45",
  CANCELLED: "bg-red-500/12 text-red-600 border-red-500/35",
  PAYMENT_FAILED: "bg-red-600/15 text-red-600 border-red-600/45",
};
