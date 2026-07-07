// frontend/features/dashboard/hooks/usePimpinanDashboardSummary.js (baru)
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function usePimpinanDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "pimpinan", "summary"],
    queryFn: () => dashboardService.getSummaryPimpinan(),
  });
}