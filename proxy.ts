import { NextRequest, NextResponse } from "next/server";

// Routes yang butuh auth
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];

// Routes khusus auth (tidak boleh diakses kalau sudah login)
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("auth_refresh_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Tidak ada kedua token → paksa login
  if (isProtected && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Access token tidak ada tapi refresh token ada → coba refresh dulu
  if (isProtected && !accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(
        new URL("/api/auth/refresh", request.url),
        {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!refreshRes.ok) {
        // Refresh gagal → redirect login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set("auth_refresh_token", "", { maxAge: 0 });
        return response;
      }

      const nextResponse = NextResponse.next();

      // Handle Set-Cookie dengan fallback (beberapa runtime tidak punya getSetCookie)
      const headersAny = refreshRes.headers;
      let setCookies: string[] = [];

      if (typeof headersAny.getSetCookie === "function") {
        setCookies = headersAny.getSetCookie();
      } else {
        const sc = refreshRes.headers.get("set-cookie");
        if (sc) setCookies = Array.isArray(sc) ? sc : [sc];
      }

      setCookies.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });

      return nextResponse;

    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      // redirect + hapus cookie auth dan refresh token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
      response.cookies.set("auth_refresh_token", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  // Sudah login tapi akses route auth → redirect dashboard
  if (isAuthRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};