import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("احراز هویت نشده‌اید", "UNAUTHORIZED", 401);
  }
  return apiSuccess({ user }, "اطلاعات کاربر با موفقیت دریافت شد");
}