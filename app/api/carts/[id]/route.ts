import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// PUT — update quantity item di cart
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { products } = await request.json();

  const res = await fetch(`https://dummyjson.com/carts/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merge: true, products }),
  });

  const data = await res.json();
  return NextResponse.json({ cart: data });
}