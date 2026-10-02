import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, trendingProducts, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.findMany({
      where: { isTrending: true },
      take: 4,
      include: { category: true },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 4,
      include: { category: true },
    }),
  ]);

  const parsedTrending = trendingProducts.map((p) => ({
    ...p,
    colors: JSON.parse(p.colors) as string[],
    sizes: JSON.parse(p.sizes) as string[],
    images: JSON.parse(p.images) as string[],
  }));

  const parsedFeatured = featuredProducts.map((p) => ({
    ...p,
    colors: JSON.parse(p.colors) as string[],
    sizes: JSON.parse(p.sizes) as string[],
    images: JSON.parse(p.images) as string[],
  }));

  return (
    <div className="space-y-24">
      {/* ۱. بخش هیرو اصلی (Hero Section) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
        {/* تصویر پس‌زمینه با افکت گرادینت تاریک لوکس */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-fashion.jpg"
            alt="Silhouette Atelier Fashion Collection"
            fill
            priority
            className="object-cover object-top opacity-40 scale-105 animate-in fade-in zoom-in-105 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-zinc-950/80" />
        </div>

        {/* محتوای هیرو */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>رونمایی کالکشن اختصاصی پاییز و زمستان ۲۰۲۶</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.3] text-zinc-50 font-serif">
            سادگی در کمال؛ <br className="hidden sm:inline" />
            روایت معاصر مد و وقار
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light">
            تلاقی هنر خیاطی سارتوریال با مینیمالیسم آوانگارد پاریس. طراحی‌شده برای بانوانی که تمایز را نه در هیاهو، بلکه در اصالت خطوط و کیفیت پارچه‌ها جستجو می‌کنند.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-xs tracking-wider uppercase rounded-full transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>مشاهده همه محصولات</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-amber-300 border border-amber-400/30 backdrop-blur-md font-semibold text-xs rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>مشاهده داشبورد مدیریت (ویترینی کارلنسر)</span>
            </Link>
          </div>

          {/* شاخص‌های اطمینان در هیرو */}
          <div className="pt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">۱۰۰٪</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">متریال کتان و ابریشم طبیعی</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">۷ روز</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">ضمانت بازگشت و تعویض سایز</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-white">VIP</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">بسته‌بندی جعبه هاردباکس لوکس</div>
            </div>
          </div>
        </div>
      </section>

      {/* ۲. بخش دسته‌بندی‌ها و کالکشن‌های شاخص (Collections Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
              دسته‌بندی‌های اختصاصی
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 mt-1 font-serif">
              کالکشن‌های آتلیه سیلوئت
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 flex items-center gap-1 group"
          >
            <span>مشاهده همه دسته‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-mono">
                  {cat._count?.products || 0} مدل انحصاری
                </span>
                <h3 className="text-base font-bold mt-1 group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-300 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ۳. بخش محصولات ترند و پرطرفدار فصل (Trending Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>انتخاب سردبیر مد و استایلیست‌ها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 font-serif">
              محبوب‌ترین طراحی‌های این هفته
            </h2>
          </div>
          <Link
            href="/shop?trending=true"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 flex items-center gap-1 group"
          >
            <span>مشاهده همه ترندها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {parsedTrending.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ۴. بنر داستان برند و اصالت پارچه (Atelier Storytelling Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            
            <div className="p-8 sm:p-14 lg:p-16 space-y-6">
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase font-mono">
                داستان آتلیه مد سیلوئت
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
                ما لباس نمی‌پوشانیم؛ <br />
                شخصیت شما را بازتاب می‌دهیم.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                در استودیو سیلوئت، هر تاروپود با وسواس بی‌مانند انتخاب می‌شود. ما به جای تولید انبوه، به دوخت‌های محدود و اختصاصی باور داریم؛ لباس‌هایی با ماندگاری چند ده‌ساله که هیچ‌گاه از رده خارج نمی‌شوند و حس اعتمادبه‌نفس بی‌رقیبی خلق می‌کنند.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>الگوبرداری از ارگونومی بدن بانوان ایرانی با تن‌پوش بی‌نقص</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>استفاده از آسترهای ضدتعریق ابریشمی و یراق‌آلات آبکاری طلا</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>بسته‌بندی به سبک مزون‌های خصوصی میلان و پاریس</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-full transition-all shadow-md active:scale-95"
                >
                  <span>کشف کالکشن جدید</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative h-80 lg:h-[500px] w-full">
              <Image
                src="/images/hero/story-craft.jpg"
                alt="Silhouette Fashion Craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* ۵. بخش برگزیده‌ها و پیشنهادهای ویژه (Featured Collection) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              شاهکارهای دوخت
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 mt-1 font-serif">
              مجموعه برگزیده سیلوئت
            </h2>
          </div>
          <Link
            href="/shop?featured=true"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 flex items-center gap-1 group"
          >
            <span>مشاهده همه برگزیده‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {parsedFeatured.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ۶. نظرات مشتریان و جامعه خریداران (Social Proof) */}
      <section className="bg-stone-100/70 dark:bg-zinc-900/40 py-20 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
              صدای همراهان سیلوئت
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
              تجربه خرید از دید مشتریان آتلیه
            </h2>
            <p className="text-xs text-zinc-500">
              بیش از ۲,۵۰۰ مشتری وفادار در سراسر ایران که اصالت و کیفیت دوخت ما را انتخاب کرده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                «ترنچ‌کت نوآر رو سفارش دادم؛ بسته‌بندی فوق‌العاده شیک، ایستایی پارچه و تمیزی سجاف و دکمه‌ها واقعاً حیرت‌انگیز بود. دقیقاً مطابق عکس و حتی فراتر از انتظارم بود.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  س.ر
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">سارا رادمنش</h4>
                  <p className="text-[10px] text-zinc-400">خریدار ترنچ‌کت کلاسیک (تهران)</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                «کیف چرم ورونا رو خریدم؛ چرم طبیعی فوق‌العاده لطیف و دوخت دست بسیار تمیزی داره. نحوه ارسال و پاسخگویی پشتیبانی برای راهنمایی سایز هم عالی بود.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  م.ف
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">مریم فلاحی</h4>
                  <p className="text-[10px] text-zinc-400">خریدار کیف چرم ورونا (شیراز)</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                «کت بلیزر پشمی کارامل از نظر تن‌خور و اپل سرشانه کاملاً بی‌نقص است. به عنوان کسی که در حوزه مد و استایل فعالیت می‌کنم، واقعاً استاندارد این مزون را تحسین می‌کنم.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  ن.م
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">نگار مقیمی</h4>
                  <p className="text-[10px] text-zinc-400">استایلیست و طراح لباس (اصفهان)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}