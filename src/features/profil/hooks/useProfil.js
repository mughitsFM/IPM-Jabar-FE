import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profilService } from "../services/profilService";

const QUERY_KEY = ["profil"];

/** Fetch semua jabatan + anggota (publik & admin) */
export function useProfil() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn:  profilService.getAll,
  });
}

// ── Jabatan mutations ──────────────────────────────────────────────────────
export function useCreateJabatan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profilService.createJabatan,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateJabatan(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => profilService.updateJabatan(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteJabatan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profilService.deleteJabatan,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ── Anggota mutations ──────────────────────────────────────────────────────
export function useCreateAnggota() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profilService.createAnggota,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateAnggota(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => profilService.updateAnggota(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteAnggota() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profilService.deleteAnggota,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
