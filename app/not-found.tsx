import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-7xl font-bold text-gray-200">404</div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-gray-500 text-sm">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
