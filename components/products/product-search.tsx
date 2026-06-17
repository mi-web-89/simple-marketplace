"use client";

import { useState, useEffect } from "react";

interface Props {
  onSearch: (q: string) => void;
}

export function ProductSearch({ onSearch }: Props) {
  const [value, setValue] = useState("");

  // Debounce 400ms — jangan panggil `onSearch` jika input kosong
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() === "") return;
      onSearch(value);
    }, 400);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Cari produk..."
      className="flex-1 border rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}