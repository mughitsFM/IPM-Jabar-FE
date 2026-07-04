// frontend/features/berita/hooks/useBeritaMutations.js (lengkap — 1 baris diperbaiki: invalidateList)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

// Invalidate prefix ["berita"] saja (bukan ["berita","list"]) supaya query key
// publik (["berita","list",...]) MAUPUN admin (["berita","admin-list",...])
// sama-sama disegarkan setelah create/update/delete.
const invalidateList = (qc) =>
  qc.invalidateQueries({ queryKey: ["berita"] });

export function useCreateBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.create,
    onSuccess:  () => invalidateList(qc),
  });
}

export function useUpdateBerita(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => beritaService.update(id, payload),
    onSuccess:  () => {
      invalidateList(qc);
      qc.invalidateQueries({ queryKey: ["berita", "detail"] });
    },
  });
}

export function useDeleteBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.remove,
    onSuccess:  () => invalidateList(qc),
  });
}