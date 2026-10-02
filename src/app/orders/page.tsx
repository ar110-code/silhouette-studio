import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ArrowLeft, Clock, ShieldCheck, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, toPersianDigits, getOrderStatusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* هدر صفحه سفارشات */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            پیگیری آنلاین
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-zinc-50 mt-1">
            سفارش‌ها و مرسوله‌های ثبت‌شده
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            وضعیت پردازش و بسته‌بندی مرسولات آتلیه را به صورت زنده دنبال کنید.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>خرید مجدد از کالکشن‌ها</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            هنوز سفارشی ثبت نشده است
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            اولین کالای خود را از فروشگاه انتخاب و ثبت کنید تا فاکتور و کد رهگیری پستی آن در این بخش نمایش داده شود.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-zinc-950 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              مشاهده فروشگاه
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getOrderStatusLabel(order.status);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6"
              >
                {/* نوار بالای کارت سفارش */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-zinc-400 block">شماره سفارش:</span>
                      <strong className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        {order.orderNumber}
                      </strong>
                    </div>
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block">تاریخ ثبت:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* لیست اقلام سفارش */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item) => {
                    const images = JSON.parse(item.product.images) as string[];
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80"
                      >
                        <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                          <Image
                            src={images[0] || "/images/products/trench-1.jpg"}
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
                              سایز: {item.selectedSize} | رنگ: {item.selectedColor}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                            <span>{toPersianDigits(item.quantity)} عدد</span>
                            <span>{formatPrice(item.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* فوتر سفارش: آدرس و مبلغ کل */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-2 text-zinc-500 max-w-lg">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>تحویل به: <strong>{order.customerName}</strong> ({toPersianDigits(order.customerPhone)}) — {order.customerAddress}</span>
                  </div>

                  <div className="flex items-baseline gap-2 self-end sm:self-auto">
                    <span className="text-zinc-500">مبلغ پرداخت‌شده:</span>
                    <strong className="text-sm sm:text-base font-serif text-zinc-950 dark:text-amber-300 font-extrabold">
                      {formatPrice(order.totalAmount)}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}