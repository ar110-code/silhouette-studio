"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toPersianDigits } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* نوار اطلاعیه بالای سایت (Announcement Bar) */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-light">ارسال سریع و رایگان برای خریدهای بالای ۳ میلیون تومان در سراسر کشور</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-zinc-400">
            <span>کد تخفیف اولین سفارش: <strong className="text-amber-300 font-mono tracking-wider">WELCOME20</strong></span>
            <span className="text-zinc-600">|</span>
            <Link href="/admin" className="hover:text-zinc-200 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>پنل مدیریت ادمین</span>
            </Link>
          </div>
        </div>
      </div>

      {/* هدر اصلی */}
      <header className="sticky top-0 z-40 bg-stone-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* منوی موبایل (دکمه همبرگری) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 transition-colors"
              aria-label="منو"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* لوگوتایپ مینیمال پرمیوم برند «سیلوئت» */}
          <div className="flex items-center">
            <Link href="/" className="group flex flex-col items-start select-none">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-zinc-950 dark:text-zinc-50 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors font-serif">
                SILHOUETTE
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 -mt-1 font-sans">
                ATELIER &middot; MODE
              </span>
            </Link>
          </div>

          {/* لینک‌های ناوبری اصلی دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              صفحه اصلی
            </Link>
            <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              فروشگاه و همه محصولات
            </Link>
            <Link href="/shop?category=coats-jackets" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              پالتو و بارانی
            </Link>
            <Link href="/shop?category=dresses-shirts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              پیراهن و شومیز
            </Link>
            <Link href="/shop?category=pants-skirts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              شلوار و دامن
            </Link>
            <Link href="/shop?category=bags-accessories" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              اکسسوری چرم
            </Link>
          </nav>

          {/* ابزارهای کاربر: جستجو، حساب، سبد خرید */}
          <div className="flex items-center gap-3">
            {/* دکمه جستجو */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی مدل، رنگ، پالتو..."
                    className="w-48 sm:w-64 px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  title="جستجو در محصولات"
                >
                  <Search className="w-5 h-5 stroke-[1.75]" />
                </button>
              )}
            </div>

            {/* بخش ورود / پروفایل / ادمین */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-colors text-xs font-medium">
                  <UserIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                  {user.role === "ADMIN" && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">ادمین</span>
                  )}
                </button>

                {/* منوی کشویی پروفایل */}
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 hidden group-hover:block transition-all z-50">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                    <p className="truncate text-[11px]">{user.email}</p>
                  </div>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      داشبورد مدیریت ادمین
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    پیگیری سفارش‌های من
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 text-right"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج از حساب
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 p-2 sm:px-3 sm:py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* آیکون سبد خرید به همراه کشو تعاملی */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-zinc-950 text-white rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950 animate-in zoom-in-75">
                  {toPersianDigits(itemCount)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* منوی ریسپانسیو بازشونده در موبایل */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 py-1"
            >
              صفحه اصلی
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 py-1"
            >
              فروشگاه و همه محصولات
            </Link>
            <Link
              href="/shop?category=coats-jackets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-zinc-600 dark:text-zinc-400 py-1"
            >
              پالتو، ترنچ‌کت و بارانی
            </Link>
            <Link
              href="/shop?category=dresses-shirts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-zinc-600 dark:text-zinc-400 py-1"
            >
              پیراهن و شومیز ابریشم
            </Link>
            <Link
              href="/shop?category=pants-skirts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-zinc-600 dark:text-zinc-400 py-1"
            >
              شلوار و دامن استایلینگ
            </Link>
            <Link
              href="/shop?category=bags-accessories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-zinc-600 dark:text-zinc-400 py-1"
            >
              کیف و اکسسوری چرم
            </Link>
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-zinc-800 p-2.5 rounded-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                ورود به پنل مدیریت ادمین (دمو)
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}