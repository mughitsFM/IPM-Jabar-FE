import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beritaService } from "../services/beritaService";

const invalidateList = (qc) =>
  qc.invalidateQueries({ queryKey: ["berita"] });

export function useCreateBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.create,
    onSuccess: () => invalidateList(qc),
  });
}

// PERUBAHAN (fase 2): sebelumnya id di-bind saat hook dibuat
// (useUpdateBerita(editData?.id)). Sekarang id dikirim per-panggilan lewat
// mutate({ id, payload }) — supaya hook yang SAMA bisa dipakai untuk
// autosave pada berita yang baru dibuat di tengah sesi edit (dapat id
// setelah autosave pertama sukses create), tanpa perlu re-instantiate
// hook. Lihat NewsForm.jsx.
export function useUpdateBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => beritaService.update(id, payload),
    onSuccess: () => {
      invalidateList(qc);
      qc.invalidateQueries({ queryKey: ["berita", "detail"] });
    },
  });
}

export function useDeleteBerita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: beritaService.remove,
    onSuccess: () => invalidateList(qc),
  });
}