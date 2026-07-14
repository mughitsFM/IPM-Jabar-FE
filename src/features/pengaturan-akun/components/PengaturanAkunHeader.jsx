/**
 * PengaturanAkunHeader — ringkasan identitas akun di puncak halaman.
 * Memberi konteks "akun siapa yang sedang diubah" sebelum user turun ke form,
 * dan menjadi anchor visual yang konsisten antara Admin & Pimpinan.
 *
 * Props:
 * - user   : { nama, email, foto_profil_url, role }
 * - accent : "blue" | "green" — mengikuti warna brand masing-masing panel
 */
export default function PengaturanAkunHeader({ user, roleLabel, accent = "blue" }) {
  const accentClasses = {
    blue: {
      ring: "ring-brand-blue-100",
      bg: "bg-brand-blue-500/10",
      text: "text-brand-blue-600",
    },
    green: {
      ring: "ring-brand-green-100",
      bg: "bg-brand-green-500/10",
      text: "text-brand-green-600",
    },
  }[accent];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
      <div className={`h-14 w-14 shrink-0 rounded-full overflow-hidden ring-4 ${accentClasses.ring} ${accentClasses.bg} flex items-center justify-center`}>
        {user?.foto_profil_url ? (
          <img src={user.foto_profil_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className={`text-lg font-semibold ${accentClasses.text}`}>
            {user?.nama ? user.nama.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h1 className="font-display font-bold text-neutral-900 text-xl truncate">
          {user?.nama || "Pengaturan Akun"}
        </h1>
        <p className="text-sm text-neutral-500 truncate">
          {user?.email}
          {roleLabel && <span className="text-neutral-300"> · {roleLabel}</span>}
        </p>
      </div>
    </div>
  );
}