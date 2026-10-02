"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  AlertCircle,
  Plus,
  CheckCircle2,
  ShieldCheck,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Order, Product, Category } from "@/types";
import { formatPrice, formatDate, toPersianDigits, getOrderStatusLabel } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, quickDemoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });

  const [loadingData, setLoadingData] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDiscountPrice, setNewDiscountPrice] = useState("");
  const [newStock, setNewStock] = useState("10");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newColors, setNewColors] = useState("مشکی، سفید عاجی، بژ");
  const [newSizes, setNewSizes] = useState("S, M, L, XL");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDetails, setNewDetails] = useState("جنس: ۱۰۰٪ کتان طبیعی | دوخت سارتوریال آتلیه");
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      const [ordersJson, productsJson, categoriesJson] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ]);

      if (ordersJson.success) setOrders(ordersJson.data.orders || []);
      if (productsJson.success) setProducts(productsJson.data.products || []);
      if (categoriesJson.success) {
        setCategories(categoriesJson.data.categories || []);
        if (categoriesJson.data.categories?.length > 0 && !newCategoryId) {
          setNewCategoryId(categoriesJson.data.categories[0].id);
        }
      }

      const orderList = ordersJson.data?.orders || [];
      const productList = productsJson.data?.products || [];
      const revenue = orderList.reduce((sum: number, o: Order) => sum + o.totalAmount, 0);
      const lowStock = productList.filter((p: Product) => p.stock <= 8).length;

      setStats({
        totalRevenue: revenue,
        totalOrders: orderList.length,
        totalProducts: productList.length,
        totalCustomers: Math.max(1, orderList.length + 1),
        lowStockCount: lowStock,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
        );
        showFeedback("وضعیت سفارش با موفقیت در دیتابیس به‌روزرسانی شد.");
      } else {
        showFeedback(json.error?.message || "خطا در تغییر وضعیت", true);
      }
    } catch {
      showFeedback("خطا در ارسال درخواست", true);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);

    try {
      const colorsArr = newColors.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
      const sizesArr = newSizes.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
      const imagesArr = [newImageUrl.trim() || "/images/products/trench-1.jpg"];

      const payload = {
        title: newTitle.trim(),
        slug: newSlug.trim() || `prod-${Date.now()}`,
        description: newDescription.trim(),
        price: parseInt(newPrice),
        discountPrice: newDiscountPrice ? parseInt(newDiscountPrice) : null,
        stock: parseInt(newStock) || 10,
        categoryId: newCategoryId,
        colors: colorsArr.length > 0 ? colorsArr : ["اصلی"],
        sizes: sizesArr.length > 0 ? sizesArr : ["Free Size"],
        images: imagesArr,
        details: newDetails.trim(),
        isFeatured: false,
        isTrending: true,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data?.product) {
        setProducts((prev) => [json.data.product, ...prev]);
        setIsAddModalOpen(false);
        showFeedback("محصول جدید با موفقیت به پایگاه‌داده و فروشگاه اضافه شد!");
        setNewTitle("");
        setNewSlug("");
        setNewDescription("");
        setNewPrice("");
        setNewDiscountPrice("");
        setNewImageUrl("");
      } else {
        showFeedback(json.error?.message || "خطا در ثبت محصول", true);
      }
    } catch {
      showFeedback("خطای سرور در افزودن محصول", true);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const showFeedback = (text: string, error = false) => {
    setFeedbackMsg({ text, error });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredOrders = orders.filter((o) =>
    selectedStatusFilter === "ALL" ? true : o.status === selectedStatusFilter
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold fixed top-24 left-1/2 -translate-x-1/2 z-50 shadow-xl border animate-in slide-in-from-top-4 ${
            feedbackMsg.error
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      <div className="p-4 rounded-3xl bg-zinc-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-100">
                داشبورد مدیریت پیشرفته استودیو سیلوئت (Admin Panel)
              </h2>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                دسترسی کامل دمو
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              مدیریت زنده کاتالوگ محصولات، تغییر وضعیت ارسال سفارش‌ها و گزارشات مالی متصل به دیتابیس محلی SQLite
            </p>
          </div>
        </div>

        {user?.role !== "ADMIN" && (
          <button
            onClick={() => quickDemoLogin("ADMIN")}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ورود ۱-کلیکه به عنوان ادمین ارشد</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>مجموع فروش خالص</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50">
            {formatPrice(stats.totalRevenue)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">+۲۴٪ رشد نسبت به ماه قبل</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>کل سفارشات ثبت‌شده</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50">
            {toPersianDigits(stats.totalOrders)} سفارش
          </div>
          <p className="text-[11px] text-zinc-500">پرداخت‌شده و تاییدیه درگاه</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>تنوع محصولات فعال</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50">
            {toPersianDigits(stats.totalProducts)} مدل
          </div>
          <p className="text-[11px] text-zinc-500">در ۴ دسته‌بندی اصلی</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>هشدار موجودی انبار</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-zinc-50">
            {toPersianDigits(stats.lowStockCount)} کالا
          </div>
          <p className="text-[11px] text-amber-600 font-medium">موجودی کمتر از ۸ عدد</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              مدیریت سفارش‌ها ({toPersianDigits(orders.length)})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "products"
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              مدیریت محصولات و انبار ({toPersianDigits(products.length)})
            </button>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن محصول جدید</span>
            </button>
          )}

          {activeTab === "orders" && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">فیلتر وضعیت:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200"
              >
                <option value="ALL">همه وضعیت‌ها</option>
                <option value="PROCESSING">در حال پردازش</option>
                <option value="SHIPPED">تحویل به شرکت پست</option>
                <option value="DELIVERED">تحویل شده</option>
                <option value="CANCELLED">لغو شده</option>
              </select>
            </div>
          )}
        </div>

        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-stone-100/70 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200/80 dark:border-zinc-800">
                  <th className="py-3 px-6">شماره سفارش</th>
                  <th className="py-3 px-6">خریدار و تماس</th>
                  <th className="py-3 px-6">اقلام خریداری‌شده</th>
                  <th className="py-3 px-6">مبلغ کل</th>
                  <th className="py-3 px-6">وضعیت فعلی</th>
                  <th className="py-3 px-6">تغییر وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                      هیچ سفارشی در این وضعیت وجود ندارد.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = getOrderStatusLabel(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {order.orderNumber}
                          <span className="block text-[10px] text-zinc-400 font-sans mt-0.5">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {toPersianDigits(order.customerPhone)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-0.5 max-w-xs">
                            {order.items.map((item, i) => (
                              <p key={i} className="text-[11px] text-zinc-600 dark:text-zinc-300 truncate">
                                &bull; {item.product?.title || "کالای مد"} ({toPersianDigits(item.quantity)} عدد - {item.selectedSize})
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-zinc-950 dark:text-zinc-50 font-serif">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order.id}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:border-zinc-500 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-900"
                            >
                              <option value="PROCESSING">در حال پردازش و بسته‌بندی</option>
                              <option value="SHIPPED">تحویل به شرکت پست</option>
                              <option value="DELIVERED">تحویل موفق به خریدار</option>
                              <option value="PENDING">در انتظار پرداخت</option>
                              <option value="CANCELLED">لغو سفارش</option>
                            </select>
                            {updatingOrderId === order.id && (
                              <span className="text-[10px] text-amber-600 animate-pulse font-medium">ذخیره...</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-stone-100/70 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200/80 dark:border-zinc-800">
                  <th className="py-3 px-6">تصویر و عنوان محصول</th>
                  <th className="py-3 px-6">دسته‌بندی</th>
                  <th className="py-3 px-6">قیمت اصلی / تخفیف</th>
                  <th className="py-3 px-6">موجودی انبار</th>
                  <th className="py-3 px-6">امتیاز</th>
                  <th className="py-3 px-6">لینک</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-6 flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                        <Image
                          src={prod.images[0] || "/images/products/trench-1.jpg"}
                          alt={prod.title}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {prod.title}
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-mono">{prod.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-zinc-600 dark:text-zinc-400">
                      {prod.category?.name || "استایلینگ"}
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-serif">
                        {formatPrice(prod.discountPrice ?? prod.price)}
                      </div>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-zinc-400 line-through">
                          {formatPrice(prod.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stock <= 8
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {toPersianDigits(prod.stock)} عدد
                      </span>
                    </td>
                    <td className="py-3 px-6 font-semibold">
                      ★ {toPersianDigits(prod.rating.toFixed(1))}
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>مشاهده</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  افزودن محصول جدید به دیتابیس
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">عنوان محصول *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newSlug) setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""));
                    }}
                    placeholder="مثال: ترنچ‌کت ابریشمی شانه‌دار"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">اسلاگ (URL) *</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="silk-trench-coat"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl dir-ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">قیمت اصلی (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="3800000"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">قیمت با تخفیف</label>
                  <input
                    type="number"
                    value={newDiscountPrice}
                    onChange={(e) => setNewDiscountPrice(e.target.value)}
                    placeholder="3400000"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">موجودی انبار *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl dir-ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">دسته‌بندی *</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">تصویر کالا (URL)</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">توضیحات محصول *</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="توضیحات جذاب و ادیتوریال درباره برش و سبک لباس..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isSubmittingProduct ? "در حال ثبت..." : "افزودن و ذخیره در دیتابیس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}