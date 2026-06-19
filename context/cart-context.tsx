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
import { fetchClient } from "@/lib/fetch-client";
import { useToast } from "./toast-context";

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
  return fetchClient<{ cart: Cart }>(`/api/carts/${cartId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
    module: "cart-context",
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
  const { addToast } = useToast();

  const addToCart = useCallback(
    (product: Product) => {
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

      startTransition(async () => {
        try {
          const { cart: serverCart } = await fetchClient<{ cart: Cart }>(
            "/api/carts",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product.id, quantity: 1 }),
              module: "cart-context",
            },
          );

          if (serverCart?.id) {
            setCart((prev) =>
              prev ? { ...prev, id: serverCart.id } : serverCart,
            );
          }

          addToast(`${product.title} ditambahkan ke keranjang`, "success");
        } catch {
          addToast("Gagal menyimpan ke cart. Coba lagi.", "error");
        }
      });
    },
    [addToast],
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity < 1) return;

      setCart((prev) => {
        if (!prev) return prev;
        return recalcCart({
          ...prev,
          products: prev.products.map((p) =>
            p.id === productId ? { ...p, quantity } : p,
          ),
        });
      });

      startTransition(async () => {
        if (!cartId) return;
        try {
          await persistCartUpdate(cartId, [{ id: productId, quantity }]);
        } catch {
          addToast("Gagal memperbarui jumlah. Coba lagi.", "error");
        }
      });
    },
    [cartId, addToast],
  );

  const removeItem = useCallback(
    (productId: number) => {
      setCart((prev) => {
        if (!prev) return prev;
        return recalcCart({
          ...prev,
          products: prev.products.filter((p) => p.id !== productId),
        });
      });

      startTransition(async () => {
        if (!cartId) return;
        try {
          await persistCartUpdate(cartId, [{ id: productId, quantity: 0 }]);
        } catch {
          addToast("Gagal menghapus item. Coba lagi.", "error");
        }
      });
    },
    [cartId, addToast],
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
