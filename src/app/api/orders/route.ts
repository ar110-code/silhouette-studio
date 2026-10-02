import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema, formatZodIssues } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (user && user.role !== "ADMIN") {
      where.userId = user.id;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    const parsedOrders = orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        ...i,
        product: {
          ...i.product,
          images: JSON.parse(i.product.images) as string[],
        },
      })),
    }));

    return apiSuccess({ orders: parsedOrders }, "لیست سفارش‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Orders GET error:", error);
    return apiError("خطا در بازیابی لیست سفارش‌ها", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        "اطلاعات ارسالی برای ثبت سفارش ناقص یا نامعتبر است",
        "VALIDATION_ERROR",
        400,
        formatZodIssues(parsed.error)
      );
    }

    const {
      customerName,
      customerPhone,
      customerAddress,
      postalCode,
      paymentMethod,
      items,
      discountCode,
    } = parsed.data;

    const user = await getCurrentUser();

    let subtotal = 0;
    const itemRecords: Array<{
      productId: string;
      selectedSize: string;
      selectedColor: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return apiError(`محصولی با شناسه ${item.productId} یافت نشد`, "PRODUCT_NOT_FOUND", 404);
      }

      if (product.stock < item.quantity) {
        return apiError(
          `موجودی محصول «${product.title}» ناکافی است (موجودی فعلی: ${product.stock})`,
          "INSUFFICIENT_STOCK",
          400
        );
      }

      const activePrice = product.discountPrice ?? product.price;
      const lineTotal = activePrice * item.quantity;
      subtotal += lineTotal;

      itemRecords.push({
        productId: product.id,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        unitPrice: activePrice,
        totalPrice: lineTotal,
      });
    }

    let discount = 0;
    if (discountCode) {
      const cleanCode = discountCode.trim().toUpperCase();
      if (cleanCode === "WELCOME20" || cleanCode === "KARLANCER") {
        discount = Math.round(subtotal * 0.2);
      } else if (cleanCode === "SILHOUETTE") {
        discount = Math.round(subtotal * 0.15);
      }
    }

    const shippingFee = subtotal > 3000000 ? 0 : 65000;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SLH-${randomSuffix}`;

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          customerName,
          customerPhone,
          customerAddress,
          postalCode: postalCode || null,
          status: "PROCESSING",
          subtotal,
          discount,
          shippingFee,
          totalAmount,
          paymentMethod,
          paymentStatus: "PAID",
          trackingCode: `SHP-${Math.floor(100000 + Math.random() * 900000)}`,
          items: {
            create: itemRecords,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, title: true, slug: true, images: true },
              },
            },
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });

    return apiSuccess(
      { order: newOrder },
      "سفارش شما با موفقیت ثبت شد و پرداخت تایید گردید",
      201
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return apiError("خطا در پردازش و ثبت سفارش", "INTERNAL_SERVER_ERROR", 500);
  }
}