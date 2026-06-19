import Link from "next/link";
import { Product } from "@/lib/types/product";
import { ProductImages } from "@/components/products/product-image";
import { ProductDetails } from "@/components/products/product-detail";

type SearchParams = Record<string, string | string[] | undefined>;

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

function getBackHref(searchParams: SearchParams) {
  const sortValue = searchParams.sort
    ? Array.isArray(searchParams.sort)
      ? searchParams.sort[0]
      : searchParams.sort
    : "";

  return sortValue ? `/?sort=${encodeURIComponent(sortValue)}` : "/";
}

export default async function FullPagePhoto({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const product = await fetchProduct((await params).id);
  const sp = await searchParams;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Link
        href={getBackHref(sp)}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Kembali ke Beranda
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductImages
          images={product.images ?? []}
          thumbnail={product.thumbnail}
          title={product.title}
          productId={product.id}
        />

        <ProductDetails product={product} searchParams={sp} />
      </div>
    </div>
  );
}
