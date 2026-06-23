/**
 * Skeleton — placeholder animasi saat konten sedang dimuat.
 */

/** Skeleton satu baris teks */
export function SkeletonLine({ className = "" }) {
  return (
    <div className={`h-4 bg-neutral-200 rounded animate-pulse ${className}`} />
  );
}

/** Skeleton kartu berita / proker */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-video bg-neutral-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <SkeletonLine className="w-3/4" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-1/2" />
      </div>
    </div>
  );
}

/** Skeleton grid kartu (3 kolom) */
export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Skeleton baris tabel admin */
export function SkeletonTableRows({ rows = 5, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-neutral-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <SkeletonLine className={j === 0 ? "w-40" : j === cols - 1 ? "w-20" : "w-full"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Layar loading fullpage — dipakai oleh Suspense fallback */
export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-50">
      <div className="w-10 h-10 rounded-full border-4 border-brand-green-500 border-t-transparent animate-spin" />
      <p className="text-sm text-neutral-600 font-body">Memuat…</p>
    </div>
  );
}

/** Default export: variant selector */
export default function Skeleton({ variant = "card-grid", count }) {
  if (variant === "card-grid") return <SkeletonCardGrid count={count} />;
  if (variant === "table")     return null; // dipakai inline di dalam <tbody>
  return <SkeletonLine />;
}
