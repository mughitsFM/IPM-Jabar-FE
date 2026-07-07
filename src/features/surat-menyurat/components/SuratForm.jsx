{/* frontend/features/surat-menyurat/components/SuratForm.jsx (lengkap) */}
import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { validateLampiranPDF } from "@/shared/utils/fileValidator";
import PenerimaPicker from "./PenerimaPicker";

/**
 * SuratForm — dipakai untuk DUA mode:
 *   - Compose baru (default): semua field kosong & bisa diisi bebas.
 *   - Balas (`balasanDariSuratId` + `prefillPenerima` diisi): `PenerimaPicker`
 *     dan `perihal` dikunci (read-only, sudah terisi "RE: ..."), pengguna
 *     hanya mengisi nomor_surat (nomor balasan mereka sendiri), isi_ringkas,
 *     dan lampiran baru — lihat 06-surat-menyurat.md §4.3.
 */
export default function SuratForm({
  balasanDariSuratId = null,
  prefillPenerima = null, // { tipe, uid, label } — dikunci bila diisi
  prefillPerihal = "",    // dipakai sbg initial value utk field perihal ("RE: ...")
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isBalasMode = Boolean(balasanDariSuratId);

  const [form, setForm] = useState({ nomor_surat: "", perihal: prefillPerihal, isi_ringkas: "" });
  const [penerima, setPenerima] = useState(prefillPenerima);
  const [lampiranFile, setLampiranFile] = useState(null);
  const [lampiranError, setLampiranError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLampiranChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateLampiranPDF(file);
    if (!valid) { setLampiranError(error); setLampiranFile(null); return; }
    setLampiranError(null);
    setLampiranFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!penerima) return;
    if (!lampiranFile) { setLampiranError("Lampiran PDF wajib diunggah."); return; }

    onSubmit({
      ...form,
      tipe_penerima: penerima.tipe,
      penerima_uid: penerima.uid,
      balasan_dari_surat_id: balasanDariSuratId,
      lampiranFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PenerimaPicker value={penerima} onChange={setPenerima} disabled={isBalasMode} />

      <div>
        <label htmlFor="nomor_surat" className="form-label">Nomor Surat <span className="text-state-error">*</span></label>
        <input id="nomor_surat" name="nomor_surat" type="text" required
          value={form.nomor_surat} onChange={handleChange}
          placeholder="mis. 001/PD-IPM/VII/2026" className="input-field" />
      </div>

      <div>
        <label htmlFor="perihal" className="form-label">Perihal <span className="text-state-error">*</span></label>
        <input id="perihal" name="perihal" type="text" required disabled={isBalasMode}
          value={form.perihal} onChange={handleChange}
          placeholder="Ringkasan isi surat" className="input-field" />
      </div>

      <div>
        <label htmlFor="isi_ringkas" className="form-label">Isi Ringkas</label>
        <textarea id="isi_ringkas" name="isi_ringkas" rows={3}
          value={form.isi_ringkas} onChange={handleChange}
          placeholder="Opsional — ringkasan singkat isi surat" className="input-field" />
      </div>

      <div>
        <label className="form-label">Lampiran Surat (PDF) <span className="text-state-error">*</span></label>
        <input type="file" accept="application/pdf" onChange={handleLampiranChange}
          className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green-50 file:text-brand-green-500 file:font-semibold hover:file:bg-brand-green-100" />
        <p className="text-xs text-neutral-400 mt-1">Format PDF, maksimal 10 MB (hasil scan surat + tanda tangan/stempel).</p>
        {lampiranFile && <p className="text-xs text-brand-green-600 mt-1">✓ {lampiranFile.name}</p>}
        {lampiranError && <p className="form-error">{lampiranError}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>{isBalasMode ? "Kirim Balasan" : "Kirim Surat"}</Button>
      </div>
    </form>
  );
}
