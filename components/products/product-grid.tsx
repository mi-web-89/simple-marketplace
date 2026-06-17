"use client";

import { useState, useCallback, useTransition } from "react";
import { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";
import { ProductSearch } from "./product-search";
import { CategoryFilter } from "./category-filter";

const LIMIT = 12;

interface Props {
  initialProducts: Product[];
  initialTotal: number;
  categories: { slug: string; name: string }[];
}

export function ProductGrid({
  initialProducts,
  initialTotal,
  categories,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [skip, setSkip] = useState(0);
  const [activeCategory, setActiveCategory] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchProducts = useCallback(
    (params: { q?: string; category?: string; skip?: number }) => {
      startTransition(async () => {
        const searchParams = new URLSearchParams({
          limit: String(LIMIT),
          skip: String(params.skip ?? 0),
          ...(params.q ? { q: params.q } : {}),
          ...(params.category ? { category: params.category } : {}),
        });

        const res = await fetch(`/api/products?${searchParams}`);
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
        setSkip(params.skip ?? 0);
      });
    },
    [],
  );

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setActiveCategory("");
      fetchProducts({ q });
    },
    [fetchProducts],
  );

  const handleCategory = useCallback(
    (slug: string) => {
      setActiveCategory(slug);
      setQuery("");
      fetchProducts({ category: slug });
    },
    [fetchProducts],
  );

  const handleNextPage = useCallback(() => {
    fetchProducts({ q: query, category: activeCategory, skip: skip + LIMIT });
  }, [fetchProducts, query, activeCategory, skip]);

  const handlePrevPage = useCallback(() => {
    fetchProducts({ q: query, category: activeCategory, skip: skip - LIMIT });
  }, [fetchProducts, query, activeCategory, skip]);

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ProductSearch onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onSelect={handleCategory}
        />
      </div>

      {/* Product list with loading overlay */}
      <div className="relative">
        <div
          className={`transition-opacity ${isPending ? "opacity-40" : "opacity-100"}`}
          aria-busy={isPending}
        >
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Produk tidak ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {isPending && (
          <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-5 py-4 shadow-lg">
              <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <span className="text-sm text-gray-700">Memuat produk...</span>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500">
          {skip + 1}–{Math.min(skip + LIMIT, total)} dari {total} produk
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={skip === 0 || isPending}
            className="px-4 py-2 rounded-lg border text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Sebelumnya
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={skip + LIMIT >= total || isPending}
            className="px-4 py-2 rounded-lg border text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya →
          </button>
        </div>
      </div>
    </div>
  );
}
