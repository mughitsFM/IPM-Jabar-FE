import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifikasiService } from "../services/notifikasiService";

export function useJumlahBelumDibaca() {
  return useQuery({
    queryKey: ["notifikasi", "jumlah"],
    queryFn: () => notifikasiService.jumlahBelumDibaca(),
    refetchInterval: 30_000, // polling ringan tiap 30 detik, cukup utk skala organisasi ini
  });
}

export function useNotifikasiList(params = {}) {
  return useQuery({
    queryKey: ["notifikasi", "list", params],
    queryFn: () => notifikasiService.list(params),
  });
}

export function useTandaiDibaca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notifikasiService.tandaiDibaca,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifikasi"] }),
  });
}

export function useTandaiSemuaDibaca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notifikasiService.tandaiSemua,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifikasi"] }),
  });
}

// Dipanggil dari halaman/komponen surat, aspirasi, & artikel-pimpinan saat
// user membuka entitas terkait secara langsung (modal detail, baris list
// yang sudah menampilkan status) — supaya notifikasi ikut ter-mark terbaca
// walau user tidak pernah membuka dropdown lonceng notifikasi. Silent-fail
// dibiarkan (tanpa onError) karena ini efek samping non-kritis; kegagalannya
// tidak boleh mengganggu alur utama halaman yang memanggilnya.
export function useTandaiNotifikasiEntitas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notifikasiService.tandaiEntitas,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifikasi"] }),
  });
}