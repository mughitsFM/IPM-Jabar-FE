/** Role admin yang ada di sistem (sesuai Firebase custom claims) */
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  EDITOR:      "editor",     // ditampilkan sebagai "Admin" di UI — lihat 12-restrukturisasi-admin-superadmin.md
  PIMPINAN:    "pimpinan",   // BARU — lihat 01-model-role-pimpinan.md
};

/** Label tampilan untuk setiap role */
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.EDITOR]:      "Admin",      // sebelumnya "Editor"
  [ROLES.PIMPINAN]:    "Pimpinan",
};