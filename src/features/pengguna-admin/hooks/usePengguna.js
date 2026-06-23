import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { penggunaService } from "../services/penggunaService";

const LIST_KEY = ["pengguna", "list"];

export function usePenggunaList() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn:  penggunaService.getList,
  });
}

export function useCreatePengguna() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: penggunaService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useUpdatePengguna(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => penggunaService.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useToggleActivePengguna(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (isActive) => penggunaService.toggleActive(id, isActive),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useDeletePengguna() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: penggunaService.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}
