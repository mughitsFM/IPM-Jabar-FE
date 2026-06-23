import { useQuery } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

/**
 * useBeritaDetail — fetch detail satu berita berdasarkan slug.
 */
export function useBeritaDetail(slug) {
  return useQuery({
    queryKey: ["berita", "detail", slug],
    queryFn:  () => beritaService.getBySlug(slug),
    enabled:  Boolean(slug),
  });
}
