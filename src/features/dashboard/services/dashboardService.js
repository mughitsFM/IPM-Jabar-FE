// frontend/features/dashboard/services/dashboardService.js (baru, lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

export const dashboardService = {
  getSummary: () =>
    apiClient.get("/admin/dashboard/summary").then((r) => r.data),
};