import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth";
import { withErrorHandler, ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    throw ApiError.validation("Username dan password wajib diisi");
  }

  const dummyRes = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
      refreshExpiresInMins: 10080,
    }),
  });

  if (!dummyRes.ok) {
    const err = await dummyRes.json().catch(() => ({}));
    logger.warn("AUTH", "Login failed", {
      status: dummyRes.status,
      username,
    });
    throw new ApiError("UNAUTHORIZED", err.message ?? "Login gagal");
  }

  const data = await dummyRes.json();

  const response = NextResponse.json({
    success: true,
    user: {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    },
  });

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

  logger.info("AUTH", "User logged in", { userId: data.id, username: data.username });

  return response;
});
