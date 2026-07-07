{/* frontend/features/artikel-pimpinan/pages/PimpinanArtikelFormPage.jsx (lengkap) */}
// Dipakai untuk dua rute:
//   /pimpinan/artikel/baru   → mode create (params.id undefined)
//   /pimpinan/artikel/:id    → mode edit
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import { LoadingScreen } from "@/shared/components/ui/Skeleton";
import ArtikelForm from "../components/ArtikelForm";
import {
  useArtikelPimpinanDetail,
  useCreateArtikelPimpinan,
  useUpdateArtikelPimpinan,
  useAjukanArtikelPimpinan,
} from "../hooks/useArtikelPimpinan";

export default function PimpinanArtikelFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // "draft" | "ajukan" | false — dipakai utk tahu tombol mana yang loading
  const [pendingAction, setPendingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { data, isLoading } = useArtikelPimpinanDetail(id);
  const createMutation = useCreateArtikelPimpinan();
  const updateMutation = useUpdateArtikelPimpinan(id);
  const ajukanMutation = useAjukanArtikelPimpinan();

  const saveMutation = isEdit ? updateMutation : createMutation;

  // action: "draft" → simpan saja | "ajukan" → simpan lalu langsung ajukan
  const handleSubmit = (payload, action) => {
    setPendingAction(action);
    setErrorMsg(null);

    saveMutation.mutate(payload, {
      onSuccess: (res) => {
        if (action === "draft") {
          navigate("/pimpinan/artikel");
          return;
        }
        // action === "ajukan": lanjut panggil endpoint ajukan pada artikel
        // yang baru dibuat/diupdate.
        const artikelId = isEdit ? id : res?.data?.id;
        ajukanMutation.mutate(artikelId, {
          onSuccess: () => navigate("/pimpinan/artikel"),
          onError: (err) => {
            setPendingAction(false);
            setErrorMsg(err?.response?.data?.message ?? "Gagal mengajukan artikel. Draft sudah tersimpan.");
          },
        });
      },
      onError: (err) => {
        setPendingAction(false);
        setErrorMsg(err?.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.");
      },
    });
  };

  if (isEdit && isLoading) {
    return (
      <PimpinanLayout title="Edit Artikel">
        <LoadingScreen />
      </PimpinanLayout>
    );
  }

  return (
    <PimpinanLayout title={isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}>
      <div className="max-w-3xl">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-state-error/10 text-state-error text-sm">
            {errorMsg}
          </div>
        )}
        <ArtikelForm
          initialData={isEdit ? data?.data : null}
          onSubmit={handleSubmit}
          isSubmitting={pendingAction}
        />
      </div>
    </PimpinanLayout>
  );
}
