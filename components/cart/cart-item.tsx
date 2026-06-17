"use client";

import Image from "next/image";
import { CartItem } from "@/lib/types/product";
import { useCart } from "@/context/cart-context";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3">
      <Image
        src={item.thumbnail}
        alt={item.title}
        width={64}
        height={64}
        className="object-contain bg-gray-50 rounded-lg shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
        <p className="text-sm text-blue-600 font-semibold mt-0.5">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 border rounded flex items-center justify-center
                       text-sm hover:bg-gray-50"
          >
            −
          </button>
          <span className="text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 border rounded flex items-center justify-center
                       text-sm hover:bg-gray-50"
          >
            +
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="ml-auto text-xs text-red-400 hover:text-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
