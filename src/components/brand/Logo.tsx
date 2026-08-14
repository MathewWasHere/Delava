import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The official DELAVA wordmark.
 *
 * Assets come straight from the supplied brand pack (`public/brand/`) — never
 * redrawn, traced, recoloured or substituted.
 *
 * Variant choice follows the brand palette (white / black / #C20D00):
 *   light mode -> delava-logo-dark   (the pack's black wordmark)
 *   dark  mode -> delava-logo-white  (the pack's white wordmark)
 *
 * The pack's orange wordmark is no longer used, because orange was retired as
 * the accent colour — but the mark itself is untouched official artwork, just
 * the monochrome cut instead of the orange one. Red is carried by the UI
 * accent, not by the logo, which keeps the lockup clean on both themes.
 *
 * Both variants render and swap via CSS on `data-theme`, so the right mark is
 * painted on the first frame with no hydration flash.
 */

const RATIO = 887 / 1797; // native aspect ratio of the wordmark assets

export function Logo({
  className,
  width = 116,
  withSub = true,
  href = "/",
  priority = true,
}: {
  className?: string;
  width?: number;
  withSub?: boolean;
  href?: string | null;
  priority?: boolean;
}) {
  const height = Math.round(width * RATIO);

  const content = (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      {withSub && (
        <span className="mb-1 text-[9px] font-bold tracking-[0.3em] text-flame-500">
          فست فود
        </span>
      )}
      <span className="relative block" style={{ width, height }}>
        <Image
          src="/brand/delava-logo-dark.webp"
          alt="دلاوا"
          width={width}
          height={height}
          priority={priority}
          className="logo-on-light absolute inset-0"
          style={{ width, height: "auto" }}
        />
        {/* The inactive variant is decorative and hidden by CSS, so it must
            never compete with the visible mark for bandwidth. */}
        <Image
          src="/brand/delava-logo-white.webp"
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          loading="lazy"
          className="logo-on-dark absolute inset-0"
          style={{ width, height: "auto" }}
        />
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="دلاوا — صفحه اصلی" className="inline-flex min-h-11 shrink-0 items-center">
      {content}
    </Link>
  );
}

/**
 * Square app-icon lockup (contains the full دلاوا wordmark per the brand guide).
 * Used for compact spots: admin rail, share cards, avatars, install prompts.
 */
export function LogoMark({
  size = 40,
  className,
  rounded = "rounded-xl",
}: {
  size?: number;
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden", rounded, className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/delava-icon-dark.webp"
        alt="دلاوا"
        width={size}
        height={size}
        className="logo-on-light absolute inset-0 size-full object-contain"
      />
      <Image
        src="/brand/delava-icon-light.webp"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        className="logo-on-dark absolute inset-0 size-full object-contain"
      />
    </span>
  );
}
