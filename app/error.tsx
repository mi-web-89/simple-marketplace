"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl text-red-600 font-bold">!</span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">
              Terjadi Kesalahan
            </h1>

            <p className="text-gray-500 text-sm">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah
              diberitahu dan akan segera memperbaikinya.
            </p>

            {error.digest && (
              <p className="text-xs text-gray-400 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Coba Lagi
              </button>

              <Link
                href="/"
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
