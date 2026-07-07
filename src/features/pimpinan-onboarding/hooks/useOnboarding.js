import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "@/app/providers/AuthProvider";

import { onboardingService } from "../services/onboardingService";

/**
 * Menangani langkah terakhir wizard onboarding: memanggil endpoint
 * "selesai", menyegarkan session (supaya first_login_done ikut ter-update
 * di context tanpa perlu logout/login ulang), lalu redirect ke dashboard.
 */
export function useOnboarding() {
  const { user, refreshSession } = useAuthContext();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState(null);

  const handleFinish = async () => {
    setFinishError(null);
    setIsFinishing(true);
    try {
      await onboardingService.selesaikanOnboarding();
      await refreshSession();
      navigate("/pimpinan/dashboard", { replace: true });
    } catch (err) {
      setFinishError(
        err?.response?.data?.message ?? "Gagal menyelesaikan onboarding. Coba lagi.",
      );
    } finally {
      setIsFinishing(false);
    }
  };

  return { user, handleFinish, isFinishing, finishError };
}
