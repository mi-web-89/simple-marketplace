import { cookies } from "next/headers";
import { User } from "@/lib/types/auth";

const ACCESS_TOKEN_COOKIE = "auth_token";
const REFRESH_TOKEN_COOKIE = "auth_refresh_token";

// Ambil access_token dari httpOnly cookie (server-side only)
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

// Ambil refresh_token dari httpOnly cookie (server-side only)
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

// Validasi session: panggil /auth/me dengan token
export async function getSession(): Promise<User | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch("https://dummyjson.com/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
  } catch {
    return null;
  }
}

// Cookie config: httpOnly, sameSite strict, secure di production
export const accessTokenCookie = {
  name: ACCESS_TOKEN_COOKIE,
  options: {
    httpOnly: true, // tidak bisa diakses JavaScript, hanya lewat HTTP
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60, // 1 jam — sesuai DummyJSON default
    path: "/",
  },
};

export const refreshTokenCookie = {
  name: REFRESH_TOKEN_COOKIE,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  },
};
