/** Role admin yang ada di sistem (sesuai Firebase custom claims) */
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  EDITOR:      "editor",
};

/** Label tampilan untuk setiap role */
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.EDITOR]:      "Editor",
};
