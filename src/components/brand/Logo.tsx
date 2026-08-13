import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The official DELAVA wordmark.
 *
 * Assets come straight from the supplied brand pack (`public/brand/`) — they are
 * never redrawn, traced or substituted. Per `delava-brand-guide.md`:
 *   light mode -> delava-logo-orange (#EE6D1B)
 *   dark  mode -> delava-logo-white
 * (served as the pack's own .webp twins — identical artwork, ~63% smaller)
 *
 * Both variants are rendered and swapped with CSS driven by `data-theme`, so the
 * correct mark is painted on the first frame with no hydration flash.
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
          src="/brand/delava-logo-orange.webp"
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
    <Link href={href} aria-label="دلاوا — صفحه اصلی" className="shrink-0">
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
        src="/brand/delava-icon-orange.webp"
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
