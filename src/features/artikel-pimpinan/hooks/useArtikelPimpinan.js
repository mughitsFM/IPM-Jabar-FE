// frontend/features/artikel-pimpinan/hooks/useArtikelPimpinan.js (lengkap)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { artikelPimpinanService } from "../services/artikelPimpinanService";

const LIST_KEY = ["artikel-pimpinan"];
const ADMIN_LIST_KEY = ["artikel-pimpinan", "admin-list"];

const invalidateAll = (qc) => qc.invalidateQueries({ queryKey: LIST_KEY });

// ── Sisi Pimpinan ────────────────────────────────────────────────────────

export function useArtikelPimpinanList(params = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, "list", params],
    queryFn: () => artikelPimpinanService.getList(params),
  });
}

export function useArtikelPimpinanDetail(id) {
  return useQuery({
    queryKey: [...LIST_KEY, "detail", id],
    queryFn: () => artikelPimpinanService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: artikelPimpinanService.create,
    onSuccess: () => invalidateAll(qc),
  });
}

// PERUBAHAN: id sekarang dikirim per-panggilan lewat mutate({ id, payload })
// (sebelumnya di-bind saat hook dibuat: useUpdateArtikelPimpinan(id)) — supaya
// hook yang sama bisa dipakai untuk autosave pada artikel baru yang baru
// dapat id di tengah sesi menulis. Pola identik dengan useUpdateBerita.
export function useUpdateArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => artikelPimpinanService.update(id, payload),
    onSuccess: (_data, variables) => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: [...LIST_KEY, "detail", variables.id] });
    },
  });
}

export function useDeleteArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: artikelPimpinanService.remove,
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAjukanArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: artikelPimpinanService.ajukan,
    onSuccess: () => invalidateAll(qc),
  });
}

export function useTarikArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: artikelPimpinanService.tarik,
    onSuccess: () => invalidateAll(qc),
  });
}

// ── Sisi Wilayah/Admin ───────────────────────────────────────────────────

export function useArtikelPimpinanAdminList(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_LIST_KEY, params],
    queryFn: () => artikelPimpinanService.getAdminList(params),
  });
}

export function useArtikelPimpinanAdminDetail(id) {
  return useQuery({
    queryKey: [...ADMIN_LIST_KEY, "detail", id],
    queryFn: () => artikelPimpinanService.getAdminDetail(id),
    enabled: Boolean(id),
  });
}

export function useSetujuiArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: artikelPimpinanService.setujui,
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_LIST_KEY }),
  });
}

export function useRevisiArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, catatan }) => artikelPimpinanService.revisi(id, catatan),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_LIST_KEY }),
  });
}

export function useTolakArtikelPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, catatan }) => artikelPimpinanService.tolak(id, catatan),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_LIST_KEY }),
  });
}