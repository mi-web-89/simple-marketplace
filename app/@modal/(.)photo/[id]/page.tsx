"use client";

import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/product";

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => router.back()}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => router.back()}
          className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold text-lg z-10"
        >
          ✕
        </button>

        {!product ? (
          <div className="space-y-3 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded" />
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative mb-4">
              <Image
                src={product.images?.[0] || product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                loading="eager"
              />
            </div>
            <h2 className="text-xl font-bold">{product.title}</h2>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                {product.brand} · ★ {product.rating.toFixed(1)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
