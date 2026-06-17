import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";

export const revalidate = 60;

async function fetchProduct(id: string) {
  if (!id || !/^[0-9]+$/.test(id)) {
    throw new Error(`Invalid product id: ${id}`);
  }

  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Failed to load product ${id}`);
  }

  return (await response.json()) as Product;
}

export default async function PhotoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const sp = await searchParams;
  const backHref = sp.sort ? `/?sort=${encodeURIComponent(sp.sort)}` : "/";

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Link
        href={backHref}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Kembali ke Beranda
      </Link>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="aspect-square bg-gray-100 relative">
          <Image
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 space-y-2">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{product.brand}</span>
            <span>★ {product.rating.toFixed(1)}</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed pt-2">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
