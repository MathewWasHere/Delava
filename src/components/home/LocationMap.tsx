"use client";

import { useState } from "react";
import { RESTAURANT } from "@/lib/data/catalog";
import { toFa } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * LOCATION / MAP
 *
 * A real, interactive Google Map for the restaurant — never a bare URL.
 *
 * The embed is click-to-load: phones get a lightweight branded placeholder
 * first (no third-party iframe, no extra requests on page load), and the live
 * map mounts on tap. That keeps the section fast on mobile data while still
 * giving a genuine map rather than a screenshot.
 */

const EMBED_SRC = `https://maps.google.com/maps?q=${RESTAURANT.lat},${RESTAURANT.lng}&z=16&hl=fa&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${RESTAURANT.lat},${RESTAURANT.lng}`;

export function LocationMap({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const { pushToast } = useStore();

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(RESTAURANT.address);
      pushToast({ title: "آدرس کپی شد", tone: "success" });
    } catch {
      pushToast({ title: "کپی نشد", description: "آدرس را دستی انتخاب کنید.", tone: "error" });
    }
  }

  return (
    <div
      className={cn(
        "surface overflow-hidden rounded-3xl",
        className,
      )}
    >
      {/* ---------------- Map ---------------- */}
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
        {loaded ? (
          <iframe
            title={`نقشه موقعیت ${RESTAURANT.name}`}
            src={EMBED_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label="نمایش نقشه"
            className="group absolute inset-0 size-full overflow-hidden"
          >
            {/* Branded stand-in: an abstract street grid in the Delava palette,
                drawn inline so it costs nothing and themes correctly. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-ink-850"
              style={{
                backgroundImage:
                  "linear-gradient(var(--white-a6) 1px, transparent 1px), linear-gradient(90deg, var(--white-a6) 1px, transparent 1px), linear-gradient(115deg, rgba(238,109,27,0.16), transparent 60%)",
                backgroundSize: "38px 38px, 38px 38px, 100% 100%",
              }}
            />
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-[46%] h-3 -rotate-6 bg-[var(--white-a8)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 top-0 right-[38%] w-2.5 rotate-3 bg-[var(--white-a8)]"
            />

            {/* Pin */}
            <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
              <span className="relative grid size-12 place-items-center rounded-full bg-flame-600 text-white shadow-[0_10px_28px_-8px_rgba(238,109,27,0.9)] transition-transform group-hover:scale-105">
                <Icon name="pin" filled className="size-6" />
                <span className="absolute inset-0 animate-ping-slow rounded-full ring-2 ring-flame-500/40" />
              </span>
            </span>

            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-ink-950 to-transparent p-4 pt-10 text-[13px] font-bold text-mist-100">
              <Icon name="pin" className="size-4 text-flame-500" />
              نمایش نقشه دلاوا
            </span>
          </button>
        )}
      </div>

      {/* ---------------- Details ---------------- */}
      <div className="border-t border-[var(--hairline)] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-flame-600/12 text-flame-500">
            <Icon name="pin" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-extrabold text-mist-100">{RESTAURANT.name}</div>
            <p className="mt-1 text-[13px] leading-6 text-mist-400">{RESTAURANT.address}</p>
            <p className="num mt-1 text-[13px] text-mist-500">{toFa(RESTAURANT.hours)}</p>
          </div>
        </div>

        {/* Actions — large, thumb-friendly targets */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-flame-700 to-flame-500 px-3 text-[13.5px] font-bold text-white transition hover:brightness-110"
          >
            <Icon name="bike" className="size-4 shrink-0" />
            مسیریابی
          </a>
          <a
            href={RESTAURANT.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--white-a4)] px-3 text-[13.5px] font-bold text-mist-100 transition hover:border-flame-600/45"
          >
            <Icon name="pin" className="size-4 shrink-0" />
            گوگل مپ
          </a>
          <a
            href={`tel:${RESTAURANT.phone}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--white-a4)] px-3 text-[13.5px] font-bold text-mist-100 transition hover:border-flame-600/45"
          >
            <Icon name="phone" className="size-4 shrink-0" />
            تماس
          </a>
          <button
            type="button"
            onClick={copyAddress}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--white-a4)] px-3 text-[13.5px] font-bold text-mist-100 transition hover:border-flame-600/45"
          >
            <Icon name="edit" className="size-4 shrink-0" />
            کپی آدرس
          </button>
        </div>
      </div>
    </div>
  );
}
