import fs from "fs";
import path from "path";

const imagesToDownload = [
  { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop", file: "public/images/hero/hero-fashion.jpg" },
  { url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop", file: "public/images/hero/story-craft.jpg" },

  { url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/coats-jackets.jpg" },
  { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/dresses-shirts.jpg" },
  { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/pants-skirts.jpg" },
  { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/bags-accessories.jpg" },

  { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop", file: "public/images/products/trench-1.jpg" },
  { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", file: "public/images/products/trench-2.jpg" },
  { url: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop", file: "public/images/products/blazer-1.jpg" },
  { url: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=800&auto=format&fit=crop", file: "public/images/products/blazer-2.jpg" },
  { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", file: "public/images/products/dress-1.jpg" },
  { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", file: "public/images/products/dress-2.jpg" },
  { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", file: "public/images/products/shirt-1.jpg" },
  { url: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=800&auto=format&fit=crop", file: "public/images/products/shirt-2.jpg" },
  { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", file: "public/images/products/pants-1.jpg" },
  { url: "https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop", file: "public/images/products/pants-2.jpg" },
  { url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop", file: "public/images/products/skirt-1.jpg" },
  { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", file: "public/images/products/bag-1.jpg" },
  { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop", file: "public/images/products/bag-2.jpg" },
  { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", file: "public/images/products/loafers-1.jpg" },
  { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop", file: "public/images/products/loafers-2.jpg" },
];

async function downloadOne(item) {
  try {
    const res = await fetch(item.url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(item.file), { recursive: true });
    fs.writeFileSync(item.file, buffer);
    console.log(`✅ ذخیره شد: ${item.file} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (err) {
    console.error(`❌ خطا در دانلود ${item.file}:`, err.message);
  }
}

async function run() {
  console.log("در حال دانلود تصاویر باکیفیت به صورت محلی...");
  for (const item of imagesToDownload) {
    await downloadOne(item);
  }
  console.log("پایان فرایند ذخیره‌سازی محلی تصاویر.");
}

run();