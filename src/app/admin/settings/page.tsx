"use client";

import { useState } from "react";
import { RESTAURANT } from "@/lib/data/catalog";
import { Field, Input, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { toFa } from "@/lib/format";

const ROLES: Array<{ role: string; label: string; perms: string }> = [
  { role: "SUPER_ADMIN", label: "مدیر ارشد", perms: "دسترسی کامل به همه بخش‌ها" },
  { role: "MANAGER", label: "مدیر شعبه", perms: "سفارش‌ها، محصولات، تخفیف‌ها، گزارش‌ها" },
  { role: "STAFF", label: "کارمند آشپزخانه", perms: "فقط مشاهده و تغییر وضعیت سفارش‌ها" },
  { role: "DRIVER", label: "پیک", perms: "سفارش‌های تخصیص‌یافته و تحویل" },
];

const INTEGRATIONS: Array<{ icon: IconName; title: string; desc: string; status: string; on: boolean }> = [
  { icon: "shield", title: "درگاه پرداخت زرین‌پال", desc: "ZARINPAL_MERCHANT_ID در متغیرهای محیطی", status: "آماده اتصال", on: false },
  { icon: "phone", title: "سرویس پیامک", desc: "ارسال کد تأیید و اطلاع‌رسانی وضعیت سفارش", status: "آماده اتصال", on: false },
  { icon: "spark", title: "اعلان وب‌پوش", desc: "اطلاع‌رسانی مرورگر برای سفارش‌های جدید", status: "آماده اتصال", on: false },
  { icon: "chart", title: "پیگیری لحظه‌ای (WebSocket)", desc: "به‌روزرسانی زنده وضعیت سفارش", status: "شبیه‌سازی فعال", on: true },
];

export default function AdminSettingsPage() {
  const { pushToast } = useStore();
  const [phone, setPhone] = useState<string>(RESTAURANT.phoneDisplay);
  const [address, setAddress] = useState<string>(RESTAURANT.address);
  const [mapUrl, setMapUrl] = useState<string>(RESTAURANT.mapUrl);
  const [open, setOpen] = useState(true);

  // Accepts the short share links and the full maps URLs Google hands out.
  const mapUrlValid =
    mapUrl.trim() === "" ||
    /^https:\/\/(maps\.app\.goo\.gl\/[\w-]+|(www\.)?google\.[a-z.]+\/maps\/?.*|goo\.gl\/maps\/[\w-]+)$/i.test(
      mapUrl.trim(),
    );

  function save() {
    if (!mapUrlValid) {
      pushToast({
        title: "لینک نقشه معتبر نیست",
        description: "یک لینک گوگل مپ معتبر وارد کنید.",
        tone: "error",
      });
      return;
    }
    pushToast({ title: "تنظیمات ذخیره شد", tone: "success" });
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-mist-100">تنظیمات</h1>
        <p className="mt-1 text-[12px] text-mist-500">اطلاعات رستوران، دسترسی‌ها و سرویس‌های متصل.</p>
      </div>

      <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
        <h2 className="text-[14px] font-extrabold text-mist-100">اطلاعات رستوران</h2>
        {/* The restaurant name is part of the brand identity and is not
            editable here — the field was removed rather than disabled. */}
        <div className="mt-4 grid gap-4">
          <Field label="شماره تماس">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="text-left" />
          </Field>

          <Field label="آدرس">
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="min-h-16" />
          </Field>

          {/* Google Maps link — drives the location card on the site. */}
          <Field
            label="لینک گوگل مپ"
            hint={
              mapUrlValid
                ? "لینک اشتراک‌گذاری موقعیت رستوران در گوگل مپ (برای دکمه مسیریابی)."
                : undefined
            }
            error={mapUrlValid ? undefined : "لینک باید با https://maps.app.goo.gl/ یا google.com/maps شروع شود."}
          >
            <Input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              dir="ltr"
              inputMode="url"
              placeholder="https://maps.app.goo.gl/…"
              aria-invalid={!mapUrlValid}
              className={cn("text-left", !mapUrlValid && "border-red-500/60 focus:border-red-500")}
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4">
          <div>
            <div className="text-[13px] font-bold text-mist-100">وضعیت رستوران</div>
            <div className="text-[11px] text-mist-500">
              با بستن رستوران، ثبت سفارش جدید غیرفعال می‌شود.
            </div>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-[12px] font-extrabold transition-colors",
              open ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
            )}
          >
            {open ? "باز است" : "بسته است"}
          </button>
        </div>

        <Button className="mt-5" onClick={save}>
          ذخیره تنظیمات
        </Button>
      </div>

      <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
        <h2 className="text-[14px] font-extrabold text-mist-100">نقش‌ها و دسترسی‌ها</h2>
        <div className="mt-4 space-y-2">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4"
            >
              <span className="rounded-lg bg-flame-600/12 px-2.5 py-1 text-[10px] font-extrabold text-flame-400" dir="ltr">
                {r.role}
              </span>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-mist-100">{r.label}</div>
                <div className="text-[11px] text-mist-500">{r.perms}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
        <h2 className="text-[14px] font-extrabold text-mist-100">سرویس‌های متصل</h2>
        <p className="mt-1 text-[11px] text-mist-500">
          کلیدها فقط از طریق متغیرهای محیطی سرور خوانده می‌شوند و هرگز در فرانت‌اند قرار نمی‌گیرند.
        </p>
        <div className="mt-4 space-y-2">
          {INTEGRATIONS.map((s) => (
            <div key={s.title} className="flex items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  s.on ? "bg-emerald-500/12 text-emerald-300" : "bg-[var(--white-a6)] text-mist-400",
                )}
              >
                <Icon name={s.icon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-mist-100">{s.title}</div>
                <div className="truncate text-[11px] text-mist-500">{s.desc}</div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold",
                  s.on ? "bg-emerald-500/12 text-emerald-300" : "bg-[var(--white-a6)] text-mist-400",
                )}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--surface-border)] bg-ink-900 p-5">
        <h2 className="text-[14px] font-extrabold text-mist-100">کد QR بسته‌بندی</h2>
        <p className="mt-1 text-[12px] leading-6 text-mist-400">
          روی جعبه‌ها و رسیدها چاپ کن: «سفارش بعدی را مستقیم از دلاوا ثبت کن» — مشتری با اسکن مستقیم
          وارد وب‌اپ می‌شود.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="grid size-32 place-items-center rounded-2xl bg-white p-2">
            <QrPlaceholder />
          </div>
          <div className="text-[12px] text-mist-400">
            <div className="font-bold text-mist-100">delava.ir</div>
            <div className="num mt-1">اسکن → منو → سفارش</div>
            <div className="num mt-1 text-mist-500">تخفیف اولین سفارش: {toFa(10)}٪</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Deterministic decorative QR-style block (real QR generated server-side in Stage 2). */
function QrPlaceholder() {
  const cells = 21;
  const on = (r: number, c: number) => {
    if ((r < 7 && c < 7) || (r < 7 && c > cells - 8) || (r > cells - 8 && c < 7)) {
      const rr = r % 7 === 0 || c % 7 === 0 || (r > 1 && r < 5 && c > 1 && c < 5);
      return rr;
    }
    return (r * 7 + c * 13 + ((r * c) % 5)) % 3 === 0;
  };
  return (
    <svg viewBox={`0 0 ${cells} ${cells}`} className="size-full" aria-label="کد QR نمایشی">
      {Array.from({ length: cells }).map((_, r) =>
        Array.from({ length: cells }).map((_, c) =>
          on(r, c) ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#050505" /> : null,
        ),
      )}
    </svg>
  );
}
