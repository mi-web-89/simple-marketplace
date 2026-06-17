"use client";

import { useCart } from "@/context/cart-context";
import { CartItemRow } from "./cart-item";

export function CartDrawer() {
  const { cart, isOpen, isPending, closeCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white
                    shadow-xl z-50 flex flex-col transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-semibold">
            Keranjang
            {cart?.totalQuantity ? (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({cart.totalQuantity} item)
              </span>
            ) : null}
          </h2>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div
          className={`flex-1 overflow-y-auto px-4 py-4 space-y-4
                         ${isPending ? "opacity-60" : ""}`}
        >
          {!cart || cart.products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              Keranjang masih kosong
            </div>
          ) : (
            cart.products.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.products.length > 0 && (
          <div className="border-t px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="line-through text-gray-400">
                ${cart.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-blue-600">
                ${cart.discountedTotal.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-xl
                         font-medium hover:bg-blue-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
