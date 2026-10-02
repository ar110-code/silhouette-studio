"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : product.images[0] || "/images/products/trench-1.jpg";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = product.sizes[0] || "Standard";
    const defaultColor = product.colors[0] || "اصلی";

    addItem(product, defaultSize, defaultColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="group flex flex-col bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200/70 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* قاب عکس کالا */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 block">
        <Image
          src={currentImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* برچسب‌های نشانگر تخفیف و پرفروش */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {toPersianDigits(discountPercent)}٪ تخفیف
            </span>
          )}
          {product.isTrending && (
            <span className="bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              ترند فصل
            </span>
          )}
        </div>

        {/* دکمه افزودن سریع روی تصویر هنگام هاور در دسکتاپ */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md transition-all shadow-md ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-white/90 hover:bg-white text-zinc-950 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>به سبد اضافه شد</span>
              </>
            ) : product.stock > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>افزودن سریع به سبد</span>
              </>
            ) : (
              <span>ناموجود</span>
            )}
          </button>
        </div>
      </Link>

      {/* اطلاعات متنی و قیمتی */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* دسته‌بندی و امتیاز */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
            <span>{product.category?.name || "استایلینگ"}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {toPersianDigits(product.rating.toFixed(1))}
              </span>
              <span className="text-zinc-400 text-[10px]">({toPersianDigits(product.reviewCount)})</span>
            </div>
          </div>

          {/* عنوان محصول */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* تنوع رنگ‌ها */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-zinc-400">رنگ‌ها:</span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-medium">
                {product.colors.slice(0, 2).join("، ")}
                {product.colors.length > 2 && ` و ${toPersianDigits(product.colors.length - 2)} رنگ دیگر`}
              </span>
            </div>
          )}
        </div>

        {/* ردیف قیمت و دکمه موبایل */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-[11px] text-zinc-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50">
                  {formatPrice(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* دکمه افزودن کوچک برای موبایل */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
            title="افزودن به سبد"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}