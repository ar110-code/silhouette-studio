"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2 } from "lucide-react";

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center gap-3 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}