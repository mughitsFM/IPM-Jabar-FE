import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { LEVEL_PIMPINAN_LABELS, composeLabelPimpinan } from "@/shared/constants/statusEnum";

// Akun hasil generate yang belum onboarding punya nama/level/nama_wilayah = null.
// Admin tetap boleh mengisi lebih dulu (mis. sambil menunggu pimpinan login),
// makanya level di-default ke "daerah" (bukan biarkan undefined) supaya
// <select> tetap controlled & konsisten dengan FormBuatPimpinan.
const DEFAULT_LEVEL = "daerah";

export default function FormEditPimpinan({ initialData, onSubmit, onCancel, isSubmitting }) {
  const belumOnboarding = !initialData.level;

  const [form, setForm] = useState({
    nama: initialData.nama ?? "",
    level: initialData.level ?? DEFAULT_LEVEL,
    nama_wilayah: initialData.nama_wilayah ?? "",
    no_hp: initialData.no_hp ?? "",
    status_aktif: initialData.status_aktif,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const previewLabel = form.nama_wilayah.trim()
    ? composeLabelPimpinan(form.level, form.nama_wilayah)
    : null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {belumOnboarding && (
        <div className="p-3 bg-brand-gold-50 border border-brand-gold-300 rounded-lg text-xs text-neutral-700">
          Akun ini belum menyelesaikan onboarding — nama, level, dan wilayah masih kosong.
          Anda boleh mengisinya lebih dulu di sini, tapi pimpinan tetap bisa
          melengkapi/menggantinya sendiri saat login pertama.
        </div>
      )}

      <div>
        <label className="form-label">Email</label>
        <input
          type="email" value={initialData.email} disabled
          className="input-field bg-neutral-100 text-neutral-500 cursor-not-allowed"
        />
        <p className="text-xs text-neutral-400 mt-1">
          Email hanya bisa diubah lewat "Ubah Kredensial" (Superadmin) atau oleh Pimpinan sendiri.
        </p>
      </div>

      <div>
        <label className="form-label">Nama Penanggung Jawab <span className="text-state-error">*</span></label>
        <input
          name="nama" type="text" required value={form.nama} onChange={handleChange}
          placeholder={belumOnboarding ? "Belum diisi pimpinan" : undefined}
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Level <span className="text-state-error">*</span></label>
        <select name="level" value={form.level} onChange={handleChange} className="input-field">
          {Object.entries(LEVEL_PIMPINAN_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Nama Wilayah <span className="text-state-error">*</span></label>
        <input
          name="nama_wilayah" type="text" required value={form.nama_wilayah} onChange={handleChange}
          placeholder={belumOnboarding ? 'mis. "Kabupaten Bandung"' : undefined}
          className="input-field"
        />
        {previewLabel && (
          <p className="text-xs text-neutral-500 mt-1.5">
            Pratinjau: <strong className="text-neutral-700">{previewLabel}</strong>
          </p>
        )}
      </div>

      <div>
        <label className="form-label">No. HP</label>
        <input name="no_hp" type="tel" value={form.no_hp} onChange={handleChange} className="input-field" />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 min-h-[44px]">
        <input
          type="checkbox" name="status_aktif" checked={form.status_aktif} onChange={handleChange}
          className="w-4 h-4"
        />
        Akun aktif
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>Simpan</Button>
      </div>
    </form>
  );
}