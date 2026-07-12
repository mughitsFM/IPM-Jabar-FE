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
        <ArtikelForm
          initialData={isEdit ? data?.data : null}
          createMutation={createMutation}
          updateMutation={updateMutation}
          ajukanMutation={ajukanMutation}
          onDone={goBack}
        />
      </div>
    </PimpinanLayout>
  );
}