import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pimpinanAdminService } from "../services/pimpinanAdminService";

const LIST_KEY = ["pimpinan-admin", "list"];
const detailKey = (uid) => ["pimpinan-admin", "detail", uid];

export function usePimpinanList(params = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, params],
    queryFn: () => pimpinanAdminService.getList(params),
  });
}

export function usePimpinanDetail(uid) {
  return useQuery({
    queryKey: detailKey(uid),
    queryFn: () => pimpinanAdminService.getById(uid),
    enabled: Boolean(uid),
  });
}

export function useGenerateAkunPimpinan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jumlah) => pimpinanAdminService.generate(jumlah),
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  });
}

export function useUpdatePimpinan(uid) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => pimpinanAdminService.update(uid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      qc.invalidateQueries({ queryKey: detailKey(uid) });
    },
  });
}

export function useOverrideKredensialPimpinan(uid) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => pimpinanAdminService.overrideKredensial(uid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      qc.invalidateQueries({ queryKey: detailKey(uid) });
    },
  });
}