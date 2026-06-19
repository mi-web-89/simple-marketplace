import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { withErrorHandler, ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { validateOrThrow } from "@/lib/validate";

export const GET = withErrorHandler(async () => {
  const session = await getSession();
  if (!session) throw ApiError.unauthorized();

  const res = await fetch(
    `https://dummyjson.com/carts/user/${session.id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    logger.error("CART", "Failed to fetch cart", {
      userId: session.id,
      status: res.status,
    });
    throw ApiError.upstream("Gagal memuat cart");
  }

  const data = await res.json();
  const cart = data.carts?.[0] ?? null;
  return NextResponse.json({ cart });
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await getSession();
  if (!session) throw ApiError.unauthorized();

  const body = await request.json();
  validateOrThrow(body, {
    productId: { required: true, message: "productId wajib diisi" },
    quantity: { required: true, message: "quantity wajib diisi" },
  });

  const { productId, quantity } = body;

  logger.info("CART", "Adding item to cart", {
    userId: session.id,
    productId,
    quantity,
  });

  const res = await fetch("https://dummyjson.com/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.id,
      products: [{ id: productId, quantity }],
    }),
  });

  if (!res.ok) {
    logger.error("CART", "Failed to add item", {
      status: res.status,
      productId,
    });
    throw ApiError.upstream("Gagal menambahkan produk ke cart");
  }

  const data = await res.json();
  return NextResponse.json({ cart: data });
});
