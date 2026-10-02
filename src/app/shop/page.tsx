import React from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    trending?: string;
    featured?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const searchQuery = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const trending = resolvedParams.trending === "true";
  const featured = resolvedParams.featured === "true";

  // Build where filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (currentCategory !== "all") {
    where.OR = [
      { categoryId: currentCategory },
      { category: { slug: currentCategory } },
    ];
  }

  if (searchQuery) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      },
    ];
  }

  if (trending) where.isTrending = true;
  if (featured) where.isFeatured = true;

  // Build orderBy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    }),
  ]);

  const parsedProducts = products.map((p) => ({
    ...p,
    colors: JSON.parse(p.colors) as string[],
    sizes: JSON.parse(p.sizes) as string[],
    images: JSON.parse(p.images) as string[],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* هدر صفحه فروشگاه */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
          کالکشن کامل استودیو
        </span>
        <h1 className="text-3xl font-bold font-serif text-zinc-950 dark:text-zinc-50 mt-1">
          فروشگاه و آرشیو طراحی‌ها
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-xl">
          تمام مدل‌های طراحی‌شده در آتلیه مد سیلوئت با پارچه‌های طبیعی و دوخت سارتوریال را در این بخش بررسی بفرمایید.
        </p>
      </div>

      {/* تب‌های دسته‌بندی و فیلتر سریع */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* دسته‌بندی‌ها */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Link
            href={`/shop?sort=${sort}${searchQuery ? `&search=${searchQuery}` : ""}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              currentCategory === "all"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
            }`}
          >
            همه دسته‌ها ({toPersianDigits(products.length)})
          </Link>

          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug || currentCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}&sort=${sort}${searchQuery ? `&search=${searchQuery}` : ""}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                {cat.name} ({toPersianDigits(cat._count?.products || 0)})
              </Link>
            );
          })}
        </div>

        {/* مرتب‌سازی */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            مرتب‌سازی:
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <Link
              href={`/shop?category=${currentCategory}&sort=newest${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`px-2.5 py-1.5 rounded-lg ${sort === "newest" ? "font-bold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              جدیدترین
            </Link>
            <Link
              href={`/shop?category=${currentCategory}&sort=rating${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`px-2.5 py-1.5 rounded-lg ${sort === "rating" ? "font-bold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              محبوب‌ترین
            </Link>
            <Link
              href={`/shop?category=${currentCategory}&sort=price-asc${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`px-2.5 py-1.5 rounded-lg ${sort === "price-asc" ? "font-bold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              ارزان‌ترین
            </Link>
            <Link
              href={`/shop?category=${currentCategory}&sort=price-desc${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`px-2.5 py-1.5 rounded-lg ${sort === "price-desc" ? "font-bold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              گران‌ترین
            </Link>
          </div>
        </div>
      </div>

      {/* نمایش وضعیت فیلتر جستجو در صورت وجود */}
      {searchQuery && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Search className="w-4 h-4 text-amber-600" />
            <span>
              نتایج جستجو برای عبارت: <strong>«{searchQuery}»</strong>
            </span>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-rose-600 hover:underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            حذف فیلتر جستجو
          </Link>
        </div>
      )}

      {/* شبکه نمایش کارت‌های محصولات */}
      {parsedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            هیچ محصولی با معیارهای انتخابی یافت نشد
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            فیلترها یا عبارت جستجوی خود را تغییر دهید تا محصولات متنوع دیگر آتلیه را مشاهده فرمایید.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-zinc-950 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              مشاهده همه محصولات
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parsedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}