import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { validateGambar } from "@/shared/utils/fileValidator";
import { profilService } from "../services/profilService";

const DEFAULT = {
  nama:         "",
  jabatan_id:   "",
  jabatan_label:"",
  bidang:       "",
  foto_url:     "",
  urutan:       0,
};

/**
 * AnggotaForm — form tambah / edit anggota kepengurusan.
 *
 * @param {object}   initialData  - null = mode tambah
 * @param {Array}    jabatanList  - daftar jabatan untuk dropdown
 * @param {function} onSubmit
 * @param {function} onCancel
 * @param {boolean}  isSubmitting
 */
export default function AnggotaForm({ initialData = null, jabatanList = [], onSubmit, onCancel, isSubmitting }) {
  const [form, setForm]               = useState(initialData ?? DEFAULT);
  const [fotoPreview, setFotoPreview] = useState(initialData?.foto_url ?? null);
  const [fotoError, setFotoError]     = useState(null);
  const [uploading, setUploading]     = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateGambar(file);
    if (!valid) { setFotoError(error); return; }
    setFotoError(null);
    setFotoPreview(URL.createObjectURL(file));
    try {
      setUploading(true);
      const { foto_url } = await profilService.uploadFoto(file);
      setForm((prev) => ({ ...prev, foto_url }));
    } catch {
      setFotoError("Gagal mengunggah foto. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Foto */}
      <div>
        <label className="form-label">Foto</label>
        {fotoPreview && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-200 mb-2">
            <img src={fotoPreview} alt="Preview foto" className="w-full h-full object-cover" />
          </div>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFotoChange}
          className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green-50 file:text-brand-green-500 file:font-semibold hover:file:bg-brand-green-100"
        />
        {uploading && <p className="text-xs text-brand-blue-500 mt-1">Mengunggah foto…</p>}
        {fotoError && <p className="form-error">{fotoError}</p>}
      </div>

      {/* Nama */}
      <div>
        <label htmlFor="nama" className="form-label">Nama Lengkap <span className="text-state-error">*</span></label>
        <input id="nama" name="nama" type="text" required
          value={form.nama} onChange={handleChange}
          placeholder="Nama lengkap anggota"
          className="input-field"
        />
      </div>

      {/* Jabatan */}
      <div>
        <label htmlFor="jabatan_id" className="form-label">Jabatan <span className="text-state-error">*</span></label>
        <select id="jabatan_id" name="jabatan_id" required value={form.jabatan_id} onChange={handleChange} className="input-field">
          <option value="">-- Pilih Jabatan --</option>
          {jabatanList.map((j) => (
            <option key={j.id} value={j.id}>{j.nama}</option>
          ))}
        </select>
      </div>

      {/* Label jabatan (opsional, bisa override) */}
      <div>
        <label htmlFor="jabatan_label" className="form-label">Label Jabatan Tambahan</label>
        <input id="jabatan_label" name="jabatan_label" type="text"
          value={form.jabatan_label} onChange={handleChange}
          placeholder="Misal: Wakil I, Sekretaris Umum"
          className="input-field"
        />
      </div>

      {/* Bidang */}
      <div>
        <label htmlFor="bidang" className="form-label">Bidang / Departemen</label>
        <input id="bidang" name="bidang" type="text"
          value={form.bidang} onChange={handleChange}
          placeholder="Misal: Bidang Teknologi Informasi"
          className="input-field"
        />
      </div>

      {/* Urutan */}
      <div>
        <label htmlFor="urutan" className="form-label">Urutan Tampil</label>
        <input id="urutan" name="urutan" type="number" min="0"
          value={form.urutan} onChange={handleChange}
          className="input-field w-28"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting || uploading}>
          {initialData ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}
