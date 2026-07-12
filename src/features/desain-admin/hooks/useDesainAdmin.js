import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { desainAdminService } from "../services/desainAdminService";
import { DESAIN_PUBLIC_KEY } from "@/shared/hooks/useDesainPublic";

const ADMIN_KEY = ["desain-admin"];
const RIWAYAT_KEY = ["desain-admin-riwayat"];

export function useDesainAdminConfig() {
  return useQuery({
    queryKey: ADMIN_KEY,
    queryFn: () => desainAdminService.getAll(),
  });
}

export function useUpdateDesainGlobal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => desainAdminService.updateGlobal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY });
      qc.invalidateQueries({ queryKey: DESAIN_PUBLIC_KEY }); // biar sisi publik ikut fresh
      qc.invalidateQueries({ queryKey: RIWAYAT_KEY });
    },
  });
}

export function useUpdateDesainSection(section) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => desainAdminService.updateSection(section, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY });
      qc.invalidateQueries({ queryKey: DESAIN_PUBLIC_KEY });
      qc.invalidateQueries({ queryKey: RIWAYAT_KEY });
    },
  });
}

export function useUploadGambarDesain() {
  return useMutation({
    mutationFn: (file) => desainAdminService.uploadGambar(file),
  });
}

// ── Riwayat / Rollback ─────────────────────────────────────────────────────

/** `scope`: "global"|"beranda"|"profil"|"berita"|"timeline" */
export function useDesainRiwayat(scope) {
  return useQuery({
    queryKey: [...RIWAYAT_KEY, scope],
    queryFn: () => desainAdminService.getRiwayat(scope),
    enabled: Boolean(scope),
  });
}

export function useRollbackDesain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (riwayatId) => desainAdminService.rollback(riwayatId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY });
      qc.invalidateQueries({ queryKey: DESAIN_PUBLIC_KEY });
      qc.invalidateQueries({ queryKey: RIWAYAT_KEY });
    },
  });
}
