import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowLeft, Truck, Calendar, Hash, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, toPersianDigits, getOrderStatusLabel } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams;

  const order = orderNumber
    ? await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* کارت تایید تراکنش */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-500">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            پرداخت تایید شد
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-zinc-950 dark:text-zinc-50">
            سفارش شما با موفقیت ثبت گردید
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            از حسن اعتماد شما به استودیو مد سیلوئت سپاسگزاریم. سفارش شما جهت کنترل کیفیت و بسته‌بندی پرمیوم به آتلیه ارسال شد.
          </p>
        </div>

        {order && (
          <div className="p-4 bg-stone-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">شماره سفارش:</span>
              <strong className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">کد رهگیری پستی:</span>
              <strong className="font-mono text-zinc-900 dark:text-zinc-100">{order.trackingCode || "در انتظار ارسال"}</strong>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">تاریخ ثبت:</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">وضعیت سفارش:</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOrderStatusLabel(order.status).color}`}>
                {getOrderStatusLabel(order.status).label}
              </span>
            </div>
          </div>
        )}

        {/* خلاصه فاکتور */}
        {order && (
          <div className="text-right border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              اقلام خریداری‌شده
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.items.map((item) => {
                const images = JSON.parse(item.product.images) as string[];
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                        <Image
                          src={images[0] || "/images/products/trench-1.jpg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.product.title}</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          سایز: {item.selectedSize} | رنگ: {item.selectedColor} | تعداد: {toPersianDigits(item.quantity)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* جمع مبالغ */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>جمع کل اقلام:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>تخفیف اعمال‌شده:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span>{order.shippingFee === 0 ? "رایگان" : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span>مبلغ پرداخت‌شده (تایید درگاه):</span>
                <span className="text-base text-zinc-950 dark:text-amber-300 font-serif">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* آدرس ارسال */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <p><strong>تحویل‌گیرنده:</strong> {order.customerName} ({toPersianDigits(order.customerPhone)})</p>
              <p><strong>نشانی ارسال:</strong> {order.customerAddress}</p>
            </div>
          </div>
        )}

        {/* دکمه‌های بازگشت */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>مشاهده همه سفارشات</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}