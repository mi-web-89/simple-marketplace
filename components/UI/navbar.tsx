"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { CartIcon } from "@/components/UI/cart-icon";
import OutlineButton from "./outline-button";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link href="/" className="font-semibold">
        Beranda Marketplace
      </Link>

      <div className="flex gap-4 items-center">
        <CartIcon />
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              Halo, {user.firstName || user.username}
            </span>
            <OutlineButton onClickHandler={logout} isLoading={isLoading} />
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 border rounded-lg text-sm
                       hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
