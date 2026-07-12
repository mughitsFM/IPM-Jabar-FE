import { apiClient } from "@/shared/lib/axiosClient";

export const desainPublicService = {
  getAll: () => apiClient.get("/desain/").then((r) => r.data),
};
