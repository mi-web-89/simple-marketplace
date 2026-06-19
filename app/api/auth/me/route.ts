import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { withErrorHandler, ApiError } from "@/lib/api-error";

export const GET = withErrorHandler(async () => {
  const user = await getSession();

  if (!user) {
    throw ApiError.unauthorized();
  }

  return NextResponse.json({ user });
});
