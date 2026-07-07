{/* frontend/features/aspirasi/components/AspirasiForm.jsx (lengkap) */}
// GANTI TOTAL PengaduanForm.jsx lama — form baru jauh lebih ringkas: perihal,
// detail, lampiran opsional. Tidak ada lagi email/asal_pimpinan manual
// (identitas otomatis dari sesi login) & tidak ada lagi kode_unik.
import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { useSubmitAspirasi } from "../hooks/useAspirasi";

export default function AspirasiForm({ onSuccess }) {
  const [form, setForm] = useState({ perihal: "", detail: "" });
  const [lampiran, setLampiran] = useState(null);
  const mutation = useSubmitAspirasi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("perihal", form.perihal);
    fd.append("detail", form.detail);
    if (lampiran) fd.append("lampiran", lampiran);
    await mutation.mutateAsync(fd);
    setForm({ perihal: "", detail: "" }); setLampiran(null);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="p-3 rounded-lg bg-state-error/10 text-state-error text-sm">
          {mutation.error?.response?.data?.message ?? "Gagal mengirim aspirasi. Coba lagi."}
        </div>
      )}
      <div>
        <label className="form-label">Perihal <span className="text-state-error">*</span></label>
        <input className="input-field" required value={form.perihal}
          onChange={(e) => setForm((p) => ({ ...p, perihal: e.target.value }))} />
      </div>
      <div>
        <label className="form-label">Detail Aspirasi <span className="text-state-error">*</span></label>
        <textarea className="input-field resize-none" rows={5} required value={form.detail}
          onChange={(e) => setForm((p) => ({ ...p, detail: e.target.value }))} />
      </div>
      <div>
        <label className="form-label">
          Lampiran Pendukung <span className="text-xs font-normal text-neutral-400">(opsional — gambar/PDF/DOCX, maks. 5 MB)</span>
        </label>
        <input type="file" accept=".pdf,.docx,image/jpeg,image/png"
          onChange={(e) => setLampiran(e.target.files?.[0] ?? null)}
          className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:text-neutral-700 file:font-semibold hover:file:bg-neutral-200" />
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full justify-center">Kirim Aspirasi</Button>
    </form>
  );
}
