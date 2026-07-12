import { useQuery } from "@tanstack/react-query";
import { desainPublicService } from "@/shared/services/desainPublicService";

export const DESAIN_PUBLIC_KEY = ["desain-public"];

/**
 * Fetch config desain gabungan (global + 4 section) sekali, di-cache
 * dengan staleTime panjang. Dipanggil dari banyak komponen (Navbar, Footer,
 * ThemeInjector, 4 halaman publik) tapi TanStack Query dedup otomatis
 * karena queryKey sama — cuma 1 request jaringan.
 */
export function useDesainPublic() {
  return useQuery({
    queryKey: DESAIN_PUBLIC_KEY,
    queryFn: () => desainPublicService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 menit — config jarang berubah
  });
}

/** Shortcut ambil bagian "global" saja (buat Navbar/Footer/ThemeInjector). */
export function useDesainGlobal() {
  const { data, ...rest } = useDesainPublic();
  return { global: data?.data?.global, ...rest };
}

/** Shortcut ambil 1 section ("beranda"|"profil"|"berita"|"timeline"). */
export function useDesainSection(section) {
  const { data, ...rest } = useDesainPublic();
  return { section: data?.data?.[section], ...rest };
}
