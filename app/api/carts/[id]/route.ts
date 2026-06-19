import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { withErrorHandler, ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { validateOrThrow } from "@/lib/validate";

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getSession();
  if (!session) throw ApiError.unauthorized();

  if (!params.id || !/^\d+$/.test(params.id)) {
    throw ApiError.badRequest("Invalid cart ID");
  }

  const body = await request.json();
  validateOrThrow(body, {
    products: { required: true, message: "products wajib diisi" },
  });

  const { products } = body;

  logger.info("CART", "Updating cart", {
    cartId: params.id,
    productsCount: products.length,
  });

  const res = await fetch(`https://dummyjson.com/carts/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merge: true, products }),
  });

  if (!res.ok) {
    logger.error("CART", "Failed to update cart", {
      cartId: params.id,
      status: res.status,
    });
    throw ApiError.upstream("Gagal memperbarui cart");
  }

  const data = await res.json();
  return NextResponse.json({ cart: data });
});
