// frontend/features/surat-menyurat/hooks/useSurat.js (lengkap)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suratService } from "../services/suratService";

const invalidateAll = (qc) => qc.invalidateQueries({ queryKey: ["surat"] });

export function useDirektoriPenerima() {
  return useQuery({
    queryKey: ["surat", "direktori"],
    queryFn: suratService.getDirektori,
    staleTime: 5 * 60 * 1000, // direktori jarang berubah, cache 5 menit
  });
}

export function useSuratMasuk(params = {}) {
  return useQuery({
    queryKey: ["surat", "masuk", params],
    queryFn: () => suratService.getMasuk(params),
  });
}

export function useSuratKeluar(params = {}) {
  return useQuery({
    queryKey: ["surat", "keluar", params],
    queryFn: () => suratService.getKeluar(params),
  });
}

export function useSuratDetail(id) {
  return useQuery({
    queryKey: ["surat", "detail", id],
    queryFn: () => suratService.getDetail(id),
    enabled: Boolean(id),
  });
}

export function useKirimSurat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suratService.kirim,
    onSuccess: () => invalidateAll(qc),
  });
}

export function useTandaiSuratDibaca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suratService.tandaiDibaca,
    onSuccess: () => invalidateAll(qc),
  });
}
