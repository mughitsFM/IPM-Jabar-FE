import { useState } from "react";
import { validateGambar } from "@/shared/utils/fileValidator";

/**
 * FormProfilUmum — form profil umum (nama, no_hp, foto profil), generik.
 * Dipakai StepProfil (onboarding, file 03) dan PengaturanAkunPage (file 08).
 *
 * Props:
 * - user            : { nama, no_hp, foto_profil_url } — nilai awal form
 * - onUpdate(formData) : async, dipanggil saat submit. Lempar error (axios)
 *                        supaya pesannya tampil di form.
 * - title, subtitle : teks header opsional
 * - submitLabel      : label tombol submit (default "Simpan")
 * - showSkip         : tampilkan tombol "Lewati" (khusus onboarding)
 * - onSkip           : dipanggil saat tombol skip diklik
 */
export default function FormProfilUmum({
  user,
  onUpdate,
  title,
  subtitle,
  submitLabel = "Simpan",
  showSkip = false,
  onSkip,
}) {
  const [nama, setNama] = useState(user?.nama ?? "");
  const [noHp, setNoHp] = useState(user?.no_hp ?? "");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(user?.foto_profil_url ?? null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, error: validationError } = validateGambar(file);
    if (!valid) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setError(null);
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (nama.trim()) formData.append("nama", nama.trim());
      formData.append("no_hp", noHp.trim());
      if (foto) formData.append("foto_profil", foto);

      await onUpdate(formData);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Gagal menyimpan profil. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(title || subtitle) && (
        <div className="text-center mb-2">
          {title && <h2 className="font-display text-lg font-semibold text-neutral-900">{title}</h2>}
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}

      <div className="flex justify-center">
        <label className="cursor-pointer group relative">
          <div className="h-20 w-20 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Pratinjau foto profil" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-neutral-400">
                {nama ? nama.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFotoChange}
            className="hidden"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-colors text-white text-xs opacity-0 group-hover:opacity-100">
            Ubah
          </span>
        </label>
      </div>

      <div>
        <label className="form-label" htmlFor="nama">Nama</label>
        <input
          id="nama"
          className="input-field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama penanggung jawab"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="no_hp">Nomor HP</label>
        <input
          id="no_hp"
          className="input-field"
          value={noHp}
          onChange={(e) => setNoHp(e.target.value)}
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        {showSkip && (
          <button type="button" onClick={onSkip} className="btn-outline flex-1" disabled={isSubmitting}>
            Lewati, lengkapi nanti
          </button>
        )}
        <button type="submit" className={`btn-primary ${showSkip ? "flex-1" : "w-full"}`} disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}