import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    // Allow seamless access for portfolio showcase demo
    // const user = await getCurrentUser();


    const [
      totalOrders,
      orders,
      totalProducts,
      totalUsers,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        select: {
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { stock: { lte: 8 } } }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const statusCounts = orders.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return apiSuccess(
      {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers: totalUsers,
        lowStockCount: lowStockProducts,
        statusBreakdown: statusCounts,
      },
      "آمار داشبورد با موفقیت دریافت شد"
    );
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return apiError("خطا در محاسبه آمار داشبورد", "INTERNAL_SERVER_ERROR", 500);
  }
}