"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Badge, FoodImage, Price, Rating } from "@/components/ui";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { toFa } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { ProductSheet } from "@/components/product/ProductSheet";
import { smallImage } from "@/lib/data/catalog";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { addItem, state, toggleFavorite } = useStore();
  const [sheet, setSheet] = useState(false);
  const fav = state.favorites.includes(product.id);
  const hasModifiers = product.modifiers.length > 0;

  const add = () => (hasModifiers ? setSheet(true) : addItem(product));

  return (
    <>
      {/* ---------------- MOBILE: horizontal row, thumb-friendly ---------------- */}
      <article
        className={cn(
          "surface relative flex gap-3 overflow-hidden rounded-2xl p-2.5 sm:hidden",
          !product.available && "opacity-60",
        )}
      >
        <Link href={`/product/${product.slug}`} className="relative shrink-0">
          <FoodImage
            src={smallImage(product.image)}
            alt={product.name}
            priority={priority}
            className="size-24 rounded-xl sm:size-28"
            sizes="96px"
          />
          {product.compareAtPrice && (
            <span className="absolute right-1 top-1 rounded-md bg-gold-500 px-1.5 py-0.5 text-[12.5px] font-bold text-black">
              ٪تخفیف
            </span>
          )}
          {!product.available && (
            <span className="absolute inset-0 grid place-items-center rounded-xl bg-black/70 text-[13px] font-bold text-white">
              ناموجود
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 shrink flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="flex min-h-11 min-w-0 flex-1 items-center"
            >
              <h3 className="truncate text-[15px] font-extrabold leading-7 text-mist-100">
                {product.name}
              </h3>
            </Link>
            <button
              onClick={() => toggleFavorite(product.id)}
              aria-label={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              className={cn(
                "-m-1 grid size-11 shrink-0 place-items-center rounded-full transition-colors",
                fav ? "text-flame-500" : "text-mist-500",
              )}
            >
              <Icon name="heart" filled={fav} className="size-5" />
            </button>
          </div>

          <p className="mt-0.5 line-clamp-2 text-[13px] leading-6 text-mist-400">
            {product.shortDescription}
          </p>

          <div className="mt-1.5 flex items-center gap-3 text-[13px] text-mist-400">
            <Rating value={product.rating} />
            <span className="flex items-center gap-1">
              <Icon name="clock" className="size-3.5" />
              <span className="num">{toFa(product.prepMinutes)} دقیقه</span>
            </span>
          </div>

          <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-2">
            <Price value={product.price} size="md" />
            <button
              disabled={!product.available}
              onClick={add}
              aria-label={`افزودن ${product.name} به سبد خرید`}
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-extrabold transition-all active:scale-95",
                product.available
                  ? "bg-flame-600 text-white"
                  : "bg-[var(--white-a6)] text-mist-500",
              )}
            >
              <Icon name="plus" className="size-5" />
            </button>
          </div>
        </div>
      </article>

      {/* ---------------- DESKTOP / TABLET: image-led card ---------------- */}
      <article
        className={cn(
          "surface surface-hover group relative hidden flex-col overflow-hidden rounded-2xl sm:flex",
          !product.available && "opacity-60",
        )}
      >
        <Link href={`/product/${product.slug}`} className="relative block aspect-4/3 overflow-hidden">
          <FoodImage
            src={product.image}
            alt={product.name}
            priority={priority}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width:1024px) 33vw, 300px"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-black/45" />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {product.badges?.map((b) => (
                <Badge key={b} className="backdrop-blur-md">
                  <Icon name="flame" filled className="size-3" />
                  {b}
                </Badge>
              ))}
              {!product.available && <Badge tone="danger">ناموجود</Badge>}
            </div>
          </div>

          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
            <Rating value={product.rating} />
            <span className="flex items-center gap-1 text-[13px] text-mist-300">
              <Icon name="clock" className="size-3.5" />
              <span className="num">{toFa(product.prepMinutes)} دقیقه</span>
            </span>
          </div>
        </Link>

        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className={cn(
            "absolute left-3 top-3 grid size-11 place-items-center rounded-full border backdrop-blur-md transition-all",
            fav
              ? "border-flame-600/50 bg-flame-600/25 text-flame-600"
              : "border-[var(--surface-border)] bg-black/40 text-white/70 hover:text-white",
          )}
        >
          <Icon name="heart" filled={fav} className="size-5" />
        </button>

        <div className="flex flex-1 flex-col p-4">
          <Link href={`/product/${product.slug}`} className="flex min-h-11 items-center">
            <h3 className="text-[15px] font-extrabold text-mist-100 transition-colors group-hover:text-flame-600">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 min-h-10 text-[13px] leading-6 text-mist-400">
            {product.shortDescription}
          </p>

          <div className="mt-4 flex items-end justify-between gap-2">
            <Price value={product.price} compareAt={product.compareAtPrice} />
            <button
              disabled={!product.available}
              onClick={add}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-[13px] font-bold transition-all active:scale-95",
                product.available
                  ? "bg-flame-600 text-white hover:brightness-110"
                  : "cursor-not-allowed bg-[var(--white-a6)] text-mist-500",
              )}
            >
              <Icon name="plus" className="size-4" />
              افزودن
            </button>
          </div>
        </div>
      </article>

      <ProductSheet product={product} open={sheet} onClose={() => setSheet(false)} />
    </>
  );
}
