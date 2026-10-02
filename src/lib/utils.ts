import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPersianDigits(input: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  return `${formatted} تومان`;
}

export function formatDate(dateInput: Date | string): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function getOrderStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "PENDING":
      return { label: "در انتظار پرداخت", color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300/40" };
    case "PROCESSING":
      return { label: "در حال پردازش و بسته‌بندی", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300/40" };
    case "SHIPPED":
      return { label: "تحویل به شرکت پست", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300/40" };
    case "DELIVERED":
      return { label: "تحویل موفق به خریدار", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/40" };
    case "CANCELLED":
      return { label: "لغو شده", color: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300/40" };
    default:
      return { label: status, color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" };
  }
}