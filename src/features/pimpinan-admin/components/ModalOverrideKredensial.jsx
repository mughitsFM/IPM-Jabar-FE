import { useState } from "react";
import Modal from "./Modal";
import Button from "@/shared/components/ui/Button";
import { useOverrideKredensialPimpinan } from "../hooks/usePimpinanAdmin";

export default function ModalOverrideKredensial({ pimpinan, onClose }) {
  const [emailBaru, setEmailBaru]       = useState(pimpinan.email);
  const [passwordBaru, setPasswordBaru] = useState("");
  const [ubahEmail, setUbahEmail]       = useState(false);
  const [ubahPassword, setUbahPassword] = useState(false);
  const [konfirmasi, setKonfirmasi]     = useState(false);
  const mutation = useOverrideKredensialPimpinan(pimpinan.uid);

  if (!konfirmasi) {
    return (
      <Modal title={`Ubah Kredensial — ${pimpinan.label_lengkap}`} onClose={onClose}>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 min-h-[44px]">
            <input type="checkbox" checked={ubahEmail} onChange={(e) => setUbahEmail(e.target.checked)} className="w-4 h-4" />
            Ubah Email
          </label>
          {ubahEmail && (
            <input
              className="input-field" type="email" value={emailBaru}
              onChange={(e) => setEmailBaru(e.target.value)}
            />
          )}

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 min-h-[44px]">
            <input type="checkbox" checked={ubahPassword} onChange={(e) => setUbahPassword(e.target.checked)} className="w-4 h-4" />
            Ubah Password
          </label>
          {ubahPassword && (
            <input
              className="input-field" type="password" placeholder="Password baru (min. 8 karakter)"
              minLength={8} value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)}
            />
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={onClose}>Batal</Button>
            <Button disabled={!ubahEmail && !ubahPassword} onClick={() => setKonfirmasi(true)}>
              Lanjutkan
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Konfirmasi Perubahan" onClose={onClose}>
      <div className="p-3 rounded-lg border border-state-error/30 bg-red-50">
        <p className="text-sm text-neutral-700">
          Anda akan mengubah {ubahEmail && "email"}{ubahEmail && ubahPassword && " dan "}{ubahPassword && "password"} akun{" "}
          <strong>{pimpinan.label_lengkap}</strong> secara langsung TANPA verifikasi tambahan.
          Pastikan Anda sudah mengonfirmasi permintaan ini dengan pemilik akun.
        </p>
      </div>

      {mutation.isError && (
        <p className="form-error mt-3 text-center">Gagal mengubah kredensial. Coba lagi.</p>
      )}

      <div className="flex gap-3 justify-end mt-4">
        <Button variant="ghost" onClick={onClose}>Batal</Button>
        <Button
          loading={mutation.isPending}
          onClick={async () => {
            await mutation.mutateAsync({
              ...(ubahEmail && { email: emailBaru }),
              ...(ubahPassword && { password: passwordBaru }),
            });
            onClose();
          }}
        >
          Ya, Ubah Sekarang
        </Button>
      </div>
    </Modal>
  );
}