import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

import Image from "next/image";

// Server Component: aman, token tidak pernah ke client
export default async function DashboardPage() {
  const user = await getSession();

  // Double-check di level page (defense in depth)
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-3">
        <Image
          src={user.image}
          alt={user.firstName}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full"
        />
        <h2 className="text-lg font-medium">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <span className="inline-block px-3 py-1 bg-green-50 text-green-700
                         text-xs rounded-full">
          @{user.username}
        </span>
      </div>

      {/* Token TIDAK pernah di-render ke client */}
      <p className="mt-4 text-xs text-gray-400">
        Data diambil server-side via /auth/me — token tidak pernah menyentuh browser.
      </p>
    </div>
  );
}