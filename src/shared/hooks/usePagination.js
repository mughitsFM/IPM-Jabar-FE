import { useState } from "react";

/**
 * Hook sederhana untuk manajemen state pagination.
 *
 * @param {object} opts
 * @param {number} opts.initialPage - Halaman awal (default: 1)
 * @returns {{ page, setPage, nextPage, prevPage, resetPage }}
 */
export function usePagination({ initialPage = 1 } = {}) {
  const [page, setPage] = useState(initialPage);

  return {
    page,
    setPage,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    resetPage: () => setPage(1),
  };
}
