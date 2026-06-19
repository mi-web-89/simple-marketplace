import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth";
import { withErrorHandler, ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const refreshToken = request.cookies.get("auth_refresh_token")?.value;

  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token tidak ada");
  }

  const res = await fetch("https://dummyjson.com/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 60,
    }),
  });

  if (!res.ok) {
    logger.warn("AUTH", "Refresh token invalid, clearing cookies");
    const response = NextResponse.json(
      { error: "Session expired, silakan login kembali", code: "UNAUTHORIZED" },
      { status: 401 },
    );
    response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    response.cookies.set("auth_refresh_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  const data = await res.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set(
    accessTokenCookie.name,
    data.accessToken,
    accessTokenCookie.options,
  );

  response.cookies.set(
    refreshTokenCookie.name,
    data.refreshToken,
    refreshTokenCookie.options,
  );

  logger.info("AUTH", "Tokens refreshed");

  return response;
});
