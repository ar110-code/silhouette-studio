"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, toPersianDigits } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, discountCode, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("درگاه پرداخت شاپرک");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const handleFillDemoData = () => {
    setCustomerName("سارا رادمنش");
    setCustomerPhone("09121234567");
    setCustomerAddress("تهران، الهیه، خیابان فرشته، بن‌بست نیلوفر، پلاک ۱۲، واحد ۳۰۱");
    setPostalCode("1985612345");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("سبد خرید شما خالی است.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage("لطفاً نام، شماره تماس و آدرس تحویل را وارد فرمایید.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerAddress,
        postalCode: postalCode.trim() || undefined,
        paymentMethod,
        discountCode: discountCode || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
          unitPrice: item.product.discountPrice ?? item.product.price,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (json.success && json.data?.order) {
        clearCart();
        router.push(`/orders/success?orderNumber=${json.data.order.orderNumber}`);
      } else {
        setErrorMessage(json.error?.message || "خطا در ثبت سفارش. لطفاً دوباره تلاش فرمایید.");
      }
    } catch {
      setErrorMessage("خطای غیرمنتظره در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          سبد خرید شما خالی است
        </h2>
        <p className="text-xs text-zinc-500">
          برای تکمیل سفارش، ابتدا محصول مورد نظر خود را به سبد خرید اضافه فرمایید.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-zinc-950 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            مشاهده کالکشن‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* هدر صفحه تسویه‌حساب */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            گام نهایی خرید
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-zinc-50 mt-1">
            تسویه‌حساب و ثبت اطلاعات ارسال
          </h1>
        </div>

        <button
          type="button"
          onClick={handleFillDemoData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-zinc-900 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-zinc-700 text-xs font-semibold hover:bg-amber-100 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>تکمیل سریع با اطلاعات نمونه تستی (مخصوص کارفرما)</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ستون اطلاعات پستی و نحوه پرداخت */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* بخش ۱: اطلاعات تحویل‌گیرنده */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <Truck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                ۱. مشخصات پستی و تحویل‌گیرنده
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  نام و نام خانوادگی تحویل‌گیرنده *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: سارا رادمنش"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  شماره موبایل جهت هماهنگی پیک *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                آدرس کامل پستی (شامل شهر، خیابان، پلاک و واحد) *
              </label>
              <textarea
                required
                rows={3}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="تهران، زعفرانیه، خیابان..."
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5 sm:w-1/2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                کد پستی ۱۰ رقمی (اختیاری)
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="1987654321"
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* بخش ۲: انتخاب درگاه پرداخت */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <CreditCard className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                ۲. روش پرداخت
              </h2>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod("درگاه پرداخت شاپرک")}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "درگاه پرداخت شاپرک"
                    ? "border-zinc-950 dark:border-white bg-stone-50 dark:bg-zinc-800/40"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "درگاه پرداخت شاپرک"}
                  onChange={() => setPaymentMethod("درگاه پرداخت شاپرک")}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      پرداخت آنلاین شاپرک (کلیه کارت‌های بانکی عضو شتاب)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      شبیه‌ساز آنی
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    اتصال به درگاه امن الکترونیک، کسر خودکار موجودی و تاییدیه فوری سفارش با تولید شماره پیگیری اختصاصی.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("کارت به کارت")}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "کارت به کارت"
                    ? "border-zinc-950 dark:border-white bg-stone-50 dark:bg-zinc-800/40"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "کارت به کارت"}
                  onChange={() => setPaymentMethod("کارت به کارت")}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    کارت به کارت مستقیم به شماره حساب آتلیه
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    واریز به حساب تجاری بانک سامان و اعلام شماره پیگیری به پشتیبانی.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* ستون خلاصه اقلام و فاکتور نهایی */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            فاکتور اقلام سفارش ({toPersianDigits(items.reduce((s, i) => s + i.quantity, 0))} قلم)
          </h2>

          {/* لیست کالاهای سبد خرید */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const activePrice = item.product.discountPrice ?? item.product.price;
              return (
                <div key={idx} className="flex gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <Image
                      src={item.product.images[0] || "/images/products/trench-1.jpg"}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        سایز: {item.selectedSize} | رنگ: {item.selectedColor} | تعداد: {toPersianDigits(item.quantity)}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-left">
                      {formatPrice(activePrice * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ردیف‌های محاسبات مالی */}
          <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between">
              <span>جمع ارزش کالاها:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>تخفیف کوپن ({discountCode}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>هزینه بسته‌بندی و ارسال:</span>
              <span>{shippingFee === 0 ? "رایگان" : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 dark:text-zinc-50 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span>مبلغ نهایی قابل پرداخت:</span>
              <span className="text-lg text-zinc-950 dark:text-amber-300 font-serif">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>

          {/* دکمه ثبت و پرداخت */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting ? "در حال اتصال به بانک و ثبت..." : `پرداخت امن و ثبت نهایی (${formatPrice(totalAmount)})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>پرداخت تحت بستر امن شاپرک با پروتکل رمزنگاری SSL</span>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}