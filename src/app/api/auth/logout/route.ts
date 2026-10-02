import { apiSuccess } from "@/lib/api-response";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = apiSuccess(null, "با موفقیت خارج شدید");
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}