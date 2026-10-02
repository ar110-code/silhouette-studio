import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع درج اطلاعات با تصاویر محلی (Seeding Local Assets)...");

  // پاک‌سازی قبلی
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ۱. ایجاد کاربران
  const adminPasswordHash = await bcrypt.hash("Admin@123456", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "مدیریت استودیو سیلوئت",
      email: "admin@silhouette.ir",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "09120000000",
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      name: "سارا رادمنش",
      email: "client@karlancer.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "09123456789",
    },
  });

  console.log("✅ کاربران ایجاد شدند:", admin.email, demoCustomer.email);

  // ۲. ایجاد دسته‌بندی‌ها با تصاویر محلی
  const catCoats = await prisma.category.create({
    data: {
      name: "پالتو، ترنچ‌کت و بارانی",
      slug: "coats-jackets",
      image: "/images/categories/coats-jackets.jpg",
      description: "طراحی‌های ماندگار پاییزه و زمستانه با پارچه‌های پشمی و کشمیری اعلا",
    },
  });

  const catDresses = await prisma.category.create({
    data: {
      name: "پیراهن، بلوز و شومیز",
      slug: "dresses-shirts",
      image: "/images/categories/dresses-shirts.jpg",
      description: "پیراهن‌های مجلسی و روزمره با الگوهای مدرن فرانسوی و تن‌خور آزاد",
    },
  });

  const catPants = await prisma.category.create({
    data: {
      name: "شلوار و دامن استایلینگ",
      slug: "pants-skirts",
      image: "/images/categories/pants-skirts.jpg",
      description: "برش‌های مهندسی‌شده کژوال و رسمی با پارچه‌های لینن و فاستونی فاخر",
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "کیف، کفش و اکسسوری چرم",
      slug: "bags-accessories",
      image: "/images/categories/bags-accessories.jpg",
      description: "دست‌دوزهای چرم طبیعی با الهام از خطوط هندسی مینیمال",
    },
  });

  console.log("✅ ۴ دسته‌بندی با تصاویر محلی ایجاد شد.");

  // ۳. ایجاد محصولات با آدرس تصاویر محلی
  const productsData = [
    {
      title: "ترنچ‌کت کلاسیک دوطرف‌دکمه نوآر (Noir Trench Coat)",
      slug: "noir-double-breasted-trench-coat",
      description: "ترنچ‌کت نمادین سیلوئت با الگوبرداری از سبک کلاسیک انگلیسی. دارای کمربند سگک‌دار قابل تنظیم، پارچه کتان ضدآب گاباردین با ایستایی بی‌نظیر و آستر ساتن ابریشمی که برای روزهای بارانی و استایل روزمره یا نیمه‌رسمی ایده‌آل است.",
      price: 4850000,
      discountPrice: 4250000,
      stock: 12,
      rating: 4.9,
      reviewCount: 24,
      isFeatured: true,
      isTrending: true,
      categoryId: catCoats.id,
      colors: JSON.stringify(["مشکی مات", "بژ کلاسیک", "خاکی دودی"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify([
        "/images/products/trench-1.jpg",
        "/images/products/trench-2.jpg",
      ]),
      details: "جنس: ۱۰۰٪ کتان گاباردین ضدآب | آستر: ساتن پلی‌استر ضدالکتریسیته | شست‌وشو: فقط خشک‌شویی تخصصی | قد مدل: ۱۷۶ سانتی‌متر (سایز M)",
    },
    {
      title: "کت بلیزر اورسایز پشمی کارامل (Caramel Wool Blazer)",
      slug: "caramel-wool-oversized-blazer",
      description: "کت بلیزر تک‌دکمه با شانه ساختاریافته و برش اورسایز مدرن. طراحی اختصاصی برای خانم‌هایی که به دنبال ترکیبی از قدرت، زنانگی و استایل مینیمال شهری هستند. پارچه پشمی لطیف با گرمابخشی مطبوع.",
      price: 3950000,
      discountPrice: null,
      stock: 18,
      rating: 5.0,
      reviewCount: 31,
      isFeatured: true,
      isTrending: true,
      categoryId: catCoats.id,
      colors: JSON.stringify(["شکلاتی کاراملی", "نوک‌مدادی", "کرم شتری"]),
      sizes: JSON.stringify(["XS", "S", "M", "L"]),
      images: JSON.stringify([
        "/images/products/blazer-1.jpg",
        "/images/products/blazer-2.jpg",
      ]),
      details: "جنس: ۸۰٪ پشم استرالیایی، ۲۰٪ کشمیر | دارای دو جیب فیلتابی در طرفین و چاک پشت | اتوکشی با بخار غیرمستقیم",
    },
    {
      title: "پیراهن ماکسی ابریشمی مینیمال عاجی (Ivory Silk Slip Dress)",
      slug: "ivory-silk-minimal-slip-dress",
      description: "پیراهن اسلیپ دوخته‌شده با ابریشم کج‌راه طبیعی که نرمی و ریزش فوق‌العاده‌ای روی بدن ایجاد می‌کند. یقه افتاده مدرن و بندهای اسپاگتی ظریف، این لباس را به انتخابی شکوهمند برای مهمانی‌های شبانه تبدیل کرده است.",
      price: 3200000,
      discountPrice: 2890000,
      stock: 8,
      rating: 4.8,
      reviewCount: 19,
      isFeatured: true,
      isTrending: false,
      categoryId: catDresses.id,
      colors: JSON.stringify(["سفید عاجی", "مشکی آبنوسی", "سبز زمردی"]),
      sizes: JSON.stringify(["XS", "S", "M"]),
      images: JSON.stringify([
        "/images/products/dress-1.jpg",
        "/images/products/dress-2.jpg",
      ]),
      details: "جنس: ۱۰۰٪ سیلک کرپ طبیعی | برش بایاس (کج‌راه) برای دربرگیری ارگونومیک اندام | شست‌وشوی دستی با آب سرد",
    },
    {
      title: "شومیز لخت کرپ با آستین مچی حجیم (Voluminous Crepe Shirt)",
      slug: "voluminous-crepe-designer-shirt",
      description: "شومیز لوکس با دکمه‌های مخفی از جنس صدف طبیعی و آستین‌های پرچین که حسی از اصالت و رمانتیسیسم معاصر را به نمایش می‌گذارد. ست‌پذیری عالی با شلوارهای راسته و دامن‌های میدی.",
      price: 2450000,
      discountPrice: null,
      stock: 22,
      rating: 4.7,
      reviewCount: 14,
      isFeatured: false,
      isTrending: true,
      categoryId: catDresses.id,
      colors: JSON.stringify(["سفید صدفی", "مشکی ذغالی", "آبی کاربنی مات"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify([
        "/images/products/shirt-1.jpg",
        "/images/products/shirt-2.jpg",
      ]),
      details: "جنس: کرپ والین پرمیوم | بدون چروک‌پذیری | قد از سرشانه: ۶۸ سانتی‌متر",
    },
    {
      title: "شلوار پالازو فاق‌بلند پینچ‌دار (High-Waist Pleated Trousers)",
      slug: "high-waist-pleated-palazzo-trousers",
      description: "شلوار فاق‌بلند با پیلی‌های دوتایی دقیق در جلو و پاچه‌های گشاد دراپ‌دار. دوخت سارتوریال با متریال کرپ فاستونی مرغوب که خطوط پا را کشیده و قامتی باوقار به بیننده القا می‌کند.",
      price: 2750000,
      discountPrice: 2450000,
      stock: 14,
      rating: 4.9,
      reviewCount: 27,
      isFeatured: true,
      isTrending: false,
      categoryId: catPants.id,
      colors: JSON.stringify(["مشکی زغالی", "کرم شتری", "طوسی ملانژ"]),
      sizes: JSON.stringify(["36", "38", "40", "42"]),
      images: JSON.stringify([
        "/images/products/pants-1.jpg",
        "/images/products/pants-2.jpg",
      ]),
      details: "جنس: فاستونی کشبافت مرغوب | کمربند سرخود با قفل استیل مات | دارای دو جیب مورب کاربردی",
    },
    {
      title: "دامن میدی ساتن با برش کلوش ملایم (Flared Satin Midi Skirt)",
      slug: "flared-satin-midi-skirt",
      description: "دامن میدی با درخشش ملایم ابریشمی که با هر قدم موج‌های چشم‌نوازی ایجاد می‌کند. کش پهن مخفی در دور کمر باعث راحتی در تمام طول روز و فیت شدن ایده‌آل روی گودی کمر می‌شود.",
      price: 2100000,
      discountPrice: null,
      stock: 9,
      rating: 4.8,
      reviewCount: 16,
      isFeatured: false,
      isTrending: true,
      categoryId: catPants.id,
      colors: JSON.stringify(["طلایی ملایم", "مشکی براق", "سبز سدری"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      images: JSON.stringify([
        "/images/products/skirt-1.jpg",
        "/images/products/skirt-2.jpg",
      ]),
      details: "جنس: ساتن مرسریزه‌شده | بدون نیاز به آستر | بلندی دامن: ۸۲ سانتی‌متر",
    },
    {
      title: "کیف دوشی هندسی چرم طبیعی ورونا (Verona Leather Crossbody)",
      slug: "verona-geometric-leather-crossbody",
      description: "طراحی تندیس‌گون و ساختار محکم با چرم گاوی فلوتر اعلا. یراق‌آلات آبکاری‌شده با طلای کهنه ۲۴ عیار مقاوم در برابر تغییر رنگ. فضاسازی داخلی تفکیک‌شده برای گوشی، کارت و وسایل ضروری.",
      price: 3600000,
      discountPrice: 3150000,
      stock: 6,
      rating: 5.0,
      reviewCount: 42,
      isFeatured: true,
      isTrending: true,
      categoryId: catAccessories.id,
      colors: JSON.stringify(["قهوه‌ای سوخته", "مشکی اطلسی", "سبز تیره"]),
      sizes: JSON.stringify(["تک‌سایز (Medium)"]),
      images: JSON.stringify([
        "/images/products/bag-1.jpg",
        "/images/products/bag-2.jpg",
      ]),
      details: "ابعاد: ۲۲ در ۱۶ در ۷ سانتی‌متر | چرم طبیعی ۱۰۰٪ دست‌ساز | دارای بند بلند رودوشی قابل تعویض",
    },
    {
      title: "کفش لوفر چرم واکس‌خورده با سگک آتلیه (Atelier Loafer Shoes)",
      slug: "atelier-buckle-leather-loafers",
      description: "لوفرهای کلاسیک با کفی طبی چندلایه و زیره رابر عاج‌دار ضدلغزش. سبک طراحی و دوخت پیرامونی دستی این مدل، ماندگاری و جذابیت آن را برای سال‌های متمادی ضمانت می‌کند.",
      price: 3400000,
      discountPrice: null,
      stock: 11,
      rating: 4.9,
      reviewCount: 20,
      isFeatured: false,
      isTrending: true,
      categoryId: catAccessories.id,
      colors: JSON.stringify(["مشکی پولیشی", "عسلی کهربایی"]),
      sizes: JSON.stringify(["37", "38", "39", "40", "41"]),
      images: JSON.stringify([
        "/images/products/loafers-1.jpg",
        "/images/products/loafers-2.jpg",
      ]),
      details: "رویه و آستر: تمام چرم طبیعی تنفس‌پذیر | ارتفاع پاشنه: ۳.۵ سانتی‌متر | کفی ضدتعریق با پد بالشتکی",
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const created = await prisma.product.create({
      data: prod,
    });
    createdProducts.push(created);
  }

  console.log(`✅ ${createdProducts.length} محصول با تصاویر محلی ذخیره شد.`);

  // ۴. ایجاد سفارش‌های دمو
  await prisma.order.create({
    data: {
      orderNumber: "SLH-98421",
      userId: demoCustomer.id,
      customerName: "سارا رادمنش",
      customerPhone: "09123456789",
      customerAddress: "تهران، زعفرانیه، خیابان آصف، برج نیلوفر، واحد ۴۰۲",
      postalCode: "1987654321",
      status: "PROCESSING",
      subtotal: 7400000,
      discount: 200000,
      shippingFee: 0,
      totalAmount: 7200000,
      paymentMethod: "درگاه پرداخت شاپرک",
      paymentStatus: "PAID",
      trackingCode: "TRK-2026-981",
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            selectedSize: "M",
            selectedColor: "مشکی مات",
            quantity: 1,
            unitPrice: 4250000,
            totalPrice: 4250000,
          },
          {
            productId: createdProducts[6].id,
            selectedSize: "تک‌سایز (Medium)",
            selectedColor: "مشکی اطلسی",
            quantity: 1,
            unitPrice: 3150000,
            totalPrice: 3150000,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "SLH-98418",
      customerName: "مریم فلاحی",
      customerPhone: "09351112233",
      customerAddress: "شیراز، قصرالدشت، کوچه ۳۴، پلاک ۱۸",
      postalCode: "7198765432",
      status: "SHIPPED",
      subtotal: 3950000,
      discount: 0,
      shippingFee: 65000,
      totalAmount: 4015000,
      paymentMethod: "درگاه پرداخت شاپرک",
      paymentStatus: "PAID",
      trackingCode: "POST-IR-8829104",
      items: {
        create: [
          {
            productId: createdProducts[1].id,
            selectedSize: "S",
            selectedColor: "شکلاتی کاراملی",
            quantity: 1,
            unitPrice: 3950000,
            totalPrice: 3950000,
          },
        ],
      },
    },
  });

  console.log("✨ تزریق داده‌های محلی با موفقیت به پایان رسید!");
}

main()
  .catch((e) => {
    console.error("❌ خطا در اجرای سید:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });