export function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
