import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

const invalidateList = (qc) =>
  qc.invalidateQueries({ queryKey: ["berita", "list"] });

/** Membuat berita baru */
export function useCreateBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.create,
    onSuccess:  () => invalidateList(qc),
  });
}

/** Mengupdate berita */
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

/** Menghapus berita */
export function useDeleteBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.remove,
    onSuccess:  () => invalidateList(qc),
  });
}
