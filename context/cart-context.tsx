"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useTransition,
  ReactNode,
} from "react";
import { Cart, CartItem, Product } from "@/lib/types/product";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  totalItems: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

// Helper: hitung ulang total cart setelah optimistic update
function recalcCart(cart: Cart): Cart {
  const totalQuantity = cart.products.reduce((s, p) => s + p.quantity, 0);
  const total = cart.products.reduce((s, p) => s + p.price * p.quantity, 0);
  const discountedTotal = cart.products.reduce(
    (s, p) => s + p.price * p.quantity * (1 - p.discountPercentage / 100),
    0,
  );
  return {
    ...cart,
    totalProducts: cart.products.length,
    totalQuantity,
    total: Math.round(total * 100) / 100,
    discountedTotal: Math.round(discountedTotal * 100) / 100,
  };
}

function createEmptyCart(): Cart {
  return {
    id: 0,
    userId: 0,
    products: [],
    total: 0,
    discountedTotal: 0,
    totalProducts: 0,
    totalQuantity: 0,
  };
}

async function persistCartUpdate(
  cartId: number,
  products: { id: number; quantity: number }[],
) {
  await fetch(`/api/carts/${cartId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  });
}

export function CartProvider({
  children,
  initialCart = null,
}: {
  children: ReactNode;
  initialCart?: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const cartId = cart?.id;

  const addToCart = useCallback((product: Product) => {
    // 1. Optimistic update — langsung update UI
    setCart((prev) => {
      const base = prev ?? createEmptyCart();

      const existing = base.products.find((p) => p.id === product.id);
      let updatedProducts: CartItem[];

      if (existing) {
        updatedProducts = base.products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      } else {
        updatedProducts = [
          ...base.products,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            total: product.price,
            discountPercentage: product.discountPercentage,
            discountedTotal:
              product.price * (1 - product.discountPercentage / 100),
            thumbnail: product.thumbnail,
          },
        ];
      }

      return recalcCart({ ...base, products: updatedProducts });
    });

    setIsOpen(true);

    // 2. Sync ke server di background
    startTransition(async () => {
      try {
        const res = await fetch("/api/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        const { cart: serverCart } = await res.json();
        // Update id cart dari server (untuk PUT berikutnya)
        if (serverCart?.id) {
          setCart((prev) =>
            prev ? { ...prev, id: serverCart.id } : serverCart,
          );
        }
      } catch {
        console.error("[CART] Gagal sync ke server");
        // Bisa rollback di sini kalau perlu
      }
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity < 1) return;

      // Optimistic
      setCart((prev) => {
        if (!prev) return prev;
        return recalcCart({
          ...prev,
          products: prev.products.map((p) =>
            p.id === productId ? { ...p, quantity } : p,
          ),
        });
      });

      // Sync
      startTransition(async () => {
        if (!cartId) return;
        try {
          await persistCartUpdate(cartId, [{ id: productId, quantity }]);
        } catch {
          console.error("[CART] Gagal sync ke server");
        }
      });
    },
    [cartId],
  );

  const removeItem = useCallback(
    (productId: number) => {
      // Optimistic
      setCart((prev) => {
        if (!prev) return prev;
        return recalcCart({
          ...prev,
          products: prev.products.filter((p) => p.id !== productId),
        });
      });

      // Sync — kirim quantity 0 untuk remove
      startTransition(async () => {
        if (!cartId) return;
        try {
          await persistCartUpdate(cartId, [{ id: productId, quantity: 0 }]);
        } catch {
          console.error("[CART] Gagal sync ke server");
        }
      });
    },
    [cartId],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const totalItems = cart?.totalQuantity ?? 0;
  const providerValue = useMemo(
    () => ({
      cart,
      isOpen,
      isPending,
      totalItems,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [
      cart,
      isOpen,
      isPending,
      totalItems,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeItem,
    ],
  );

  return (
    <CartContext.Provider value={providerValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
