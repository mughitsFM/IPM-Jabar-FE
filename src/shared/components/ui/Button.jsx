/**
 * Button — komponen tombol reusable.
 * Variants: primary | secondary | outline | danger | ghost
 */
export default function Button({
  children,
  variant   = "primary",
  type      = "button",
  disabled  = false,
  loading   = false,
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-5 py-2.5 text-sm";

  const variants = {
    primary:   "bg-brand-green-500 text-white hover:bg-brand-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-500",
    secondary: "bg-brand-gold-500 text-neutral-900 hover:bg-brand-gold-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-500",
    outline:   "border-2 border-brand-green-500 text-brand-green-500 hover:bg-brand-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-500",
    danger:    "bg-brand-red-500 text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red-500",
    ghost:     "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
