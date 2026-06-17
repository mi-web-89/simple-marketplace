"use client";

interface Props {
  categories: { slug: string; name: string }[];
  active: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <select
      value={active}
      onChange={(e) => onSelect(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Semua Kategori</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}