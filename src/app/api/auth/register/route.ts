import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterSchema, formatZodIssues } from "@/lib/validations";
import { hashPassword, signToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        "اطلاعات ارسالی نامعتبر است",
        "VALIDATION_ERROR",
        400,
        formatZodIssues(parsed.error)
      );
    }

    const { name, email, password, phone } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return apiError("حساب کاربری با این ایمیل قبلاً ثبت شده است", "USER_EXISTS", 409);
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as "CUSTOMER",
    });

    const response = apiSuccess(
      { user: newUser },
      "حساب کاربری شما با موفقیت ایجاد شد",
      201
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
    console.error("Register Error:", error);
    return apiError("خطای سرور در فرایند ثبت‌نام", "INTERNAL_SERVER_ERROR", 500);
  }
}