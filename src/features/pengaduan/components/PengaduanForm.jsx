import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { validateLampiran, formatFileSize } from "@/shared/utils/fileValidator";
import { useSubmitPengaduan } from "../hooks/usePengaduan";

const JENIS_OPTIONS = [
  { value: "pengaduan",    label: "Pengaduan" },
  { value: "saran",        label: "Saran / Masukan" },
  { value: "surat_masuk",  label: "Penerusan Surat Masuk" },
];

const DEFAULT_FORM = {
  nama:    "",
  email:   "",
  no_hp:   "",
  jenis:   "pengaduan",
  pesan:   "",
  lampiran: null,
};

/**
 * PengaduanForm — form pengiriman pengaduan / surat untuk publik.
 * Setelah sukses menampilkan kode unik untuk tracking.
 */
export default function PengaduanForm() {
  const [form,        setForm]        = useState(DEFAULT_FORM);
  const [lampiranErr, setLampiranErr] = useState(null);
  const [submitted,   setSubmitted]   = useState(null); // { kode_unik }

  const mutation = useSubmitPengaduan();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setForm((p) => ({ ...p, lampiran: null })); return; }
    const { valid, error } = validateLampiran(file);
    if (!valid) { setLampiranErr(error); return; }
    setLampiranErr(null);
    setForm((p) => ({ ...p, lampiran: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutation.mutateAsync(form);
      setSubmitted({ kode_unik: res.data?.kode_unik });
      setForm(DEFAULT_FORM);
    } catch {
      // Error ditampilkan via mutation.error
    }
  };

  // ── Tampilan sukses ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-brand-green-50 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-neutral-900 text-xl mb-2">Pengaduan Terkirim!</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Simpan kode berikut untuk melacak status pengaduan Anda.
        </p>
        {submitted.kode_unik && (
          <div className="inline-flex items-center gap-2 bg-brand-green-50 border border-brand-green-200 rounded-lg px-6 py-3 mb-6">
            <span className="font-display font-bold text-brand-green-500 text-2xl tracking-widest">
              {submitted.kode_unik}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(submitted.kode_unik)}
              className="text-brand-green-400 hover:text-brand-green-600"
              title="Salin kode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        )}
        <Button onClick={() => setSubmitted(null)} variant="outline">
          Kirim Pengaduan Lain
        </Button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Error global */}
      {mutation.isError && (
        <div role="alert" className="px-4 py-3 bg-red-50 border border-state-error/30 rounded-lg text-sm text-state-error">
          Gagal mengirim pengaduan. Periksa koneksi internet dan coba lagi.
        </div>
      )}

      {/* Nama + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pg-nama" className="form-label">Nama Lengkap <span className="text-state-error">*</span></label>
          <input id="pg-nama" name="nama" type="text" required
            value={form.nama} onChange={handleChange}
            placeholder="Nama Anda"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pg-email" className="form-label">Email <span className="text-state-error">*</span></label>
          <input id="pg-email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="email@domain.com"
            className="input-field"
          />
        </div>
      </div>

      {/* No. HP + Jenis */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pg-hp" className="form-label">No. HP / WhatsApp</label>
          <input id="pg-hp" name="no_hp" type="tel"
            value={form.no_hp} onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pg-jenis" className="form-label">Jenis <span className="text-state-error">*</span></label>
          <select id="pg-jenis" name="jenis" value={form.jenis} onChange={handleChange} className="input-field">
            {JENIS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pesan */}
      <div>
        <label htmlFor="pg-pesan" className="form-label">Isi Pesan / Pengaduan <span className="text-state-error">*</span></label>
        <textarea id="pg-pesan" name="pesan" rows={5} required
          value={form.pesan} onChange={handleChange}
          placeholder="Tuliskan pengaduan, saran, atau isi surat Anda di sini…"
          className="input-field resize-none"
        />
      </div>

      {/* Lampiran */}
      <div>
        <label className="form-label">
          Lampiran
          <span className="text-xs font-normal text-neutral-400 ml-1">(PDF, DOCX, JPG, PNG — maks. 5 MB)</span>
        </label>
        <input type="file" accept=".pdf,.docx,image/jpeg,image/png"
          onChange={handleFileChange}
          className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:text-neutral-700 file:font-semibold hover:file:bg-neutral-200"
        />
        {form.lampiran && (
          <p className="text-xs text-neutral-500 mt-1">
            {form.lampiran.name} ({formatFileSize(form.lampiran.size)})
          </p>
        )}
        {lampiranErr && <p className="form-error">{lampiranErr}</p>}
      </div>

      <Button type="submit" loading={mutation.isPending} className="w-full justify-center">
        Kirim Pengaduan
      </Button>
    </form>
  );
}
