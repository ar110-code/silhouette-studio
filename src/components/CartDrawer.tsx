"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowLeft, ShoppingBag, Tag, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, toPersianDigits } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    discountCode,
    applyCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 3000000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    setCouponFeedback(res);
  };

  const handleQuickApply = (code: string) => {
    setInputCode(code);
    const res = applyCoupon(code);
    setCouponFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* بک‌دراپ تاریک با بلر ملایم */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-stone-50 dark:bg-zinc-900 shadow-2xl flex flex-col border-r border-zinc-200 dark:border-zinc-800">
          
          {/* هدر سبد خرید */}
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                سبد خرید شما ({toPersianDigits(items.reduce((s, i) => s + i.quantity, 0))} قلم کالا)
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* نوار پیشرفت ارسال رایگان */}
          <div className="px-6 py-3 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-900/40 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-amber-900 dark:text-amber-200 mb-1.5 font-medium">
                فقط <strong className="font-bold">{formatPrice(remainingForFreeShipping)}</strong> دیگر تا ارسال کاملاً رایگان!
              </p>
            ) : (
              <p className="text-emerald-700 dark:text-emerald-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                تبریک! سفارش شما مشمول ارسال رایگان شد.
              </p>
            )}
            <div className="w-full bg-amber-200/50 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* محتوای آیتم‌های سبد خرید */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  سبد خرید شما خالی است
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  کالکشن‌های پاییزی و مد فاخر سیلوئت را مرور کنید و استایل منحصربه‌فرد خود را بسازید.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  مشاهده همه محصولات
                </Link>
              </div>
            ) : (
              items.map((item, idx) => {
                const activePrice = item.product.discountPrice ?? item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 shadow-xs"
                  >
                    {/* تصویر بندانگشتی محصول */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                      <Image
                        src={item.product.images[0] || "/images/products/trench-1.jpg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* مشخصات کالا */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors"
                            title="حذف از سبد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                          <span>سایز: <strong>{item.selectedSize}</strong></span>
                          <span>&bull;</span>
                          <span>رنگ: <strong>{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                        {/* شمارنده تعداد */}
                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-zinc-900">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold">
                            {toPersianDigits(item.quantity)}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* قیمت سطر */}
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(activePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* بخش فوتر و محاسبات سبد خرید */}
          {items.length > 0 && (
            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              
              {/* اعمال کوپن تخفیف */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="کد تخفیف (مثل WELCOME20)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors"
                  >
                    اعمال
                  </button>
                </div>

                {/* دکمه‌های تخفیف پیشنهادی سریع */}
                {!discountCode && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-zinc-400">کدهای فعال:</span>
                    <button
                      onClick={() => handleQuickApply("WELCOME20")}
                      className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 flex items-center gap-1 hover:bg-amber-100"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      WELCOME20 (۲۰٪ تخفیف)
                    </button>
                  </div>
                )}

                {couponFeedback && (
                  <p className={`text-[11px] font-medium ${couponFeedback.success ? "text-emerald-600" : "text-rose-600"}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* خلاصه ارقام مالی */}
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span>مجموع ارزش کالاها:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>تخفیف ویژه ({discountCode}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span>{shippingFee === 0 ? "رایگان (هدایت ویژه)" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-base text-zinc-950 dark:text-amber-300">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* دکمه تکمیل سفارش */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.99]"
              >
                <span>ادامه و ثبت نهایی سفارش</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}