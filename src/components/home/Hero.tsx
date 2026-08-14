import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { RESTAURANT } from "@/lib/data/catalog";
import { toFa } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

const STATS = [
  { value: "۱۲ دقیقه", label: "میانگین آماده‌سازی" },
  { value: "۴.۸", label: "رضایت مشتری" },
  { value: "۳۰ دقیقه", label: "ارسال در فسا" },
];

/**
 * HERO
 *
 * ONE landscape composition on every device. All three renditions are 16:9
 * crops of the same artwork, so a phone gets the same visual story as desktop
 * (full storefront + illuminated sign), just at fewer pixels.
 *
 * Layout:
 *   - phones  -> the landscape image is a fixed-ratio band, with the copy
 *                stacked beneath it. Nothing is cropped away to fit.
 *   - desktop -> the image becomes a full-bleed background and the copy sits
 *                on top of it, scrim-protected.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 sm:on-photo">
      {/* ---------- Backdrop (desktop: full-bleed) ---------- */}
      <div className="on-photo absolute inset-0 hidden sm:block">
        <picture>
          <source media="(max-width: 1024px)" srcSet="/hero/hero-mobile.webp" type="image/webp" />
          <source srcSet="/hero/hero-desktop.webp" type="image/webp" />
          <img
            src="/hero/hero-desktop.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center"
          />
        </picture>
        {/* Scrim sweeps from the right (RTL copy side). */}
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950 via-ink-950/85 to-ink-950/40" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* ---------- Mobile: landscape image band ---------- */}
      <div className="on-photo relative sm:hidden">
        <picture>
          <source media="(max-width: 480px)" srcSet="/hero/hero-mobile-sm.webp" type="image/webp" />
          <source srcSet="/hero/hero-mobile.webp" type="image/webp" />
          <img
            src="/hero/hero-mobile.webp"
            alt="تابلوی روشن فست فود دلاوا در یک شب بارانی در فسا"
            width={1024}
            height={576}
            fetchPriority="high"
            decoding="async"
            className="aspect-video w-full object-cover object-center"
          />
        </picture>
        {/* Soft fade into the copy below so the seam is not a hard edge. */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* ---------- Content ---------- */}
      <div className="shell relative grid items-center gap-6 pb-7 pt-4 sm:min-h-[420px] sm:content-center sm:py-12 lg:min-h-[520px] lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="animate-fade-up">
          <h1 className="text-[32px] font-extrabold leading-[1.15] text-mist-100 sm:text-5xl lg:text-[60px]">
            فست فود
            <span className="glow-text mx-3 inline-block bg-gradient-to-l from-flame-400 to-flame-700 bg-clip-text text-transparent">
              دلاوا
            </span>
          </h1>

          <p className="mt-2 max-w-lg text-[15px] font-medium text-mist-200 sm:mt-3 sm:text-lg">
            {RESTAURANT.tagline}
          </p>
          <p className="mt-3 hidden max-w-md text-[14px] leading-7 text-mist-400 sm:block">
            برگر دست‌ساز روی گریل ذغالی، پیتزای خمیر تازه روزانه و سوخاری کریسپی — مستقیم از آشپزخانه
            دلاوا در فسا به در خانه شما.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
            <ButtonLink href="/menu" size="lg" className="h-12 sm:h-13 sm:min-w-44">
              سفارش آنلاین
            </ButtonLink>
            <ButtonLink href="/menu" size="lg" variant="secondary" className="h-12 sm:h-13">
              مشاهده منو
            </ButtonLink>
          </div>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 sm:mt-8 sm:gap-x-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="num text-lg font-extrabold text-mist-100 sm:text-2xl">{s.value}</dt>
                <dd className="mt-0.5 text-[13px] text-mist-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Signature dish card — desktop only */}
        <div className="relative hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-6 rounded-full bg-flame-600/25 blur-[90px]" />
            <Image
              src="/food/burger-royal.webp"
              alt="رویال برگر دلاوا"
              fill
              priority
              sizes="480px"
              className="rounded-2xl object-cover shadow-[0_40px_120px_-40px_rgba(194,13,0,0.65)]"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

            <div className="absolute -bottom-5 -right-5 w-56 rounded-2xl border border-[var(--surface-border)] bg-ink-900/90 p-4 backdrop-blur-xl">
              <div className="text-[13px] text-mist-400">امضای دلاوا</div>
              <div className="mt-1 text-[15px] font-extrabold text-mist-100">رویال برگر</div>
              <div className="num mt-2 flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-flame-600">{toFa("۲۸۵,۰۰۰")}</span>
                <span className="text-[13px] text-mist-400">تومان</span>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 flex items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-ink-900/90 px-4 py-3 backdrop-blur-xl">
              <Icon name="bike" className="size-5 text-flame-500" />
              <span className="text-[13px] font-bold text-mist-100">ارسال سریع در فسا</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative border-y border-[var(--surface-border)] bg-ink-900 py-2.5">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 gap-6 whitespace-nowrap pr-10">
            {Array.from({ length: 2 }).flatMap((_, r) =>
              [
                "خمیر تازه روزانه",
                "گوشت گریل ذغالی",
                "ارسال ۳۰ دقیقه‌ای",
                "پرداخت امن آنلاین",
                "۱۰٪ تخفیف اولین سفارش",
                "امتیاز باشگاه مشتریان",
              ].map((t) => (
                <span
                  key={`${r}-${t}`}
                  className="flex items-center gap-2 text-[12.5px] font-bold tracking-wide text-mist-400"
                >
                  <Icon name="spark" filled className="size-3.5 text-flame-600" />
                  {t}
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
