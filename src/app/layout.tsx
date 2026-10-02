import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "استودیو مد سیلوئت | Silhouette Studio — فروشگاه پوشاک و اکسسوری لوکس",
  description: "مرجع تخصصی مد و استایل مینیمال، ترنچ‌کت‌های کتان ضدآب، پیراهن‌های ابریشمی و اکسسوری‌های دست‌دوز چرم طبیعی برند سیلوئت.",
  keywords: ["فروشگاه لباس لوکس", "ترنچ کت", "پیراهن مجلسی", "کیف چرم طبیعی", "استایل مینیمال", "سیلوئت"],
  authors: [{ name: "Silhouette Studio" }],
  openGraph: {
    title: "استودیو مد سیلوئت | Silhouette Studio",
    description: "کالکشن جدید پاییزه و زمستانه استودیو مد سیلوئت با طراحی معاصر و پارچه‌های فاخر",
    url: "https://silhouette.ir",
    siteName: "Silhouette Studio",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} font-sans antialiased`}>
      <body className="min-h-screen flex flex-col bg-stone-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-amber-200 selection:text-zinc-900">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Toast />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}