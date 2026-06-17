import { Product } from "@/lib/types/product";
type SearchParams = Record<string, string | string[] | undefined>;

export async function ProductDetails({
  product,
  searchParams,
}: {
  product: Product;
  searchParams: SearchParams;
}) {
  const searchEntries = Object.entries(searchParams).filter(
    ([, value]) => value !== undefined && value !== "",
  );
  const inStock = product.stock > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <p className="text-2xl font-bold text-blue-600 mb-2">
        ${product.price.toFixed(2)}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
        <span>{product.brand}</span>
        <span>★ {product.rating.toFixed(1)}</span>
        <span className={inStock ? "text-green-600" : "text-red-600"}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {searchEntries.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 border-t pt-4">
          <p className="font-semibold mb-1">searchParams diterima:</p>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(Object.fromEntries(searchEntries), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}