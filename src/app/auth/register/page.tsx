"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await register(name, email, password, phone);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/shop");
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 dark:text-zinc-50 font-serif">
            SILHOUETTE
          </span>
        </Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          ایجاد حساب کاربری جدید
        </h1>
        <p className="text-xs text-zinc-500">
          با عضویت در سیلوئت از ۲۰٪ تخفیف روی اولین سفارش خود بهره‌مند شوید.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="سارا رادمنش"
                className="w-full px-4 py-2.5 pr-10 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <User className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
            </div>
          </div>

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
              شماره موبایل (اختیاری)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912..."
                className="w-full px-4 py-2.5 pr-10 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 dir-ltr text-right"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              رمز عبور (حداقل ۶ نویسه)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
            {isSubmitting ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام و ورود"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-500">
          <span>قبلاً عضو شده‌اید؟ </span>
          <Link href="/auth/login" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
            وارد شوید
          </Link>
        </div>
      </div>

    </div>
  );
}