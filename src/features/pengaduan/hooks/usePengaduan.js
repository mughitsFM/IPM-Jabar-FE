import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pengaduanService } from "../services/pengaduanService";

const LIST_KEY = ["pengaduan", "list"];

/** Kirim pengaduan baru (publik) */
export function useSubmitPengaduan() {
  return useMutation({
    mutationFn: pengaduanService.submit,
  });
}

/** Cek status via kode unik (publik) */
export function useCheckStatusPengaduan(kode) {
  return useQuery({
    queryKey: ["pengaduan", "status", kode],
    queryFn:  () => pengaduanService.checkStatus(kode),
    enabled:  Boolean(kode),
    retry:    false,
  });
}

/** Daftar pengaduan (admin) */
export function usePengaduanList(params = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, params],
    queryFn:  () => pengaduanService.getList(params),
  });
}

/** Detail pengaduan (admin) */
export function usePengaduanDetail(id) {
  return useQuery({
    queryKey: ["pengaduan", "detail", id],
    queryFn:  () => pengaduanService.getById(id),
    enabled:  Boolean(id),
  });
}

/** Update status pengaduan (admin) */
export function useUpdateStatusPengaduan(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status) => pengaduanService.updateStatus(id, status),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      qc.invalidateQueries({ queryKey: ["pengaduan", "detail", id] });
    },
  });
}
