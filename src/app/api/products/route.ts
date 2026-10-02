import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateProductSchema, formatZodIssues } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (category && category !== "all") {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
    }

    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        },
      ];
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (trending === "true") {
      where.isTrending = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      colors: JSON.parse(p.colors) as string[],
      sizes: JSON.parse(p.sizes) as string[],
      images: JSON.parse(p.images) as string[],
    }));

    return apiSuccess({ products: parsedProducts, total: parsedProducts.length }, "لیست محصولات با موفقیت دریافت شد");
  } catch (error) {
    console.error("Products GET error:", error);
    return apiError("خطا در دریافت لیست محصولات", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        "اطلاعات محصول ارسالی نامعتبر است",
        "VALIDATION_ERROR",
        400,
        formatZodIssues(parsed.error)
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return apiError("محصولی با این اسلاگ / شناسه یکتا قبلاً ثبت شده است", "DUPLICATE_SLUG", 409);
    }

    const newProduct = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || null,
        stock: data.stock,
        categoryId: data.categoryId,
        colors: JSON.stringify(data.colors),
        sizes: JSON.stringify(data.sizes),
        images: JSON.stringify(data.images),
        details: data.details || null,
        isFeatured: data.isFeatured,
        isTrending: data.isTrending,
      },
      include: {
        category: true,
      },
    });

    return apiSuccess(
      {
        product: {
          ...newProduct,
          colors: JSON.parse(newProduct.colors),
          sizes: JSON.parse(newProduct.sizes),
          images: JSON.parse(newProduct.images),
        },
      },
      "محصول جدید با موفقیت ایجاد گردید",
      201
    );
  } catch (error) {
    console.error("Product POST error:", error);
    return apiError("خطا در ثبت محصول در پایگاه داده", "INTERNAL_SERVER_ERROR", 500);
  }
}