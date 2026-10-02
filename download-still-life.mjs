import fs from "fs";
import path from "path";

// لیست تصاویر ۱۰۰٪ بدون چهره و بدون مدل انسانی (صرفاً چوب‌لباسی، تخت، کفش، کیف، پارچه و استودیو)
const stillLifeImages = [
  // داستان برند: ابزار خیاطی و پارچه
  { url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop", file: "public/images/hero/story-craft.jpg" },

  // دسته‌بندی‌ها: مانکن، چوب‌لباسی، لباس تا شده و کیف
  { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/coats-jackets.jpg" },
  { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/dresses-shirts.jpg" },
  { url: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/pants-skirts.jpg" },
  { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop", file: "public/images/categories/bags-accessories.jpg" },

  // محصولات: ۱. ترنچ کت (روی چوب‌لباسی و رگال)
  { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", file: "public/images/products/trench-1.jpg" },
  { url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop", file: "public/images/products/trench-2.jpg" },

  // محصولات: ۲. کت بلیزر (روی چوب‌لباسی چوبی)
  { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop", file: "public/images/products/blazer-1.jpg" },
  { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", file: "public/images/products/blazer-2.jpg" },

  // محصولات: ۳. پیراهن اسلیپ (رگال بوتیک و بافت پارچه)
  { url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop", file: "public/images/products/dress-1.jpg" },
  { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop", file: "public/images/products/dress-2.jpg" },

  // محصولات: ۴. شومیز کرپ (فلت‌لی تخت با دکمه صدفی)
  { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop", file: "public/images/products/shirt-1.jpg" },
  { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", file: "public/images/products/shirt-2.jpg" },

  // محصولات: ۵. شلوار فاق‌بلند (تا شده روی میز مینیمال)
  { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", file: "public/images/products/pants-1.jpg" },
  { url: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop", file: "public/images/products/pants-2.jpg" },

  // محصولات: ۶. دامن میدی ساتن (بافت چین‌دار و ساتن)
  { url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop", file: "public/images/products/skirt-1.jpg" },
  { url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop", file: "public/images/products/skirt-2.jpg" },

  // محصولات: ۷. کیف چرم ورونا (استیل‌لایف روی سنگ مرمر)
  { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", file: "public/images/products/bag-1.jpg" },
  { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop", file: "public/images/products/bag-2.jpg" },

  // محصولات: ۸. کفش لوفر چرم (استیل‌لایف روی چوب/سنگ)
  { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", file: "public/images/products/loafers-1.jpg" },
  { url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop", file: "public/images/products/loafers-2.jpg" },
];

async function downloadOne(item) {
  try {
    const res = await fetch(item.url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(item.file), { recursive: true });
    fs.writeFileSync(item.file, buffer);
    console.log(`✅ جایگزین شد: ${item.file} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (err) {
    console.error(`❌ خطا در دانلود ${item.file}:`, err.message);
  }
}

async function run() {
  console.log("در حال دانلود و جایگزینی عکس‌های بدون انسان...");
  for (const item of stillLifeImages) {
    await downloadOne(item);
  }
  console.log("پایان فرایند جایگزینی عکس‌ها.");
}

run();