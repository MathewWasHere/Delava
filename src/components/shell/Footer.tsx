import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { RESTAURANT } from "@/lib/data/catalog";
import { toFa } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

/**
 * FOOTER
 *
 * The «دلاوا» / «دسته‌بندی‌ها» / «حساب کاربری» link columns were removed: on
 * phones they tripled the footer height while duplicating the bottom nav, and
 * on desktop the same destinations already live in the header. What remains is
 * what a footer is actually for — who we are, where we are, how to reach us.
 *
 * Mobile gets a genuinely short footer (brand row, contact rows, legal line),
 * not the desktop footer with parts hidden.
 */
export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--surface-border)] bg-ink-900 pb-24 sm:mt-16 lg:pb-10">
      <div className="shell py-7 sm:py-12">
        {/* ---------- Brand + socials ---------- */}
        <div className="flex items-center justify-between gap-4">
          <Logo width={78} href={null} withSub={false} priority={false} />

          <div className="flex gap-2">
            <a
              href={RESTAURANT.instagram}
              aria-label="اینستاگرام دلاوا"
              className="grid size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a4)] text-mist-400 transition-colors hover:border-flame-600/40 hover:text-flame-500"
            >
              <Icon name="instagram" />
            </a>
            <a
              href={RESTAURANT.telegram}
              aria-label="تلگرام دلاوا"
              className="grid size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a4)] text-mist-400 transition-colors hover:border-flame-600/40 hover:text-flame-500"
            >
              <Icon name="telegram" />
            </a>
            <a
              href={`tel:${RESTAURANT.phone}`}
              aria-label="تماس با دلاوا"
              className="grid size-11 place-items-center rounded-xl border border-[var(--surface-border)] bg-[var(--white-a4)] text-mist-400 transition-colors hover:border-flame-600/40 hover:text-flame-500"
            >
              <Icon name="phone" />
            </a>
          </div>
        </div>

        {/* Longer blurb only where there is vertical room to spare. */}
        <p className="mt-4 hidden max-w-md text-[13px] leading-7 text-mist-400 sm:block">
          فست فود دلاوا در فسا؛ برگر دست‌ساز، پیتزای خمیر تازه و سوخاری کریسپی. سفارش مستقیم بده،
          ارزان‌تر بخر و امتیاز جمع کن.
        </p>

        {/* ---------- Contact essentials ---------- */}
        <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          <div className="flex items-start gap-2.5">
            <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-flame-500" />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-mist-100">آدرس</div>
              <div className="mt-0.5 text-[13px] leading-6 text-mist-400">
                {RESTAURANT.address}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-flame-500" />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-mist-100">ساعات کاری</div>
              <div className="num mt-0.5 text-[13px] leading-6 text-mist-400">
                {toFa(RESTAURANT.hours)}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Icon name="phone" className="mt-0.5 size-4 shrink-0 text-flame-500" />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-mist-100">تماس</div>
              <a
                href={`tel:${RESTAURANT.phone}`}
                dir="ltr"
                className="num -my-1.5 inline-flex min-h-11 items-center text-[13px] font-bold text-flame-500"
              >
                {toFa(RESTAURANT.phoneDisplay)}
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Legal ---------- */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--hairline)] pt-4 text-[12.5px] text-mist-500 sm:mt-8 sm:pt-6 sm:text-[13px]">
          <span>© {toFa(1405)} فست فود دلاوا</span>
          <Link
            href="/admin"
            className="-my-2 inline-flex min-h-11 items-center transition-colors hover:text-flame-500"
          >
            ورود مدیریت
          </Link>
        </div>
      </div>
    </footer>
  );
}
