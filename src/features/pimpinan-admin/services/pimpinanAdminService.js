import { apiClient } from "@/shared/lib/axiosClient";

export const pimpinanAdminService = {
  getList: (params) => apiClient.get("/admin/pimpinan/", { params }).then((r) => r.data),
  getById: (uid) => apiClient.get(`/admin/pimpinan/${uid}/`).then((r) => r.data),
  create: (payload) => apiClient.post("/admin/pimpinan/", payload).then((r) => r.data),
  update: (uid, payload) => apiClient.patch(`/admin/pimpinan/${uid}/`, payload).then((r) => r.data),
  overrideKredensial: (uid, payload) =>
    apiClient.patch(`/admin/pimpinan/${uid}/kredensial/`, payload).then((r) => r.data),
};