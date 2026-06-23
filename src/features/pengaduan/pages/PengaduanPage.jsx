import { useState } from "react";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import PengaduanForm from "../components/PengaduanForm";
import StatusChecker from "../components/StatusChecker";

const TABS = [
  { id: "kirim",  label: "Kirim Pengaduan" },
  { id: "cek",    label: "Cek Status" },
];

export default function PengaduanPage() {
  const [activeTab, setActiveTab] = useState("kirim");

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-brand-green-500 py-12">
        <div className="container-site">
          <h1 className="font-display font-bold text-white text-3xl mb-2">
            Pengaduan &amp; Penerusan Surat
          </h1>
          <p className="text-brand-green-50 text-sm max-w-xl">
            Sampaikan pengaduan, saran, atau teruskan surat resmi kepada PW IPM Jawa Barat.
            Identitas pengirim dijaga kerahasiaannya.
          </p>
        </div>
      </section>

      <section className="container-site section">
        <div className="max-w-2xl mx-auto">
          {/* Tab navigasi */}
          <div className="flex border-b border-neutral-200 mb-8" role="tablist">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors duration-150 min-h-[44px]
                  ${activeTab === id
                    ? "border-brand-green-500 text-brand-green-500"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Konten tab */}
          <div role="tabpanel">
            {activeTab === "kirim" ? (
              <>
                <p className="text-sm text-neutral-600 mb-6">
                  Isi formulir di bawah ini dengan lengkap. Setelah pengiriman, Anda akan mendapatkan
                  kode unik untuk memantau status pengaduan.
                </p>
                <PengaduanForm />
              </>
            ) : (
              <>
                <p className="text-sm text-neutral-600 mb-6">
                  Masukkan kode unik yang Anda terima saat mengirim pengaduan untuk melihat perkembangan statusnya.
                </p>
                <StatusChecker />
              </>
            )}
          </div>

          {/* Info tambahan */}
          <div className="mt-10 p-4 bg-brand-gold-50 border border-brand-gold-300 rounded-lg">
            <p className="text-xs text-neutral-700 leading-relaxed">
              <span className="font-semibold">Catatan:</span> Setiap pengaduan akan ditinjau oleh tim PW IPM Jawa Barat
              dan diproses sesuai prosedur organisasi. Untuk keperluan mendesak, hubungi kontak resmi yang tertera di
              footer halaman ini.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
