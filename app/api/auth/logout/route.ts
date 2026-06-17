import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Hapus keduanya sekaligus
  response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("auth_refresh_token", "", { maxAge: 0, path: "/" });

  return response;
}