"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Mail,
  ArrowLeft,
  Sparkles,
  Heart,
} from "lucide-react";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-stone-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 mt-20">
      {/* ارزش‌های متمایز برند (Brand Value Pillars) */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0 shadow-xs">
                <Truck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">ارسال اختصاصی اکسپرس</h4>
                <p className="text-[11px] text-zinc-500">تحویل ۲۴ ساعته در تهران، ۴۸ ساعته کل کشور</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">تضمین اصالت پارچه و دوخت</h4>
                <p className="text-[11px] text-zinc-500">متریال ۱۰۰٪ طبیعی و مرغوب وارداتی</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0 shadow-xs">
                <RefreshCw className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">۷ روز ضمانت بازگشت و تعویض</h4>
                <p className="text-[11px] text-zinc-500">بدون قید و شرط و تعویض رایگان سایز</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0 shadow-xs">
                <Headphones className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">مشاوره VIP استایلینگ</h4>
                <p className="text-[11px] text-zinc-500">پاسخگویی روزانه از ساعت ۹ الی ۲۲</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* بخش اصلی ستون‌های فوتر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* ستون درباره برند */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-[0.25em] uppercase text-zinc-950 dark:text-zinc-50 font-serif">
                SILHOUETTE
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-400">
                ATELIER &middot; MODE
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              استودیو مد سیلوئت با هدف بازتعریف استایل شیک، ساده و فاخر متولد شده است. ما با تلفیق مینیمالیسم فرانسوی و هنر دوخت ایرانی، مجموعه‌هایی جاودانه خلق می‌کنیم که فارغ از گذر زمان، زیبایی و اعتمادبه‌نفس شما را منعکس کنند.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-900 border border-amber-200/60 dark:border-zinc-800 text-[11px] text-amber-900 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  <strong>اکانت دمو ادمین جهت تست:</strong> admin@silhouette.ir / رمز: Admin@123456
                </span>
              </div>
            </div>
          </div>

          {/* ستون لینک‌های فروشگاه */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              کالکشن‌ها
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=coats-jackets" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  پالتو و بارانی
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dresses-shirts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  پیراهن و شومیز
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pants-skirts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  شلوار و دامن
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bags-accessories" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  کیف و کفش چرم
                </Link>
              </li>
              <li>
                <Link href="/shop?trending=true" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  محصولات ترند
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون خدمات مشتریان */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              خدمات مشتریان
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  پیگیری آنلاین سفارش
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  داشبورد مدیریت (ادمین)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  راهنمای انتخاب سایز
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  ورود به حساب کاربری
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون خبرنامه اختصاصی */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              عضویت در کلوپ سیلوئت
            </h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              با عضویت در خبرنامه، زودتر از همه از رونمایی کالکشن‌های فصلی و حراج‌های محرمانه با ۲۰٪ تخفیف مطلع شوید.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="ایمیل کاری یا شخصی شما..."
                  className="w-full px-3 py-2.5 pl-9 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>عضویت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-emerald-600 font-medium">
                ایمیل شما با موفقیت ثبت شد. به جمع همراهان سیلوئت خوش آمدید!
              </p>
            )}
          </div>

        </div>
      </div>

      {/* کپی‌رایت و امضای پروژه ویترینی کارلنسر */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} استودیو مد و پوشاک سیلوئت (Silhouette Mode). تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-2 text-zinc-500">
            <span>طراحی و توسعه اختصاصی با Next.js و Tailwind CSS</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>نمونه‌کار ویترینی کارلنسر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}