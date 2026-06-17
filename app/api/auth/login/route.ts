import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // forward ke DummyJSON (mock API) untuk validasi & dapatkan token
    const dummyRes = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,          // access token: 1 jam
        refreshExpiresInMins: 10080, // refresh token: 7 hari
      }),
    });

    if (!dummyRes.ok) {
      const err = await dummyRes.json();
      return NextResponse.json(
        { error: err.message ?? "Login gagal" },
        { status: dummyRes.status }
      );
    }

    const data = await dummyRes.json();
    // data = { id, username, email, firstName, lastName, image, accessToken, refreshToken }

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

    // Set access token — short-lived
    response.cookies.set(
      accessTokenCookie.name,
      data.accessToken,
      accessTokenCookie.options
    );

    // Set refresh token — long-lived, terpisah
    response.cookies.set(
      refreshTokenCookie.name,
      data.refreshToken,
      refreshTokenCookie.options
    );

    return response;
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}