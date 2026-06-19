import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const limit = searchParams.get("limit") ?? "12";
  const skip = searchParams.get("skip") ?? "0";
  const select = "id,title,price,thumbnail,category,rating,discountPercentage";

  let url: string;

  if (query) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&select=${select}`;
  } else if (category) {
    url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&select=${select}`;
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=${select}`;
  }

  logger.debug("PRODUCTS", "Fetching products", { url });

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    logger.error("PRODUCTS", "Upstream fetch failed", {
      status: res.status,
      url,
    });
    throw ApiError.upstream("Gagal memuat produk dari penyedia");
  }

  const data = await res.json();
  return NextResponse.json(data);
});
