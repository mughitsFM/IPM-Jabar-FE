import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { ROLE_LABELS } from "@/shared/constants/roles";
import FormProfilUmum from "../../components/FormProfilUmum";
import FormGantiPassword from "../../components/FormGantiPassword";
import FormGantiEmail from "../../components/FormGantiEmail";
import { pengaturanAkunServiceAdmin as service } from "../../services/pengaturanAkunService";
import PengaturanAkunHeader from "../../components/PengaturanAkunHeader";
import PengaturanAkunNav from "../../components/PengaturanAkunNav";
import SectionCard from "../../components/SectionCard";
import NotifToast from "../../components/NotifToast";

const SECTIONS = [
  { id: "profil", label: "Profil" },
  { id: "keamanan", label: "Keamanan Akun" },
];

export default function PengaturanAkunPage() {
  const { user, refreshSession } = useAuthContext();
  const [notif, setNotif] = useState(null);
  const [activeSection, setActiveSection] = useState("profil");

  function showNotif(text) {
    setNotif(text);
    setTimeout(() => setNotif(null), 4000);
  }

  return (
    <AdminLayout title="Pengaturan Akun">
      {notif && <NotifToast text={notif} />}

      <div className="mt-5">
        <PengaturanAkunNav
          sections={SECTIONS}
          activeId={activeSection}
          onChange={setActiveSection}
          accent="blue"
        />
      </div>

      <div className="pt-6">
        {activeSection === "profil" && (
          <div className="max-w-3xl">
            <SectionCard
              icon={<IconUser className="h-4.5 w-4.5" />}
              title="Informasi Profil"
              description="Nama dan foto ini akan tampil di panel admin."
              accent="blue"
            >
              <FormProfilUmum
                user={user}
                onUpdate={async (fd) => {
                  await service.updateProfil(fd);
                  await refreshSession();
                  showNotif("Profil berhasil diperbarui.");
                }}
              />
            </SectionCard>
          </div>
        )}

        {activeSection === "keamanan" && (
          <div className="max-w-3xl space-y-6">
            <SectionCard
              icon={<IconLock className="h-4.5 w-4.5" />}
              title="Ubah Password"
              description="Anda perlu memasukkan password saat ini untuk konfirmasi."
              tone="sensitive"
              accent="blue"
            >
              <FormGantiPassword
                konfirmasiGantiPassword={service.konfirmasiGantiPassword}
                onSuccess={() => showNotif("Password berhasil diubah.")}
              />
            </SectionCard>

            <SectionCard
              icon={<IconMail className="h-4.5 w-4.5" />}
              title="Ubah Email"
              description="Kode verifikasi akan dikirim ke email baru Anda."
              tone="sensitive"
              accent="blue"
            >
              <FormGantiEmail
                currentEmail={user?.email}
                mintaKodeFn={service.mintaKodeEmail}
                konfirmasiKodeFn={service.konfirmasiKodeEmail}
                onSuccess={async () => {
                  await refreshSession();
                  showNotif("Email berhasil diperbarui.");
                }}
              />
            </SectionCard>
          </div>
        )}
      </div>
    </AdminLayout>
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

function IconLock({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  );
}

function IconMail({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}