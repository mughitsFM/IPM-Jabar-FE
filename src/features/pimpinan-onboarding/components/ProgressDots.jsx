export default function ProgressDots({ current, total }) {
  return (
    <div
      className="flex items-center justify-center gap-2 mb-6"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <span
          key={step}
          className={`h-2.5 rounded-full transition-all ${
            step === current
              ? "w-6 bg-brand-green-500"
              : step < current
                ? "w-2.5 bg-brand-green-300"
                : "w-2.5 bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}
