import { useQuery } from "@tanstack/react-query";
import { jabatanService } from "../services/jabatanService";

export function useBidangOptions() {
  return useQuery({
    queryKey: ["profil-jabatan", "list"],
    queryFn: () => jabatanService.getList(),
    staleTime: 5 * 60 * 1000, // data bidang jarang berubah
  });
}