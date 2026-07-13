import { useState } from "react";
import Button from "@/shared/components/ui/Button";

// Samakan dengan MAX_GENERATE_PER_BATCH di pimpinan/services.py (backend)
const MAX_JUMLAH = 50;

export default function FormGenerateAkunPimpinan({ onSubmit, onCancel, isSubmitting }) {
  const [jumlah, setJumlah] = useState(1);

  const handleChangeJumlah = (e) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    setJumlah(Math.max(1, Math.min(MAX_JUMLAH, raw)));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(jumlah); }} className="space-y-4">
      <div>
        <label className="form-label">Jumlah Akun yang Digenerate <span className="text-state-error">*</span></label>
        <input
          name="jumlah" type="number" min={1} max={MAX_JUMLAH} required
          value={jumlah} onChange={handleChangeJumlah}
          className="input-field"
        />
        <p className="text-xs text-neutral-500 mt-1.5">Maksimal {MAX_JUMLAH} akun sekali proses generate.</p>
      </div>

      <div className="p-3 bg-brand-gold-50 border border-brand-gold-300 rounded-lg text-xs text-neutral-700">
        Email dan password akan dibuat otomatis oleh sistem dan <strong>tidak dikirim</strong> ke mana
        pun (email masih placeholder). Setelah proses ini selesai, kredensial tiap akun akan
        ditampilkan sekali di layar — catat atau bagikan secara manual ke pimpinan terkait. Nama,
        level (PD/PC/PR), dan wilayah akan diisi sendiri oleh pimpinan saat pertama kali login
        (onboarding).
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>Generate Akun</Button>
      </div>
    </form>
  );
}