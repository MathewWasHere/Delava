import { cn } from "@/lib/cn";

export type IconName =
  | "home"
  | "menu"
  | "cart"
  | "receipt"
  | "user"
  | "phone"
  | "pin"
  | "clock"
  | "star"
  | "heart"
  | "check"
  | "chevron"
  | "plus"
  | "shield"
  | "bike"
  | "gift"
  | "spark"
  | "search"
  | "chart"
  | "box"
  | "tag"
  | "grid"
  | "settings"
  | "logout"
  | "edit"
  | "trash"
  | "instagram"
  | "telegram"
  | "flame";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />,
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.1 10.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.55L20.5 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.5z" />
      <path d="M9.5 8h5M9.5 12h5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.8 4.2-5.6 7.5-5.6s6.1 1.8 7.5 5.6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3c0 1-.8 1.9-1.9 1.8C10.9 18.9 5.1 13.1 4.7 5.4c0-1 .8-1.9 1.8-1.9Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />,
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.1a4.1 4.1 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  chevron: <path d="m14.5 5.5-7 6.5 7 6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.4 2.9 7.9 7 9 4.1-1.1 7-4.6 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M9 17h5l-2-7 3-3M11 6h3" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v9H4zM3 7.5h18V11H3zM12 7.5V20" />
      <path d="M12 7.5C10 7.5 7.5 7 7.5 5.2S10 3.5 12 7.5c2-4 4.5-3.6 4.5-1.8S14 7.5 12 7.5Z" />
    </>
  ),
  spark: <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  chart: <path d="M4 20V9m5 11V4m5 16v-7m5 7V7" />,
  box: (
    <>
      <path d="M4 8.5 12 4l8 4.5V16L12 20.5 4 16z" />
      <path d="M4 8.5 12 13l8-4.5M12 13v7.5" />
    </>
  ),
  tag: (
    <>
      <path d="M11 3.5H20.5V13L11.5 22 3 13.5z" />
      <circle cx="16.5" cy="7.5" r="1.3" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
    </>
  ),
  logout: <path d="M14 5.5H6.5v13H14M11 12h9m0 0-3-3m3 3-3 3" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM14.5 5.5l4 4" />,
  trash: <path d="M4.5 6.5h15M9 6.5V4h6v2.5M6.5 6.5 7.5 20h9l1-13.5M10 10v6M14 10v6" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </>
  ),
  telegram: <path d="M21 4.5 2.8 11.3l5.3 1.8 1.9 5.8 2.9-3.6 4.5 3.3z" />,
  flame: (
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.4 1-3.4s.4 1.9 1.7 2.4C9.4 8.5 12 7 12 3Z" />
  ),
};

export function Icon({
  name,
  className,
  filled,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      {PATHS[name]}
    </svg>
  );
}
