import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { useBidangOptions } from "../hooks/useJabatan";   // ⬅️ tambahan import

const DEFAULT = {
  nama_kegiatan:   "",
  deskripsi:       "",
  bidang:          "",
  tanggal_mulai:   "",
  tanggal_selesai: "",
};

/**
 * ProkerForm — form buat/edit program kerja.
 */
export default function ProkerForm({ initialData = null, onSubmit, onCancel, isSubmitting = false, error = null }) {
  const [form, setForm] = useState(initialData ?? DEFAULT);
  const { data: bidangData, isLoading: isBidangLoading } = useBidangOptions();  // ⬅️ baru
  const bidangOptions = bidangData?.data ?? [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    // ⬅️ BARU: normalisasi tanggal date-only -> ISO datetime sebelum dikirim ke backend
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tanggal_mulai: form.tanggal_mulai
        ? `${form.tanggal_mulai}T00:00:00`
        : "",
      tanggal_selesai: form.tanggal_selesai
        ? `${form.tanggal_selesai}T23:59:59`
        : "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (// ⬅️ baru: banner pesan error dari backend
        <div className="rounded-lg bg-red-50 border border-red-200 text-state-error text-sm px-4 py-3">
          {error}
        </div>
      )}
      {/* Nama */}
      <div>
        <label htmlFor="pk-nama" className="form-label">Nama Program Kerja <span className="text-state-error">*</span></label>
        <input id="pk-nama" name="nama_kegiatan" type="text" required
          value={form.nama_kegiatan} onChange={handleChange}
          placeholder="Nama program kerja"
          className="input-field"
        />
      </div>

      {/* Bidang */}
      <div>
        <label htmlFor="pk-bidang" className="form-label">
          Bidang / Departemen <span className="text-state-error">*</span>
        </label>
        <select
          id="pk-bidang" name="bidang" required
          value={form.bidang} onChange={handleChange}
          className="input-field"
          disabled={isBidangLoading}
        >
          <option value="" disabled>
            {isBidangLoading ? "Memuat bidang..." : "Pilih bidang"}
          </option>
          {bidangOptions.map((b) => (
            <option key={b.id} value={b.nama}>{b.nama}</option>
          ))}
        </select>
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
            min={form.tanggal_mulai || undefined}   // ⬅️ baru: cegah pilih tanggal < mulai
            className="input-field"
          />
        </div>
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
