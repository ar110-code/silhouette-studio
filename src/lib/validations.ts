import { z, ZodError } from "zod";

export function formatZodIssues(error: ZodError): string[] {
  return error.issues.map((i) => i.message);
}

export const RegisterSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ نویسه باشد"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const CreateProductSchema = z.object({
  title: z.string().min(2, "عنوان محصول الزامی است"),
  slug: z.string().min(2, "اسلاگ محصول الزامی است"),
  description: z.string().min(5, "توضیحات محصول الزامی است"),
  price: z.number().positive("قیمت باید عددی مثبت باشد"),
  discountPrice: z.number().positive("قیمت تخفیف‌خورده باید مثبت باشد").optional().nullable(),
  stock: z.number().int().min(0, "موجودی انبار نمی‌تواند منفی باشد").default(10),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  colors: z.array(z.string()).min(1, "حداقل یک رنگ باید مشخص شود"),
  sizes: z.array(z.string()).min(1, "حداقل یک سایز باید مشخص شود"),
  images: z.array(z.string()).min(1, "حداقل یک تصویر الزامی است"),
  details: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "شناسه کالا الزامی است"),
  selectedSize: z.string().min(1, "سایز انتخابی الزامی است"),
  selectedColor: z.string().min(1, "رنگ انتخابی الزامی است"),
  quantity: z.number().int().positive("تعداد باید حداقل ۱ باشد"),
  unitPrice: z.number().positive("قیمت واحد نامعتبر است"),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, "نام تحویل‌گیرنده الزامی است"),
  customerPhone: z.string().min(10, "شماره تماس معتبر وارد کنید"),
  customerAddress: z.string().min(5, "آدرس پستی کامل الزامی است"),
  postalCode: z.string().optional(),
  paymentMethod: z.string().default("درگاه پرداخت شاپرک"),
  items: z.array(OrderItemSchema).min(1, "سبد خرید نمی‌تواند خالی باشد"),
  discountCode: z.string().optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  trackingCode: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;