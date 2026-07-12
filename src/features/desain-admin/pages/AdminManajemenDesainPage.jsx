import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Card from "@/shared/components/ui/Card";
import EmptyState from "@/shared/components/ui/EmptyState";
import GlobalForm from "../components/GlobalForm";
import BerandaHeroForm from "../components/BerandaHeroForm";
import SectionHeroForm from "../components/SectionHeroForm";
import RiwayatPanel from "../components/RiwayatPanel";
import {
  useDesainAdminConfig,
  useUpdateDesainGlobal,
  useUpdateDesainSection,
} from "../hooks/useDesainAdmin";

const TABS = [
  { key: "global", label: "Global" },
  { key: "beranda", label: "Beranda" },
  { key: "profil", label: "Profil" },
  { key: "berita", label: "Berita" },
  { key: "timeline", label: "Timeline" },
];

const SECTION_LABELS = { profil: "Profil", berita: "Berita", timeline: "Timeline" };

export default function AdminManajemenDesainPage() {
  const [activeTab, setActiveTab] = useState("global");
  const [savedMessage, setSavedMessage] = useState("");
  const [showRiwayat, setShowRiwayat] = useState(false);

  const { data, isLoading, isError } = useDesainAdminConfig();
  const config = data?.data;

  const updateGlobalMutation = useUpdateDesainGlobal();
  const updateSectionMutation = useUpdateDesainSection(activeTab);

  const handleSaved = (label) => {
    setSavedMessage(`${label} berhasil disimpan.`);
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSubmitGlobal = (payload) => {
    updateGlobalMutation.mutate(payload, {
      onSuccess: () => handleSaved("Pengaturan global"),
    });
  };

  const handleSubmitSection = (payload) => {
    updateSectionMutation.mutate(payload, {
      onSuccess: () => handleSaved(`Bagian ${SECTION_LABELS[activeTab] ?? activeTab}`),
    });
  };

  const handleRolledBack = () => {
    setShowRiwayat(false);
    handleSaved("Konfigurasi dikembalikan ke versi sebelumnya");
  };

  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Manajemen Desain</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Atur logo, warna, font, isi navbar/footer, dan hero 4 halaman publik —
            tanpa perlu ubah kode.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRiwayat(true)}
          className="shrink-0 btn-outline text-sm px-4 py-2"
        >
          Riwayat &amp; Rollback
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? "border-brand-green-500 text-brand-green-600"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedMessage && (
        <div className="mb-6 p-3 bg-brand-green-50 border border-brand-green-300 rounded-lg text-sm text-brand-green-900">
          {savedMessage}
        </div>
      )}

      <Card className="p-6">
        {isLoading && (
          <p className="text-sm text-neutral-500 py-8 text-center">Memuat konfigurasi…</p>
        )}

        {isError && (
          <EmptyState
            title="Gagal memuat konfigurasi"
            message="Terjadi kesalahan saat mengambil data. Coba muat ulang halaman."
          />
        )}

        {config && (
          <>
            {activeTab === "global" && (
              <GlobalForm
                initialData={config.global}
                onSubmit={handleSubmitGlobal}
                isSubmitting={updateGlobalMutation.isPending}
              />
            )}

            {activeTab === "beranda" && (
              <BerandaHeroForm
                initialData={config.beranda}
                onSubmit={handleSubmitSection}
                isSubmitting={updateSectionMutation.isPending}
              />
            )}

            {["profil", "berita", "timeline"].includes(activeTab) && (
              <SectionHeroForm
                key={activeTab}
                initialData={config[activeTab]}
                onSubmit={handleSubmitSection}
                isSubmitting={updateSectionMutation.isPending}
                sectionLabel={SECTION_LABELS[activeTab]}
              />
            )}
          </>
        )}
      </Card>

      {showRiwayat && (
        <RiwayatPanel
          scope={activeTab}
          onClose={() => setShowRiwayat(false)}
          onRolledBack={handleRolledBack}
        />
      )}
    </AdminLayout>
  );
}
