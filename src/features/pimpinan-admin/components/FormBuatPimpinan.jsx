import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { LEVEL_PIMPINAN_LABELS, composeLabelPimpinan } from "@/shared/constants/statusEnum";

const DEFAULT_FORM = { nama: "", email: "", level: "daerah", nama_wilayah: "", no_hp: "" };

export default function FormBuatPimpinan({ onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const previewLabel = form.nama_wilayah.trim()
    ? composeLabelPimpinan(form.level, form.nama_wilayah)
    : null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="form-label">Nama Penanggung Jawab <span className="text-state-error">*</span></label>
        <input
          name="nama" type="text" required value={form.nama} onChange={handleChange}
          placeholder="Nama ketua umum / penanggung jawab" className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Email <span className="text-state-error">*</span></label>
        <input
          name="email" type="email" required value={form.email} onChange={handleChange}
          placeholder="pimpinan@ipmjabar.or.id" className="input-field"
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
          placeholder='mis. "Kabupaten Bandung"' className="input-field"
        />
        {previewLabel && (
          <p className="text-xs text-neutral-500 mt-1.5">
            Pratinjau: <strong className="text-neutral-700">{previewLabel}</strong>
          </p>
        )}
      </div>

      <div>
        <label className="form-label">No. HP</label>
        <input
          name="no_hp" type="tel" value={form.no_hp} onChange={handleChange}
          placeholder="08xxxxxxxxxx (opsional)" className="input-field"
        />
      </div>

      <div className="p-3 bg-brand-gold-50 border border-brand-gold-300 rounded-lg text-xs text-neutral-700">
        Password sementara akan dibuat otomatis dan dikirim ke email di atas. Akun akan
        diminta mengganti password saat login pertama.
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>Buat Akun</Button>
      </div>
    </form>
  );
}