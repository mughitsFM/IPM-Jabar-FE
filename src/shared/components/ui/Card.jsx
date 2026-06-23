/**
 * Card — container kartu dasar.
 * Gunakan sebagai wrapper, bukan langsung tampil konten.
 */
export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-card shadow-sm border border-neutral-200 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
