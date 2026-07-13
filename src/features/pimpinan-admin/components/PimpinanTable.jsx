import { useState } from "react";
import Badge from "@/shared/components/ui/Badge";
import { ROLES } from "@/shared/constants/roles";

// Inisial avatar — fallback "?" untuk akun yang belum onboarding (nama masih null).
function initialFrom(nama) {
  return nama?.trim()?.charAt(0)?.toUpperCase() || "?";
}

// Sel kredensial: akun masih pakai kredensial default (hasil generate, belum
// pernah diganti pimpinan/superadmin) -> tampilkan email+password placeholder
// dengan tombol reveal (tersembunyi by default, mis. saat di-screen-share admin).
// Begitu kredensial_default === false, password sudah tidak pernah dikirim
// backend (lihat _doc_to_dict di services.py) sehingga cukup badge info.
function SelKredensial({ pimpinan }) {
  const [show, setShow] = useState(false);

  if (!pimpinan.kredensial_default) {
    return (
      <Badge
        label="Sudah diganti pengguna"
        colorClass="bg-neutral-200 text-neutral-500"
      />
    );
  }

  if (!pimpinan.password_sementara) {
    // Jaga-jaga: kredensial_default true tapi password_sementara sudah tidak
    // ikut di payload (mis. list endpoint tidak menyertakannya). Jangan
    // klaim "belum diganti" secara salah — cukup info netral.
    return <span className="text-neutral-400 text-xs">—</span>;
  }

  return (
    <div className="text-xs">
      {show ? (
        <div className="space-y-0.5">
          <p className="font-mono text-neutral-800 break-all">{pimpinan.email}</p>
          <p className="font-mono text-neutral-500 break-all">{pimpinan.password_sementara}</p>
        </div>
      ) : (
        <p className="text-neutral-400 italic">Belum diganti</p>
      )}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold mt-1"
      >
        {show ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
  );
}

export default function PimpinanTable({
  list,
  currentUserRole,
  togglingId,
  onEdit,
  onToggleActive,
  onOverrideKredensial,
}) {
  const isSuperAdmin = currentUserRole === ROLES.SUPER_ADMIN;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-card border border-neutral-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {["Nama", "Label Lengkap", "Email", "Kredensial", "No. HP", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.uid} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-green-500/10 flex items-center justify-center text-brand-green-500 font-bold text-xs shrink-0">
                      {initialFrom(p.nama)}
                    </div>
                    <span>{p.nama || <span className="text-neutral-400 italic font-normal">Belum diatur</span>}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {p.label_lengkap || <span className="text-neutral-400 italic">Akun Belum Diatur</span>}
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.email}</td>
                <td className="px-4 py-3">
                  <SelKredensial pimpinan={p} />
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.no_hp || "—"}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={p.status_aktif ? "Aktif" : "Nonaktif"}
                    colorClass={
                      p.status_aktif
                        ? "bg-brand-green-50 text-brand-green-500"
                        : "bg-neutral-200 text-neutral-500"
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(p)}
                      className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      disabled={togglingId === p.uid}
                      onClick={() => onToggleActive(p)}
                      className="text-brand-gold-600 hover:text-brand-gold-700 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-gold-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {togglingId === p.uid ? "…" : p.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => onOverrideKredensial(p)}
                        className="text-state-error font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Ubah Kredensial
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3">
        {list.map((p) => (
          <div key={p.uid} className="bg-white rounded-card border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-full bg-brand-green-500/10 flex items-center justify-center text-brand-green-500 font-bold text-sm shrink-0">
                  {initialFrom(p.nama)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">
                    {p.nama || <span className="text-neutral-400 italic font-normal">Belum diatur</span>}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {p.label_lengkap || "Akun Belum Diatur"}
                  </p>
                </div>
              </div>
              <Badge
                label={p.status_aktif ? "Aktif" : "Nonaktif"}
                colorClass={
                  p.status_aktif
                    ? "bg-brand-green-50 text-brand-green-500"
                    : "bg-neutral-200 text-neutral-500"
                }
              />
            </div>

            <dl className="text-xs text-neutral-600 space-y-1 mb-3">
              <div className="flex justify-between gap-2">
                <dt className="text-neutral-400">Email</dt>
                <dd className="truncate">{p.email}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-neutral-400">No. HP</dt>
                <dd>{p.no_hp || "—"}</dd>
              </div>
              <div className="flex justify-between gap-2 items-start">
                <dt className="text-neutral-400 shrink-0">Kredensial</dt>
                <dd className="text-right"><SelKredensial pimpinan={p} /></dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => onEdit(p)}
                className="min-h-[44px] px-3 rounded text-brand-blue-500 font-semibold text-xs hover:bg-brand-blue-500/10"
              >
                Edit
              </button>
              <button
                disabled={togglingId === p.uid}
                onClick={() => onToggleActive(p)}
                className="min-h-[44px] px-3 rounded text-brand-gold-600 font-semibold text-xs hover:bg-brand-gold-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {togglingId === p.uid ? "…" : p.status_aktif ? "Nonaktifkan" : "Aktifkan"}
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => onOverrideKredensial(p)}
                  className="min-h-[44px] px-3 rounded text-state-error font-semibold text-xs hover:bg-red-50"
                >
                  Ubah Kredensial
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}