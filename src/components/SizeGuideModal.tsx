"use client";

import React from "react";
import { X, Ruler, HelpCircle } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeChart = [
    { size: "XS", eu: "34", bust: "80-84", waist: "62-66", hips: "88-92" },
    { size: "S", eu: "36", bust: "84-88", waist: "66-70", hips: "92-96" },
    { size: "M", eu: "38-40", bust: "88-94", waist: "70-76", hips: "96-102" },
    { size: "L", eu: "42", bust: "94-100", waist: "76-82", hips: "102-108" },
    { size: "XL", eu: "44", bust: "100-106", waist: "82-88", hips: "108-114" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              راهنمای انتخاب سایز استاندارد سیلوئت
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            تمامی اندازه‌های جدول زیر بر حسب <strong>سانتی‌متر (CM)</strong> بوده و مربوط به اندازه بدن شماست. الگوی دوخت محصولات سیلوئت بر اساس متد استاندارد اروپایی (EU) است.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                  <th className="py-2.5 px-3 rounded-r-lg">سایز</th>
                  <th className="py-2.5 px-3">معادل EU</th>
                  <th className="py-2.5 px-3">دور سینه</th>
                  <th className="py-2.5 px-3">دور کمر</th>
                  <th className="py-2.5 px-3 rounded-l-lg">دور باسن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-50 dark:hover:bg-zinc-800/50">
                    <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{row.size}</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{toPersianDigits(row.eu)}</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{toPersianDigits(row.bust)}</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{toPersianDigits(row.waist)}</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{toPersianDigits(row.hips)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>نکته انتخاب استایل:</strong> اگر بین دو سایز تردید دارید یا به استایل‌های اورسایز و آزاد علاقه دارید، انتخاب یک سایز بزرگتر توصیه می‌شود. همچنین امکان تعویض رایگان سایز تا ۷ روز فراهم است.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
}