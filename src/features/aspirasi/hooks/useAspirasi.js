// frontend/features/aspirasi/hooks/useAspirasi.js (lengkap)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aspirasiService } from "../services/aspirasiService";

const invalidateAll = (qc) => qc.invalidateQueries({ queryKey: ["aspirasi"] });

// ── Sisi Pimpinan ────────────────────────────────────────────────────────

export function useSubmitAspirasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: aspirasiService.submit,
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAspirasiList(params = {}) {
  return useQuery({
    queryKey: ["aspirasi", "list", params],
    queryFn: () => aspirasiService.getList(params),
  });
}

export function useAspirasiDetail(id) {
  return useQuery({
    queryKey: ["aspirasi", "detail", id],
    queryFn: () => aspirasiService.getById(id),
    enabled: Boolean(id),
  });
}

// ── Sisi Wilayah/Admin ───────────────────────────────────────────────────

export function useAspirasiAdminList(params = {}) {
  return useQuery({
    queryKey: ["aspirasi", "admin-list", params],
    queryFn: () => aspirasiService.getAdminList(params),
  });
}

export function useAspirasiAdminDetail(id) {
  return useQuery({
    queryKey: ["aspirasi", "admin-detail", id],
    queryFn: () => aspirasiService.getAdminDetail(id),
    enabled: Boolean(id),
  });
}

export function useUpdateStatusAspirasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => aspirasiService.updateStatus(id, status),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useBalasAspirasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, balasan }) => aspirasiService.balas(id, balasan),
    onSuccess: () => invalidateAll(qc),
  });
}
