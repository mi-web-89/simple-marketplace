export default function PhotoLoading() {
  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
