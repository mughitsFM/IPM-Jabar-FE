const MENU_TOUR = [
  {
    title: "Dashboard",
    desc: "Ringkasan aktivitas: surat terbaru, status artikel, notifikasi.",
  },
  {
    title: "Artikel & Berita",
    desc: "Tulis artikel, ajukan ke Wilayah untuk direview sebelum tayang di web publik.",
  },
  {
    title: "Surat Menyurat",
    desc: "Kirim, terima, dan balas surat resmi ke Pimpinan lain atau ke PW IPM Jawa Barat.",
  },
  {
    title: "Arsip",
    desc: "Unduh rekap surat & artikel yang pernah dibuat, termasuk rekap Excel.",
  },
  {
    title: "Aspirasi ke Wilayah",
    desc: "Sampaikan aspirasi/keluhan langsung ke PW IPM Jawa Barat dan pantau balasannya.",
  },
  {
    title: "Pengaturan Akun",
    desc: "Ubah foto profil, email, dan password kapan saja.",
  },
];

export default function StepTur({ onFinish, isFinishing, finishError }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">
          Yuk, Kenali Menu Panel Pimpinan
        </h2>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {MENU_TOUR.map((item) => (
          <div key={item.title} className="rounded-card border border-neutral-200 p-3">
            <p className="font-semibold text-neutral-900 text-sm">{item.title}</p>
            <p className="text-sm text-neutral-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {finishError && <p className="form-error">{finishError}</p>}

      <button type="button" onClick={onFinish} className="btn-primary w-full" disabled={isFinishing}>
        {isFinishing ? "Menyiapkan panel..." : "Mulai Menggunakan"}
      </button>
    </div>
  );
}
