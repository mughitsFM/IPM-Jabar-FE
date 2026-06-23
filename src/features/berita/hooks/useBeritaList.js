import { useQuery } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

/**
 * useBeritaList — fetch daftar berita dengan filter & pagination.
 *
 * @param {object} filters - { page, kategori, search }
 */
export function useBeritaList(filters = {}) {
  return useQuery({
    queryKey:        ["berita", "list", filters],
    queryFn:         () => beritaService.getList(filters),
    placeholderData: (prev) => prev, // pertahankan data lama saat filter berubah (mirip keepPreviousData)
  });
}
