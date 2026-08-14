"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function ToastHost() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-200 flex flex-col items-center gap-2 px-4 sm:top-auto sm:bottom-6 sm:right-6 sm:items-end sm:px-0">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl border bg-ink-850/95 p-3 text-right shadow-2xl backdrop-blur",
            t.tone === "success"
              ? "border-flame-600/40 shadow-[0_18px_50px_-20px_rgba(194,13,0,0.7)]"
              : t.tone === "error"
                ? "border-red-500/40"
                : "border-[var(--surface-border)]",
          )}
        >
          {t.image ? (
            <Image
              src={t.image}
              alt=""
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl text-lg",
                t.tone === "error" ? "bg-red-500/15" : "bg-flame-600/15",
              )}
            >
              {t.tone === "error" ? "⚠️" : "✓"}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-bold text-mist-100">{t.title}</span>
            {t.description && (
              <span className="block truncate text-[13px] text-mist-400">{t.description}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
