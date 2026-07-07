// frontend/features/dashboard/hooks/useDashboardSummary.js (baru, lengkap)
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn:  () => dashboardService.getSummary(),
  });
}

export function useDashboardSummarySuperadmin() {
  return useQuery({
    queryKey: ["dashboard", "summary-superadmin"],
    queryFn:  () => dashboardService.getSummarySuperadmin(),
  });
}