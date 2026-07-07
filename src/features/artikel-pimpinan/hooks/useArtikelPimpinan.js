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

export function useUpdateArtikelPimpinan(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => artikelPimpinanService.update(id, payload),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: [...LIST_KEY, "detail", id] });
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
