import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(data: T, message: string = "عملیات با موفقیت انجام شد", status: number = 200) {
  const responseBody: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
  };
  return NextResponse.json(responseBody, { status });
}

export function apiError(
  message: string,
  code: string = "BAD_REQUEST",
  status: number = 400,
  details?: unknown
) {
  const responseBody: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return NextResponse.json(responseBody, { status });
}