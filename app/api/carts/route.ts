import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// GET — ambil cart milik user yang login
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `https://dummyjson.com/carts/user/${session.id}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  // Ambil cart pertama milik user, atau null kalau belum ada
  const cart = data.carts?.[0] ?? null;
  return NextResponse.json({ cart });
}

// POST — tambah item ke cart (buat cart baru)
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await request.json();

  const res = await fetch("https://dummyjson.com/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.id,
      products: [{ id: productId, quantity }],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ cart: data });
}