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
 * Mobile and desktop use deliberately different crops of the storefront
 * artwork rather than one image squeezed into both:
 *   - phones  -> `hero-mobile*.webp`, a 3:4 / 4:5 portrait crop composed so the
 *                illuminated round sign sits in the UPPER half, leaving the
 *                lower half as a calm area for the headline and buttons.
 *   - desktop -> `hero-desktop.webp`, the wide composition.
 *
 * The gradient scrim is tuned per breakpoint (bottom-up on mobile, side-on for
 * LTR-of-content on desktop) so text contrast holds at every aspect ratio.
 */
export function Hero() {
  return (
    <section className="on-photo relative overflow-hidden bg-ink-950">
      {/* ---------- Backdrop ---------- */}
      <div className="absolute inset-0">
        {/* One <picture> with media-scoped sources: the browser fetches ONLY
            the crop for this viewport. Two <Image> tags toggled with
            `sm:hidden` would download both on every device. */}
        <picture>
          <source
            media="(max-width: 480px)"
            srcSet="/hero/hero-mobile-sm.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 639px)"
            srcSet="/hero/hero-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/hero/hero-desktop.webp" type="image/webp" />
          <img
            src="/hero/hero-desktop.webp"
            alt="تابلوی روشن فست فود دلاوا در یک شب بارانی در فسا"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_18%] sm:object-center"
          />
        </picture>

        {/* Mobile scrim: strong at the bottom where the copy sits, clear at the
            top so the sign stays vivid. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 via-40% to-ink-950/25 sm:hidden" />
        {/* Desktop scrim: sweeps from the right (RTL text side). */}
        <div className="absolute inset-0 hidden bg-gradient-to-l from-ink-950 via-ink-950/85 to-ink-950/40 sm:block" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* ---------- Content ----------
          Mobile: content is pushed to the bottom of a tall-ish stage so the
          sign in the photo reads clearly above it. */}
      <div className="shell relative grid min-h-[520px] content-end items-center gap-10 pb-8 pt-[38vw] sm:min-h-[560px] sm:content-center sm:py-14 sm:pt-14 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="animate-fade-up">
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-mist-100 sm:text-6xl lg:text-[68px]">
            فست فود
            <span className="glow-text mx-3 inline-block bg-gradient-to-l from-flame-400 to-flame-700 bg-clip-text text-transparent">
              دلاوا
            </span>
          </h1>

          <p className="mt-3 max-w-lg text-[17px] font-medium text-mist-200 sm:mt-4 sm:text-xl">
            {RESTAURANT.tagline}
          </p>
          <p className="mt-3 hidden max-w-md text-[14px] leading-7 text-mist-400 sm:block">
            برگر دست‌ساز روی گریل ذغالی، پیتزای خمیر تازه روزانه و سوخاری کریسپی — مستقیم از آشپزخانه
            دلاوا در فسا به در خانه شما.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
            <ButtonLink href="/menu" size="lg" className="h-14 sm:min-w-44">
              سفارش آنلاین
            </ButtonLink>
            <ButtonLink href="/menu" size="lg" variant="secondary" className="h-14">
              مشاهده منو
            </ButtonLink>
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-4 sm:mt-10 sm:gap-x-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="num text-xl font-extrabold text-mist-100 sm:text-2xl">{s.value}</dt>
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
              className="rounded-[36px] object-cover shadow-[0_40px_120px_-40px_rgba(238,109,27,0.65)]"
            />
            <div className="absolute inset-0 rounded-[36px] ring-1 ring-inset ring-white/10" />

            <div className="absolute -bottom-5 -right-5 w-56 rounded-3xl border border-[var(--surface-border)] bg-ink-900/90 p-4 backdrop-blur-xl">
              <div className="text-[13px] text-mist-400">امضای دلاوا</div>
              <div className="mt-1 text-[15px] font-extrabold text-mist-100">رویال برگر</div>
              <div className="num mt-2 flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-flame-400">{toFa("۲۸۵,۰۰۰")}</span>
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
      <div className="relative border-y border-[var(--surface-border)] bg-black/60 py-3">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10">
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
                  className="flex items-center gap-2.5 text-[13px] font-bold tracking-wide text-mist-300"
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
