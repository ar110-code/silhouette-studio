import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return apiSuccess({ categories }, "لیست دسته‌بندی‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Categories GET error:", error);
    return apiError("خطا در دریافت لیست دسته‌بندی‌ها", "INTERNAL_SERVER_ERROR", 500);
  }
}