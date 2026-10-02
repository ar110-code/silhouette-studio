"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = async (role: "ADMIN" | "CUSTOMER") => {
    setErrorMessage(null);
    setIsSubmitting(true);
    const res = await quickDemoLogin(role);
    setIsSubmitting(false);

    if (res.success) {
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* هدر فرم */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 dark:text-zinc-50 font-serif">
            SILHOUETTE
          </span>
        </Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          ورود به حساب کاربری
        </h1>
        <p className="text-xs text-zinc-500">
          برای دسترسی به سوابق سفارشات و پنل کاربری مشخصات خود را وارد فرمایید.
        </p>
      </div>

      {/* بخش دکمه‌های ورود سریع دمو مخصوص ارزیابی در کارلنسر */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>ورود سریع آزمایشی (بدون نیاز به تایپ رمز):</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin("ADMIN")}
            disabled={isSubmitting}
            className="p-2.5 rounded-xl bg-zinc-950 text-amber-300 text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ورود به عنوان مدیر</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("CUSTOMER")}
            disabled={isSubmitting}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-amber-300/80 hover:bg-amber-100/50 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-zinc-600" />
            <span>ورود به عنوان خریدار</span>
          </button>
        </div>
      </div>

      {/* فرم ورود معمولی */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              آدرس ایمیل
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 pr-10 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 dir-ltr text-right"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 dir-ltr text-right"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "در حال اعتبارسنجی..." : "ورود به حساب کاربری"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-500">
          <span>حساب کاربری ندارید؟ </span>
          <Link href="/auth/register" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
            ثبت‌نام در سیلوئت
          </Link>
        </div>
      </div>

    </div>
  );
}