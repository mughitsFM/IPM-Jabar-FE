// frontend/features/dashboard/services/dashboardService.js (baru, lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

export const dashboardService = {
  getSummary: () =>
    apiClient.get("/admin/dashboard/summary").then((r) => r.data),
  getSummarySuperadmin: () =>
    apiClient.get("/admin/dashboard/summary-superadmin").then((r) => r.data),
  getSummaryPimpinan: () =>
    apiClient.get("/pimpinan/dashboard/summary/").then((r) => r.data),
};