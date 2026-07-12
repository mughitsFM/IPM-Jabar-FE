import { useQuery } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

/**
 * useBeritaList — fetch daftar berita PUBLIK untuk BeritaListPage.jsx.
 * Hanya status 'dipublikasikan', field ringkas TANPA 'konten' (lihat
 * BeritaListItemSerializer di backend). JANGAN dipakai di panel admin.
 */
export function useBeritaList(filters = {}) {
  return useQuery({
    queryKey:        ["berita", "list", filters],
    queryFn:         () => beritaService.getList(filters),
    placeholderData: (prev) => prev,
  });
}

/**
 * useBeritaAdminList — fetch daftar berita untuk AdminBeritaPage.jsx.
 *
 * BUG FIX: sebelumnya AdminBeritaPage.jsx salah pakai useBeritaList() di
 * atas (endpoint publik /berita/), akibatnya (1) berita berstatus draft/
 * terjadwal tidak pernah muncul di tabel admin karena endpoint publik
 * memfilter hanya 'dipublikasikan', dan (2) field 'konten' selalu kosong
 * saat tombol Edit diklik karena endpoint publik tidak menyertakan field
 * itu — sehingga NewsForm mount dengan editor kosong.
 *
 * Hook ini memanggil /admin/berita/ (semua status, field lengkap termasuk
 * 'konten') sesuai queryKey "admin-list" yang sudah diantisipasi oleh
 * invalidateList() di useBeritaMutations.js.
 */
export function useBeritaAdminList(filters = {}) {
  return useQuery({
    queryKey:        ["berita", "admin-list", filters],
    queryFn:         () => beritaService.getAdminList(filters),
    placeholderData: (prev) => prev,
  });
}