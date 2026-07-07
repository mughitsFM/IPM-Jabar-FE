import { useState } from "react";

import ProgressDots from "../components/ProgressDots";
import StepEmail from "../components/StepEmail";
import StepPassword from "../components/StepPassword";
import StepProfil from "../components/StepProfil";
import StepTur from "../components/StepTur";
import { useOnboarding } from "../hooks/useOnboarding";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { handleFinish, isFinishing, finishError } = useOnboarding();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-card shadow-sm border border-neutral-200 p-6">
        <ProgressDots current={step} total={4} />

        {step === 1 && <StepProfil onNext={() => setStep(2)} onSkip={() => setStep(2)} />}
        {step === 2 && <StepPassword onNext={() => setStep(3)} />}
        {step === 3 && <StepEmail onNext={() => setStep(4)} onSkip={() => setStep(4)} />}
        {step === 4 && (
          <StepTur onFinish={handleFinish} isFinishing={isFinishing} finishError={finishError} />
        )}
      </div>
    </div>
  );
}
