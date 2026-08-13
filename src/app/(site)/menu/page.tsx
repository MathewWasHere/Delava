import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "منوی فست فود دلاوا",
  description:
    "منوی کامل دلاوا: پیتزا، برگر، ساندویچ، سوخاری، سیب زمینی و نوشیدنی — با قیمت روز و سفارش آنلاین در فسا.",
  openGraph: { title: "منوی فست فود دلاوا", images: ["/food/pizza-makhsoos.webp"] },
};

export default function MenuPage() {
  return <MenuBrowser />;
}
