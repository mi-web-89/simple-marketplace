"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto mt-12 text-center">
      <h1 className="text-2xl font-bold mb-2">Terjadi kesalahan</h1>
      <p className="text-sm text-gray-600 mb-4">{error?.message ?? "Terjadi masalah saat memuat produk."}</p>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Muat Ulang
        </button>

        <Link href="/" className="px-4 py-2 border rounded">
          Kembali ke Marketplace
        </Link>
      </div>
    </div>
  );
}
