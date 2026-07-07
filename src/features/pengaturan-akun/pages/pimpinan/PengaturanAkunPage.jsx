import { useState } from "react";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import Card from "@/shared/components/ui/Card";
import { useAuthContext } from "@/app/providers/AuthProvider";
import FormProfilUmum from "../../components/FormProfilUmum";
import FormGantiPassword from "../../components/FormGantiPassword";
import FormGantiEmail from "../../components/FormGantiEmail";
import { pengaturanAkunServicePimpinan as service } from "../../services/pengaturanAkunService";

export default function PengaturanAkunPage() {
  const { user, refreshSession } = useAuthContext();
  const [notif, setNotif] = useState(null);

  function showNotif(text) {
    setNotif(text);
    setTimeout(() => setNotif(null), 4000);
  }

  return (
    <PimpinanLayout title="Pengaturan Akun">
      <div className="max-w-2xl space-y-6">
        {notif && (
          <div className="rounded-lg bg-brand-green-50 border border-brand-green-200 text-brand-green-700 text-sm px-4 py-3">
            {notif}
          </div>
        )}

        <Card className="p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-4">Informasi Profil</h2>
          <FormProfilUmum
            user={user}
            onUpdate={async (fd) => {
              await service.updateProfil(fd);
              await refreshSession();
              showNotif("Profil berhasil diperbarui.");
            }}
          />
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-4">Ubah Password</h2>
          <FormGantiPassword
            konfirmasiGantiPassword={service.konfirmasiGantiPassword}
            onSuccess={() => showNotif("Password berhasil diubah.")}
          />
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-4">Ubah Email</h2>
          <FormGantiEmail
            currentEmail={user?.email}
            mintaKodeFn={service.mintaKodeEmail}
            konfirmasiKodeFn={service.konfirmasiKodeEmail}
            onSuccess={async () => {
              await refreshSession();
              showNotif("Email berhasil diperbarui.");
            }}
          />
        </Card>
      </div>
    </PimpinanLayout>
  );
}