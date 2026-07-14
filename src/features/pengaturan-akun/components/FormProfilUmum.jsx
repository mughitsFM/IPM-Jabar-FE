import { useState } from "react";
import { validateGambar } from "@/shared/utils/fileValidator";
import Button from "@/shared/components/ui/Button";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {(title || subtitle) && (
        <div className="text-center mb-2">
          {title && <h2 className="font-display text-lg font-semibold text-neutral-900">{title}</h2>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Avatar uploader */}
      <div className="flex flex-col items-center gap-2">
        <label className="cursor-pointer group relative block">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-neutral-100 border-2 border-neutral-200 overflow-hidden flex items-center justify-center ring-4 ring-transparent transition-all group-hover:ring-brand-green-100 group-focus-within:ring-brand-green-100">
            {preview ? (
              <img src={preview} alt="Pratinjau foto profil" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-neutral-400">
                {nama ? nama.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>
          <span className="absolute inset-0 hidden sm:flex flex-col items-center justify-center gap-1 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors text-white opacity-0 group-hover:opacity-100">
            <IconCamera className="h-5 w-5" />
            <span className="text-[11px] font-medium">Ubah foto</span>
          </span>
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-600 sm:hidden">
            <IconCamera className="h-4 w-4" />
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFotoChange}
            className="hidden"
          />
        </label>
        <p className="text-xs text-neutral-400">JPG, PNG, atau WEBP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="nama">Nama</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <IconUser className="h-4 w-4" />
            </span>
            <input
              id="nama"
              className="input-field pl-9"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama penanggung jawab"
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="no_hp">Nomor HP</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <IconPhone className="h-4 w-4" />
            </span>
            <input
              id="no_hp"
              className="input-field pl-9"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="08xxxxxxxxxx"
              inputMode="tel"
            />
          </div>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        {showSkip && (
          <Button type="button" variant="outline" onClick={onSkip} disabled={isSubmitting} className="sm:flex-1">
            Lewati, lengkapi nanti
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className={showSkip ? "sm:flex-1" : "w-full"}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function IconCamera({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  );
}

function IconPhone({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6.5 3h3l1.2 4.5-2.1 1.6a12 12 0 0 0 5.3 5.3l1.6-2.1L20 13v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
    </svg>
  );
}