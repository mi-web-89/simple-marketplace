import { Cart } from "@/lib/types/product";

export async function getInitialCart(): Promise<Cart | null> {
  try {
    const res = await fetch("http://localhost:3000/api/carts", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.cart ?? null;
  } catch (err) {
    console.error("[LAYOUT] Gagal fetch cart", err);
    return null;
  }
}
