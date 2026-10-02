import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateOrderStatusSchema, formatZodIssues } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        "وضعیت جدید نامعتبر است",
        "VALIDATION_ERROR",
        400,
        formatZodIssues(parsed.error)
      );
    }

    const { status, trackingCode } = parsed.data;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingCode ? { trackingCode } : {}),
      },
    });

    return apiSuccess({ order: updatedOrder }, "وضعیت سفارش با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("Order PATCH error:", error);
    return apiError("خطا در به‌روزرسانی وضعیت سفارش", "INTERNAL_SERVER_ERROR", 500);
  }
}