import { useEffect, useState } from "react";

// Ikon & label di bawah ini SENGAJA disamakan persis dengan
// shared/components/layout/PimpinanSidebar.jsx supaya tur ini terasa seperti
// pratinjau nyata dari panel yang akan dipakai, bukan ilustrasi generik.
const TOUR_STEPS = [
  {
    label: "Dashboard",
    desc: "Ringkasan aktivitas: surat terbaru, status artikel, dan notifikasi yang perlu ditindaklanjuti.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Artikel & Berita",
    desc: "Tulis artikel kegiatan, lalu ajukan ke Wilayah untuk direview sebelum tayang di website publik.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h4m3 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Surat Menyurat",
    desc: "Kirim, terima, dan balas surat resmi ke Pimpinan lain atau langsung ke PW IPM Jawa Barat.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Arsip",
    desc: "Unduh rekap surat & artikel yang pernah dibuat kapan saja, termasuk rekap dalam format Excel.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l1.5-4h15L21 7M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18M10 11h4" />
      </svg>
    ),
  },
  {
    label: "Aspirasi ke Wilayah",
    desc: "Sampaikan aspirasi atau keluhan langsung ke PW IPM Jawa Barat, dan pantau balasannya di sini.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: "Pengaturan Akun",
    desc: "Ubah foto profil, email, dan password kapan saja — ada di pojok kiri bawah panel.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function StepTur({ onFinish, isFinishing, finishError }) {
  const [active, setActive] = useState(0);
  const isLast = active === TOUR_STEPS.length - 1;

  // Navigasi panah kiri/kanan — bonus kecil, tidak wajib dipakai.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") setActive((i) => Math.min(i + 1, TOUR_STEPS.length - 1));
      if (e.key === "ArrowLeft") setActive((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">
          Yuk, Kenali Panel Pimpinan
        </h2>
        <p className="text-sm text-neutral-500">
          Ini menu-menu yang akan Anda pakai sehari-hari.
        </p>
      </div>

      {/* Pratinjau sidebar — ikon & label sama persis dengan panel asli */}
      <div className="rounded-card border border-neutral-200 bg-neutral-50 p-2">
        {TOUR_STEPS.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(i)}
              aria-current={isActive ? "step" : undefined}
              className={`w-full text-left rounded-lg transition-all duration-200 mb-1 last:mb-0 border-l-[3px] ${
                isActive
                  ? "bg-white border-brand-green-500 shadow-sm"
                  : "border-transparent hover:bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span className={`shrink-0 transition-colors ${isActive ? "text-brand-green-500" : "text-neutral-400"}`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-semibold transition-colors ${isActive ? "text-neutral-900" : "text-neutral-500"}`}>
                  {item.label}
                </span>
              </div>

              {/* Deskripsi hanya muncul untuk item yang sedang disorot —
                  ini "spotlight"-nya: satu per satu, bukan daftar panjang. */}
              <div
                className={`grid transition-all duration-200 ease-out ${
                  isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-xs text-neutral-500 leading-relaxed px-3 pb-3 pl-11">
                    {item.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Kontrol tur */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setActive((i) => Math.max(i - 1, 0))}
          disabled={active === 0}
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-800 disabled:opacity-0 disabled:pointer-events-none min-h-[44px] px-2 transition-opacity"
        >
          ← Sebelumnya
        </button>

        <span className="text-xs text-neutral-400 shrink-0">
          {active + 1} / {TOUR_STEPS.length}
        </span>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setActive((i) => Math.min(i + 1, TOUR_STEPS.length - 1))}
            className="text-sm font-semibold text-brand-green-600 hover:text-brand-green-700 min-h-[44px] px-2"
          >
            Selanjutnya →
          </button>
        ) : (
          <span className="w-[44px]" aria-hidden="true" />
        )}
      </div>

      {finishError && <p className="form-error">{finishError}</p>}

      <button type="button" onClick={onFinish} className="btn-primary w-full" disabled={isFinishing}>
        {isFinishing ? "Menyiapkan panel..." : isLast ? "Mulai Menggunakan" : "Lewati, langsung mulai"}
      </button>
    </div>
  );
}
