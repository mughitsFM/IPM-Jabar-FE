import { apiClient } from "@/shared/lib/axiosClient";

export const jabatanService = {
  getList: () => apiClient.get("/admin/profil-jabatan/").then((r) => r.data),
};