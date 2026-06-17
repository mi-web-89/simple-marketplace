import { ProductGrid } from "@/components/products/product-grid";

// server component untuk fetch data produk awal dan kategori, lalu render ProductGrid
async function getInitialProducts() {
  const select = "id,title,price,thumbnail,category,rating,discountPercentage";
  const res = await fetch(
    `https://dummyjson.com/products?limit=12&skip=0&select=${select}`,
    { cache: "no-store" },
  );
  return res.json();
}

async function getCategories() {
  const res = await fetch("https://dummyjson.com/products/categories", {
    next: { revalidate: 3600 }, // cache 1 jam, kategori jarang berubah
  });
  return res.json();
}

export default async function ProductsPage() {
  // Fetch paralel — lebih cepat
  const [{ products, total }, categories] = await Promise.all([
    getInitialProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Produk</h1>
      <ProductGrid
        initialProducts={products}
        initialTotal={total}
        categories={categories}
      />
    </div>
  );
}
