import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("auth_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token tidak ada" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch("https://dummyjson.com/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 60, // access token baru: 1 jam
      }),
    });

    if (!res.ok) {
      // Refresh token invalid/expired → paksa logout
      const response = NextResponse.json(
        { error: "Session expired, silakan login kembali" },
        { status: 401 }
      );
      response.cookies.set("auth_token", "", { maxAge: 0 });
      response.cookies.set("auth_refresh_token", "", { maxAge: 0 });
      return response;
    }

    const data = await res.json();
    // data = { accessToken, refreshToken } — kedua token dirotate

    const response = NextResponse.json({ success: true });

    // Rotate access token
    response.cookies.set(
      accessTokenCookie.name,
      data.accessToken,
      accessTokenCookie.options
    );

    // Rotate refresh token juga (best practice: one-time use)
    response.cookies.set(
      refreshTokenCookie.name,
      data.refreshToken,
      refreshTokenCookie.options
    );

    return response;
  } catch (error) {
    console.error("[REFRESH ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}