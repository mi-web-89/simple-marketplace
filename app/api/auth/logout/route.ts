import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export const POST = withErrorHandler(async () => {
  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("auth_refresh_token", "", { maxAge: 0, path: "/" });

  logger.info("AUTH", "User logged out");

  return response;
});
