"use client";

import Image from "next/image";
import { Product } from "@/lib/types/product";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discounted =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full"> 
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={360}
          height={360}
          loading="eager"
          className="w-full h-full object-contain p-3"
        />
        </Link>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-2 leading-tight">
          {product.title}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{product.rating}</span>
        </div>

        <div>
          <p className="font-semibold text-sm">
            ${discounted.toFixed(2)}
          </p>
          {product.discountPercentage > 0 && (
            <p className="text-xs text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full py-1.5 bg-blue-600 text-white text-sm
                     rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Keranjang
        </button>
      </div>
    </div>
  );
}