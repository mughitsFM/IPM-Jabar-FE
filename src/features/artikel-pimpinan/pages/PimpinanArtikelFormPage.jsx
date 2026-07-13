{/* frontend/features/artikel-pimpinan/pages/PimpinanArtikelFormPage.jsx (lengkap) */}
// Dipakai untuk dua rute:
//   /pimpinan/artikel/baru   → mode create (params.id undefined)
//   /pimpinan/artikel/:id    → mode edit
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

  const { data, isLoading } = useArtikelPimpinanDetail(id);
  const createMutation = useCreateArtikelPimpinan();
  const updateMutation = useUpdateArtikelPimpinan();
  const ajukanMutation = useAjukanArtikelPimpinan();

  const goBack = () => navigate("/pimpinan/artikel");

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
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-brand-green-600 hover:text-brand-green-700 font-semibold mb-6 min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Artikel
        </button>
        <div className="bg-white rounded-card border border-neutral-200 p-4 sm:p-6">
          <ArtikelForm
            initialData={isEdit ? data?.data : null}
            createMutation={createMutation}
            updateMutation={updateMutation}
            ajukanMutation={ajukanMutation}
            onDone={goBack}
          />
        </div>
      </div>
    </PimpinanLayout>
  );
}