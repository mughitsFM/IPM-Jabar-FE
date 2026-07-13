import { useState } from "react";

import { useAuthContext } from "@/app/providers/AuthProvider";

import ProgressDots from "../components/ProgressDots";
import StepProfil from "../components/StepProfil";
import StepIdentitasPimpinan from "../components/StepIdentitasPimpinan";
import StepPassword from "../components/StepPassword";
import StepEmail from "../components/StepEmail";
import StepTur from "../components/StepTur";
import { useOnboarding } from "../hooks/useOnboarding";
import { onboardingService } from "../services/onboardingService";

const TOTAL_STEPS = 5;

// Pesan persis dari services.py::lengkapi_profil_onboarding saat endpoint
// ini sudah pernah berhasil dipanggil sebelumnya (mis. user sempat menutup
// tab tepat setelah step Email berhasil tapi sebelum menyelesaikan StepTur,
// lalu diarahkan ulang ke /pimpinan/onboarding dari awal oleh
// PimpinanOnboardingGate karena first_login_done masih false).
// [ASUMSI] Dicocokkan lewat isi pesan karena backend belum punya kode error
// khusus untuk kasus ini — kalau pesan di backend berubah, cocokkan ulang.
const PESAN_SUDAH_DILENGKAPI = "sudah pernah dilengkapi";

export default function OnboardingPage() {
  const { user, refreshSession } = useAuthContext();
  const { handleFinish, isFinishing, finishError } = useOnboarding();

  const [step, setStep] = useState(1);

  // Data dari StepIdentitasPimpinan & StepPassword dikumpulkan di sini dulu,
  // baru dikirim SEKALIGUS ke backend saat StepEmail disubmit (lihat
  // handleSubmitLengkapiProfil) — sesuai kontrak
  // PATCH /api/pimpinan/onboarding/lengkapi-profil/ yang memang menerima
  // nama+level+nama_wilayah+email+password dalam satu request.
  const [identitas, setIdentitas] = useState({
    nama: user?.nama ?? "",
    level: user?.level || "daerah",
    nama_wilayah: user?.nama_wilayah ?? "",
  });
  const [passwordBaru, setPasswordBaru] = useState("");

  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [finalError, setFinalError] = useState(null);

  async function handleSubmitLengkapiProfil(emailBaru) {
    setFinalError(null);
    setIsSubmittingFinal(true);
    try {
      await onboardingService.lengkapiProfil({
        nama: identitas.nama,
        level: identitas.level,
        nama_wilayah: identitas.nama_wilayah,
        email: emailBaru || user?.email,
        password: passwordBaru,
      });
      await refreshSession();
      setStep(5);
    } catch (err) {
      const message = err?.response?.data?.message ?? "";
      if (message.toLowerCase().includes(PESAN_SUDAH_DILENGKAPI)) {
        // Data sebelumnya sudah tersimpan di server — jangan blokir user,
        // lanjut saja ke tur seperti biasa.
        setStep(5);
      } else {
        setFinalError(message || "Gagal menyimpan data onboarding. Coba lagi.");
      }
    } finally {
      setIsSubmittingFinal(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-card shadow-sm border border-neutral-200 p-5 sm:p-6">
        <ProgressDots current={step} total={TOTAL_STEPS} />

        {step === 1 && <StepProfil onNext={() => setStep(2)} onSkip={() => setStep(2)} />}

        {step === 2 && (
          <StepIdentitasPimpinan
            initialValue={identitas}
            onNext={(data) => {
              setIdentitas(data);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StepPassword
            onNext={(value) => {
              setPasswordBaru(value);
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <StepEmail
            currentEmail={user?.email}
            onSubmit={handleSubmitLengkapiProfil}
            isSubmitting={isSubmittingFinal}
            error={finalError}
          />
        )}

        {step === 5 && (
          <StepTur onFinish={handleFinish} isFinishing={isFinishing} finishError={finishError} />
        )}
      </div>
    </div>
  );
}