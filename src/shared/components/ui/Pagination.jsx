import Button from "./Button";

/**
 * Pagination — navigasi halaman data.
 *
 * @param {object} meta        - { page, total_pages, total_count, per_page } dari response API
 * @param {function} onPageChange - callback menerima nomor halaman baru
 */
export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total_pages <= 1) return null;

  const { page, total_pages } = meta;
  const hasPrev = page > 1;
  const hasNext = page < total_pages;

  // Hitung range halaman yang ditampilkan (maksimal 5 nomor)
  const range = [];
  const delta = 2;
  for (
    let i = Math.max(1, page - delta);
    i <= Math.min(total_pages, page + delta);
    i++
  ) {
    range.push(i);
  }

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-1 flex-wrap mt-8">
      {/* Prev */}
      <Button
        variant="ghost"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        aria-label="Halaman sebelumnya"
        className="min-w-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Awal (jika range tidak mulai dari 1) */}
      {range[0] > 1 && (
        <>
          <PageBtn num={1} current={page} onClick={onPageChange} />
          {range[0] > 2 && <span className="px-2 text-neutral-400 text-sm">…</span>}
        </>
      )}

      {range.map((num) => (
        <PageBtn key={num} num={num} current={page} onClick={onPageChange} />
      ))}

      {/* Akhir */}
      {range[range.length - 1] < total_pages && (
        <>
          {range[range.length - 1] < total_pages - 1 && (
            <span className="px-2 text-neutral-400 text-sm">…</span>
          )}
          <PageBtn num={total_pages} current={page} onClick={onPageChange} />
        </>
      )}

      {/* Next */}
      <Button
        variant="ghost"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        aria-label="Halaman berikutnya"
        className="min-w-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  );
}

function PageBtn({ num, current, onClick }) {
  const isActive = num === current;
  return (
    <button
      onClick={() => onClick(num)}
      aria-label={`Halaman ${num}`}
      aria-current={isActive ? "page" : undefined}
      className={`min-h-[44px] min-w-[44px] px-3 rounded-lg text-sm font-semibold transition-colors duration-150
        ${isActive
          ? "bg-brand-green-500 text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        }`}
    >
      {num}
    </button>
  );
}
