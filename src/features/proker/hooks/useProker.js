import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prokerService } from "../services/prokerService";

const LIST_KEY = ["proker", "list"];

export function useProkerList(params = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, params],
    queryFn:  () => prokerService.getList(params),
  });
}

export function useCreateProker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: prokerService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useUpdateProker(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => prokerService.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useUpdateStatusProker(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status) => prokerService.updateStatus(id, status),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useDeleteProker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: prokerService.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}
