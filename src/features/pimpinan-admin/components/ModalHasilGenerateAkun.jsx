import { useState } from "react";
import Button from "@/shared/components/ui/Button";

function BarisAkun({ akun }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const teks = `Email: ${akun.email}\nPassword: ${akun.password_sementara}`;
    try {
      await navigator.clipboard.writeText(teks);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API tidak tersedia (mis. context tidak secure) — admin
      // masih bisa salin manual dari teks yang tampil di layar.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 border border-neutral-200 rounded-lg text-sm">
      <div className="min-w-0">
        <p className="font-mono text-neutral-800 truncate">{akun.email}</p>
        <p className="font-mono text-neutral-500">{akun.password_sementara}</p>
      </div>
      <Button type="button" variant="ghost" onClick={handleCopy} className="whitespace-nowrap">
        {copied ? "Tersalin" : "Salin"}
      </Button>
    </div>
  );
}

export default function ModalHasilGenerateAkun({ akunList, onClose }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        {akunList.length} akun berhasil dibuat. Kredensial di bawah ini <strong>hanya tampil
        sekarang</strong> — segera catat atau bagikan secara manual ke pimpinan terkait. Begitu
        pimpinan login dan mengganti kredensialnya sendiri saat onboarding, password tidak akan
        bisa dilihat lagi lewat sistem.
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {akunList.map((akun) => (
          <BarisAkun key={akun.uid} akun={akun} />
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onClose}>Selesai</Button>
      </div>
    </div>
  );
}