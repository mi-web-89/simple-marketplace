export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="block rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center justify-between">
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
