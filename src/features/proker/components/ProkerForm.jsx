import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import {
  STATUS_PROKER,
  STATUS_PROKER_LABELS,
} from "@/shared/constants/statusEnum";

const DEFAULT = {
  nama:            "",
  deskripsi:       "",
  bidang:          "",
  tanggal_mulai:   "",
  tanggal_selesai: "",
  status:          STATUS_PROKER.AKAN_DATANG,
};

/**
 * ProkerForm — form buat/edit program kerja.
 */
export default function ProkerForm({ initialData = null, onSubmit, onCancel, isSubmitting = false }) {
  const [form, setForm] = useState(initialData ?? DEFAULT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {/* Nama */}
      <div>
        <label htmlFor="pk-nama" className="form-label">Nama Program Kerja <span className="text-state-error">*</span></label>
        <input id="pk-nama" name="nama" type="text" required
          value={form.nama} onChange={handleChange}
          placeholder="Nama program kerja"
          className="input-field"
        />
      </div>

      {/* Bidang */}
      <div>
        <label htmlFor="pk-bidang" className="form-label">Bidang / Departemen</label>
        <input id="pk-bidang" name="bidang" type="text"
          value={form.bidang} onChange={handleChange}
          placeholder="Misal: Bidang Kaderisasi"
          className="input-field"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label htmlFor="pk-deskripsi" className="form-label">Deskripsi</label>
        <textarea id="pk-deskripsi" name="deskripsi" rows={3}
          value={form.deskripsi} onChange={handleChange}
          placeholder="Deskripsi singkat program kerja"
          className="input-field resize-none"
        />
      </div>

      {/* Tanggal (2 kolom) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pk-mulai" className="form-label">Tanggal Mulai</label>
          <input id="pk-mulai" name="tanggal_mulai" type="date"
            value={form.tanggal_mulai} onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pk-selesai" className="form-label">Tanggal Selesai</label>
          <input id="pk-selesai" name="tanggal_selesai" type="date"
            value={form.tanggal_selesai} onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="pk-status" className="form-label">Status</label>
        <select id="pk-status" name="status" value={form.status} onChange={handleChange} className="input-field">
          {Object.entries(STATUS_PROKER_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}
