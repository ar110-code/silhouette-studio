import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      return apiError("محصول مورد نظر یافت نشد", "PRODUCT_NOT_FOUND", 404);
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: true,
      },
    });

    const parsedProduct = {
      ...product,
      colors: JSON.parse(product.colors) as string[],
      sizes: JSON.parse(product.sizes) as string[],
      images: JSON.parse(product.images) as string[],
    };

    const parsedRelated = relatedProducts.map((p) => ({
      ...p,
      colors: JSON.parse(p.colors) as string[],
      sizes: JSON.parse(p.sizes) as string[],
      images: JSON.parse(p.images) as string[],
    }));

    return apiSuccess(
      { product: parsedProduct, relatedProducts: parsedRelated },
      "اطلاعات محصول با موفقیت فراخوانی شد"
    );
  } catch (error) {
    console.error("Product [slug] GET error:", error);
    return apiError("خطا در دریافت اطلاعات محصول", "INTERNAL_SERVER_ERROR", 500);
  }
}