"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { AuthPanel } from "@/components/checkout/AuthPanel";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Price } from "@/components/ui";
import { faDate, toFa } from "@/lib/format";
import { STATUS_SHORT, STATUS_TONE } from "@/lib/order-machine";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { deliveryZones, products } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";

type Tab = "profile" | "addresses" | "orders" | "favorites" | "rewards";

const TABS: Array<{ key: Tab; label: string; icon: IconName }> = [
  { key: "profile", label: "اطلاعات من", icon: "user" },
  { key: "orders", label: "سفارش‌ها", icon: "receipt" },
  { key: "addresses", label: "آدرس‌ها", icon: "pin" },
  { key: "favorites", label: "علاقه‌مندی‌ها", icon: "heart" },
  { key: "rewards", label: "باشگاه مشتریان", icon: "gift" },
];

export default function AccountPage() {
  const { state, logout, updateUser, deleteAddress, selectAddress, reorder, pushToast } = useStore();
  const [tab, setTab] = useState<Tab>("profile");
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState<string | undefined>();
  const [name, setName] = useState(state.user?.name ?? "");

  if (state.hydrated && !state.user) {
    return (
      <div className="shell flex min-h-[75vh] items-center justify-center py-10">
        <div className="w-full max-w-md">
          <AuthPanel />
        </div>
      </div>
    );
  }

  const user = state.user;
  const favorites = products.filter((p) => state.favorites.includes(p.id));
  const nextReward = 200;
  const points = user?.points ?? 0;
  const progress = Math.min(100, Math.round((points / nextReward) * 100));

  return (
    <div className="shell py-5 pb-28 sm:py-8 lg:pb-14">
      {/* Header card */}
      <div className="surface relative overflow-hidden rounded-3xl p-5 sm:rounded-[32px] sm:p-8">
        <div className="absolute -left-20 -top-20 size-56 rounded-full bg-flame-600/20 blur-[90px]" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-flame-600 to-flame-800 text-2xl font-extrabold text-white">
            {(user?.name ?? "د").slice(0, 1)}
          </span>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-mist-100">{user?.name}</h1>
            <p className="num mt-1 text-[13px] text-mist-400" dir="ltr">
              {toFa(user?.phone ?? "")}
            </p>
          </div>
          <div className="rounded-2xl border border-flame-600/30 bg-flame-600/8 px-5 py-3 text-center">
            <div className="num text-xl font-extrabold text-flame-400">{toFa(points)}</div>
            <div className="text-[13px] text-mist-400">امتیاز دلاوا</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <nav className="snap-rail -mx-3.5 flex gap-2 overflow-x-auto px-3.5 no-scrollbar lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex min-h-11 shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all lg:w-full",
                tab === t.key
                  ? "bg-flame-600/12 text-flame-400"
                  : "bg-ink-850 text-mist-400 hover:text-mist-100 lg:bg-transparent",
              )}
            >
              <Icon name={t.icon} className="size-4.5" />
              {t.label}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              pushToast({ title: "از حساب خارج شدی" });
            }}
            className="flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-bold text-mist-500 transition-colors hover:text-red-400 lg:w-full lg:mt-4"
          >
            <Icon name="logout" className="size-4.5" />
            خروج از حساب
          </button>
        </nav>

        <div>
          {tab === "profile" && (
            <div className="surface animate-fade-up rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-mist-100">اطلاعات حساب</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="نام و نام خانوادگی">
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="شماره موبایل" hint="برای تغییر شماره با پشتیبانی تماس بگیرید">
                  <Input value={toFa(user?.phone ?? "")} dir="ltr" disabled className="opacity-60" />
                </Field>
              </div>
              <Button
                className="mt-5"
                onClick={() => {
                  updateUser({ name: name.trim() || user!.name });
                  pushToast({ title: "اطلاعات ذخیره شد", tone: "success" });
                }}
              >
                ذخیره تغییرات
              </Button>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Stat label="کل سفارش‌ها" value={toFa(state.orders.length)} />
                <Stat label="آدرس‌های ذخیره‌شده" value={toFa(state.addresses.length)} />
                <Stat label="علاقه‌مندی‌ها" value={toFa(state.favorites.length)} />
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="animate-fade-up space-y-3">
              {state.orders.length === 0 && (
                <div className="surface rounded-3xl p-12 text-center text-[13px] text-mist-400">
                  هنوز سفارشی ثبت نکرده‌ای.
                </div>
              )}
              {state.orders.map((o) => (
                <div key={o.id} className="surface flex flex-wrap items-center gap-4 rounded-3xl p-4">
                  <div className="flex-1">
                    <Link href={`/order?id=${o.id}`} className="num text-[14px] font-extrabold text-mist-100 hover:text-flame-400">
                      #{toFa(o.number)}
                    </Link>
                    <div className="num mt-1 text-[13px] text-mist-500">{faDate(o.createdAt)}</div>
                    <p className="mt-1.5 line-clamp-1 text-[13px] text-mist-400">
                      {o.items.map((i) => i.name).join("، ")}
                    </p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[13px] font-bold", STATUS_TONE[o.status])}>
                    {STATUS_SHORT[o.status]}
                  </span>
                  <Price value={o.total} />
                  <Button size="sm" variant="secondary" onClick={() => reorder(o.id)}>
                    سفارش مجدد
                  </Button>
                </div>
              ))}
            </div>
          )}

          {tab === "addresses" && (
            <div className="animate-fade-up space-y-3">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditing(undefined);
                    setSheet(true);
                  }}
                >
                  + افزودن آدرس
                </Button>
              </div>
              {state.addresses.length === 0 && (
                <div className="surface rounded-3xl p-12 text-center text-[13px] text-mist-400">
                  هنوز آدرسی ذخیره نکرده‌ای.
                </div>
              )}
              {state.addresses.map((a) => {
                const zone = deliveryZones.find((z) => z.id === a.zoneId);
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "surface rounded-3xl p-5",
                      a.id === state.selectedAddressId && "border-flame-600/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[14px] font-extrabold text-mist-100">
                        <Icon name="pin" className="size-4 text-flame-500" />
                        {a.title}
                      </span>
                      <span className="text-[13px] text-mist-500">{zone?.name}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-7 text-mist-300">
                      {a.province}، {a.city}، {a.line}
                    </p>
                    <p className="num mt-1 text-[13px] text-mist-500">
                      {a.recipientName} — {toFa(a.recipientPhone)}
                    </p>
                    <div className="mt-4 flex gap-2 border-t border-[var(--surface-border)] pt-3.5">
                      <Button size="sm" variant="ghost" onClick={() => selectAddress(a.id)}>
                        انتخاب پیش‌فرض
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditing(a.id);
                          setSheet(true);
                        }}
                      >
                        ویرایش
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteAddress(a.id)}>
                        حذف
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "favorites" && (
            <div className="animate-fade-up">
              {favorites.length === 0 ? (
                <div className="surface rounded-3xl p-12 text-center">
                  <span className="text-4xl">🤍</span>
                  <p className="mt-4 text-[13px] text-mist-400">
                    هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌ای.
                  </p>
                  <ButtonLink href="/menu" className="mt-5">
                    مشاهده منو
                  </ButtonLink>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {favorites.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "rewards" && (
            <div className="animate-fade-up space-y-4">
              <div className="surface relative overflow-hidden rounded-3xl p-6">
                <div className="absolute -left-16 -top-16 size-48 rounded-full bg-flame-600/25 blur-[80px]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-flame-600 px-3 py-1 text-[13px] font-extrabold text-white">
                    <Icon name="gift" className="size-3.5" />
                    DELAVA REWARDS
                  </span>
                  <div className="num mt-5 text-4xl font-extrabold text-mist-100">{toFa(points)}</div>
                  <p className="mt-1 text-[13px] text-mist-400">امتیاز فعلی شما</p>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[var(--white-a8)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-flame-700 to-flame-400 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="num mt-2 text-[13px] text-mist-400">
                    {toFa(Math.max(0, nextReward - points))} امتیاز تا جایزه بعدی
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { p: 150, title: "یک نوشیدنی رایگان", icon: "🥤" },
                  { p: 200, title: "سیب زمینی رایگان", icon: "🍟" },
                  { p: 400, title: "۵۰٪ تخفیف برگر مخصوص", icon: "🍔" },
                  { p: 700, title: "یک پیتزا مخصوص رایگان", icon: "🍕" },
                ].map((r) => {
                  const unlocked = points >= r.p;
                  return (
                    <div
                      key={r.title}
                      className={cn(
                        "surface flex items-center gap-4 rounded-3xl p-5",
                        unlocked && "border-flame-600/40 bg-flame-600/6",
                      )}
                    >
                      <span className="text-3xl">{r.icon}</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-extrabold text-mist-100">{r.title}</div>
                        <div className="num text-[13px] text-mist-400">{toFa(r.p)} امتیاز</div>
                      </div>
                      <Button size="sm" variant={unlocked ? "primary" : "secondary"} disabled={!unlocked}>
                        {unlocked ? "دریافت" : "قفل"}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-[13px] text-mist-500">
                هر ۱۰,۰۰۰ تومان خرید = ۱ امتیاز. امتیازها هیچ‌وقت منقضی نمی‌شوند.
              </p>
            </div>
          )}
        </div>
      </div>

      <AddressForm
        open={sheet}
        onClose={() => setSheet(false)}
        initial={state.addresses.find((a) => a.id === editing)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-ink-850 p-4 text-center">
      <div className="num text-xl font-extrabold text-mist-100">{value}</div>
      <div className="mt-1 text-[13px] text-mist-400">{label}</div>
    </div>
  );
}
