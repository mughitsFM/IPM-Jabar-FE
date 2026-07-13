import { useState } from "react";
import { LEVEL_PIMPINAN_LABELS, composeLabelPimpinan } from "@/shared/constants/statusEnum";

/**
 * Step onboarding: nama penanggung jawab + level (PD/PC/PR) + nama wilayah.
 * SENGAJA tidak bisa dilewati (tidak ada tombol "Lewati") — tiga field ini
 * yang menentukan identitas & label lengkap pimpinan (mis. "PC IPM Kota
 * Cirebon"), dipakai di seluruh sistem (surat-menyurat, artikel, dsb), jadi
 * berbeda dari StepProfil (no_hp/foto) yang memang boleh dilengkapi nanti.
 *
 * Nilai di sini TIDAK langsung dikirim ke backend — hanya disimpan di state
 * parent (OnboardingPage) dan baru dikirim bersama email & password saat
 * submit gabungan di StepEmail (lihat catatan di OnboardingPage.jsx).
 */
export default function StepIdentitasPimpinan({ initialValue, onNext }) {
  const [nama, setNama] = useState(initialValue?.nama ?? "");
  const [level, setLevel] = useState(initialValue?.level || "daerah");
  const [namaWilayah, setNamaWilayah] = useState(initialValue?.nama_wilayah ?? "");

  const previewLabel = namaWilayah.trim() ? composeLabelPimpinan(level, namaWilayah) : null;

  function handleSubmit(e) {
    e.preventDefault();
    onNext({ nama: nama.trim(), level, nama_wilayah: namaWilayah.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Identitas Pimpinan</h2>
        <p className="text-sm text-neutral-500">
          Wajib diisi — menentukan label lengkap Pimpinan Anda di seluruh sistem.
        </p>
      </div>

      <div>
        <label className="form-label" htmlFor="nama">
          Nama Penanggung Jawab <span className="text-state-error">*</span>
        </label>
        <input
          id="nama"
          type="text"
          required
          className="input-field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama ketua umum / penanggung jawab"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="level">
          Level <span className="text-state-error">*</span>
        </label>
        <select
          id="level"
          className="input-field"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {Object.entries(LEVEL_PIMPINAN_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="nama_wilayah">
          Nama Pimpinan <span className="text-state-error">*</span>
        </label>
        <input
          id="nama_wilayah"
          type="text"
          required
          className="input-field"
          value={namaWilayah}
          onChange={(e) => setNamaWilayah(e.target.value)}
          placeholder='mis. "Kabupaten Bandung"'
        />
        {previewLabel && (
          <p className="text-xs text-neutral-500 mt-1.5">
            Pratinjau: <strong className="text-neutral-700">{previewLabel}</strong>
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary w-full">
        Lanjut
      </button>
    </form>
  );
}