"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Check,
  Ruler,
  Truck,
  ShieldCheck,
  RefreshCw,
  Heart,
  Share2,
  ChevronDown,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductCard from "@/components/ProductCard";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { addItem } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "اصلی");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details");

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const activePrice = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* مسیر ناوبری خرد نان (Breadcrumbs) */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          صفحه اصلی
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-zinc-900 transition-colors">
          فروشگاه
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* بخش اصلی محصول: گالری + فرم سفارش */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ستون گالری تصاویر */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* تصاویر بندانگشتی */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-zinc-900 dark:border-white shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - تصویر ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* تصویر اصلی بزرگ */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <Image
              src={product.images[activeImageIndex] || "/images/products/trench-1.jpg"}
              alt={product.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {toPersianDigits(discountPercent)}٪ تخفیف اختصاصی
              </span>
            )}
          </div>
        </div>

        {/* ستون اطلاعات، انتخاب ویژگی‌ها و سفارش */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                {product.category?.name || "استایلینگ فاخر"}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {toPersianDigits(product.rating.toFixed(1))}
                </span>
                <span className="text-zinc-400">({toPersianDigits(product.reviewCount)} نظر خریداران)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50 mt-2 leading-relaxed">
              {product.title}
            </h1>

            {/* بخش قیمت */}
            <div className="mt-4 flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 font-serif">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 font-serif">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            {product.description}
          </p>

          <hr className="border-zinc-200/80 dark:border-zinc-800" />

          {/* انتخاب رنگ */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  رنگ انتخابی: <strong className="font-bold">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedColor === color
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-stone-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* انتخاب سایز با دکمه راهنما */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  سایز انتخابی: <strong className="font-bold">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>راهنمای اندازه‌گیری</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-11 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      selectedSize === size
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-stone-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* وضعیت موجودی انبار */}
          <div className="text-xs flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  موجود در انبار آتلیه ({toPersianDigits(product.stock)} عدد باقی مانده)
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-600 font-semibold">اتمام موجودی این مدل</span>
              </>
            )}
          </div>

          {/* انتخاب تعداد و دکمه افزودن به سبد */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-zinc-900 h-12">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors h-full"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold">
                {toPersianDigits(quantity)}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors h-full"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 h-12 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : product.stock > 0
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>با موفقیت به سبد افزوده شد</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </>
              )}
            </button>
          </div>

          {/* ویژگی‌های گارانتی و ارسال سریع */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-center">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <Truck className="w-4 h-4 text-zinc-700 dark:text-zinc-300 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">ارسال اکسپرس</div>
              <div className="text-[10px] text-zinc-400">تحویل ۲۴ تا ۴۸ ساعته</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <RefreshCw className="w-4 h-4 text-zinc-700 dark:text-zinc-300 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">تعویض سایز</div>
              <div className="text-[10px] text-zinc-400">تا ۷ روز بدون هزینه</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">اصالت تضمینی</div>
              <div className="text-[10px] text-zinc-400">۱۰۰٪ پارچه مرغوب</div>
            </div>
          </div>

          {/* تب‌های مشخصات، راهنمای شست‌وشو و شرایط ارسال */}
          <div className="pt-4 space-y-4">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${
                  activeTab === "details"
                    ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                مشخصات جنس و پارچه
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${
                  activeTab === "care"
                    ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                دستورالعمل شست‌وشو
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${
                  activeTab === "shipping"
                    ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                ارسال و بازگشت کالا
              </button>
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[60px]">
              {activeTab === "details" && (
                <p>{product.details || "متریال ۱۰۰٪ طبیعی با الیاف وارداتی و آستر ابریشم ضدالکتریسیته."}</p>
              )}
              {activeTab === "care" && (
                <p>
                  فقط خشک‌شویی تخصصی توصیه می‌شود. برای اتوکشی حتماً از بخار غیرمستقیم با حرارت ملایم و یک لایه پارچه محافظ نخی استفاده کنید. از چلاندن و خشک‌کن ماشینی پرهیز شود.
                </p>
              )}
              {activeTab === "shipping" && (
                <p>
                  تمامی سفارش‌های بالاتر از ۳ میلیون تومان شامل ارسال رایگان کشوری هستند. در صورت مغایرت سایز، تعویض کالا تا ۷ روز به صورت رایگان توسط پیک مزون در تهران و شرکت پست در شهرستان‌ها انجام می‌شود.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* محصولات مرتبط در همان دسته‌بندی */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-zinc-200/80 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50">
              مدل‌های پیشنهادی متناسب با این استایل
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* مدال راهنمای سایز */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}