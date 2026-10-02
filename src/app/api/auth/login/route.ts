import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginSchema, formatZodIssues } from "@/lib/validations";
import { verifyPassword, signToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        "اطلاعات وارد شده نامعتبر است",
        "VALIDATION_ERROR",
        400,
        formatZodIssues(parsed.error)
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return apiError("ایمیل یا رمز عبور نادرست است", "INVALID_CREDENTIALS", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return apiError("ایمیل یا رمز عبور نادرست است", "INVALID_CREDENTIALS", 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "CUSTOMER",
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const response = apiSuccess(
      { user: safeUser },
      user.role === "ADMIN" ? "خوش آمدید مدیر گرامی" : "با موفقیت وارد شدید"
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 3600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return apiError("خطای سرور در فرایند ورود", "INTERNAL_SERVER_ERROR", 500);
  }
}