"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { faNumber, toEn, toFa } from "@/lib/format";

/* ------------------------------- Price -------------------------------- */

export function Price({
  value,
  compareAt,
  size = "md",
  className,
}: {
  value: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "text-[14px]",
    md: "text-[16px]",
    lg: "text-lg",
    xl: "text-2xl",
  } as const;
  return (
    <span className={cn("inline-flex shrink-0 items-baseline gap-1 whitespace-nowrap num", className)}>
      {compareAt && compareAt > value ? (
        <span className="text-mist-500 line-through text-[13px] decoration-flame-600/70">
          {faNumber(compareAt)}
        </span>
      ) : null}
      <span className={cn("font-extrabold text-mist-100", sizes[size])}>{faNumber(value)}</span>
      <span className="text-[13px] text-mist-400 font-medium">تومان</span>
    </span>
  );
}

/* ------------------------------- Badge -------------------------------- */

export function Badge({
  children,
  tone = "flame",
  className,
}: {
  children: React.ReactNode;
  tone?: "flame" | "neutral" | "success" | "danger" | "custom";
  className?: string;
}) {
  const tones = {
    flame: "bg-flame-600/15 text-flame-400 border-flame-600/30",
    neutral: "bg-[var(--white-a6)] text-mist-200 border-[var(--surface-border)]",
    success: "bg-emerald-500/12 text-emerald-300 border-emerald-500/30",
    danger: "bg-red-500/12 text-red-300 border-red-500/30",
    custom: "",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[13px] font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------- Input -------------------------------- */

export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-mist-200">
        {label}
        {required && <span className="text-flame-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[13px] text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-mist-500">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({
  className,
  invalid,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border bg-ink-850 px-4 text-[15px] text-mist-100 placeholder:text-mist-500",
        "transition-colors focus:border-flame-600/70 focus:bg-ink-800 outline-none",
        invalid ? "border-red-500/50" : "border-[var(--surface-border)]",
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4 text-[15px] text-mist-100",
        "placeholder:text-mist-500 transition-colors focus:border-flame-600/70 focus:bg-ink-800 outline-none",
        className,
      )}
      {...rest}
    />
  );
}

/* ------------------------------ OTP Input ------------------------------ */

export function OTPInput({
  length = 5,
  value,
  onChange,
  onComplete,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const id = useId();

  const setChar = (index: number, char: string) => {
    const digits = toEn(char).replace(/\D/g, "");
    if (!digits) return;
    const next = (value.slice(0, index) + digits + value.slice(index + digits.length))
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(next);
    const focus = Math.min(index + digits.length, length - 1);
    refs.current[focus]?.focus();
    if (next.length === length) onComplete?.(next);
  };

  return (
    <div dir="ltr" className="flex justify-center gap-2.5">
      {Array.from({ length }).map((_, i) => (
        <input
          key={`${id}-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`رقم ${i + 1} کد تأیید`}
          value={value[i] ? toFa(value[i]) : ""}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              const next = value.slice(0, Math.max(0, i - (value[i] ? 0 : 1))) + value.slice(i + 1);
              onChange(next);
              refs.current[Math.max(0, i - (value[i] ? 0 : 1))]?.focus();
            }
            if (e.key === "ArrowLeft") refs.current[i + 1]?.focus();
            if (e.key === "ArrowRight") refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            setChar(0, e.clipboardData.getData("text"));
          }}
          className={cn(
            "h-15 w-13 rounded-2xl border bg-ink-850 text-center text-2xl font-bold text-mist-100 outline-none transition-all",
            value[i] ? "border-flame-600 bg-flame-600/5 shadow-[0_0_24px_-8px_rgba(255,122,0,0.8)]" : "border-[var(--surface-border)]",
            "focus:border-flame-500",
          )}
        />
      ))}
    </div>
  );
}

/* -------------------------- Quantity selector -------------------------- */

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm"
      ? "size-11 text-lg rounded-lg"
      : "size-12 text-xl rounded-xl";
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-1">
      <button
        type="button"
        aria-label="افزایش تعداد"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(btn, "grid place-items-center text-flame-400 transition-colors hover:bg-flame-600/15")}
      >
        +
      </button>
      <span className={cn("num min-w-8 text-center font-bold text-mist-100", size === "sm" ? "text-[15px]" : "text-base")}>
        {toFa(value)}
      </span>
      <button
        type="button"
        aria-label={value === min ? "حذف" : "کاهش تعداد"}
        onClick={() => onChange(value - 1)}
        className={cn(btn, "grid place-items-center text-mist-200 transition-colors hover:bg-[var(--white-a8)]")}
      >
        {value === min ? "🗑" : "−"}
      </button>
    </div>
  );
}

/* ------------------------------- Modal --------------------------------- */

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full animate-sheet-in overflow-hidden rounded-t-[28px] border border-[var(--surface-border)] bg-ink-900",
          "sm:rounded-[28px]",
          maxWidth,
          "max-h-[92vh] overflow-y-auto no-scrollbar",
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--surface-border)] bg-ink-900/95 px-5 py-4 backdrop-blur">
          <h3 className="text-base font-bold text-mist-100">{title}</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="grid size-11 place-items-center rounded-full bg-[var(--white-a6)] text-mist-200 transition-colors hover:bg-[var(--white-a10)] hover:text-mist-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ Skeleton -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-[var(--white-a6)]", className)} />;
}

/* ----------------------------- SectionHead ------------------------------ */

export function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="mb-1.5 flex items-center gap-2 text-[13px] font-bold tracking-wide text-flame-500">
            <span className="h-px w-6 bg-flame-600" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-lg font-extrabold text-mist-100 sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ Rating ---------------------------------- */

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 num text-[13px] text-mist-200">
      <span className="text-flame-500">★</span>
      <span className="font-bold">{toFa(value.toFixed(1))}</span>
      {count !== undefined && <span className="text-mist-500">({toFa(count)})</span>}
    </span>
  );
}

/* ------------------------------ SmartImage ------------------------------ */

export function FoodImage({
  src,
  alt,
  className,
  sizes = "(max-width:768px) 50vw, 320px",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-ink-800", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-all duration-700",
          loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm",
        )}
      />
    </div>
  );
}
