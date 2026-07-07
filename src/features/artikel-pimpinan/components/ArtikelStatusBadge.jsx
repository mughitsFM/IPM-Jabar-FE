{/* frontend/features/artikel-pimpinan/components/ArtikelStatusBadge.jsx (lengkap) */}
import Badge from "@/shared/components/ui/Badge";
import {
  STATUS_ARTIKEL_PIMPINAN_LABELS,
  STATUS_ARTIKEL_PIMPINAN_COLORS,
} from "@/shared/constants/statusEnum";

export default function ArtikelStatusBadge({ status }) {
  return (
    <Badge
      label={STATUS_ARTIKEL_PIMPINAN_LABELS[status] ?? status}
      colorClass={STATUS_ARTIKEL_PIMPINAN_COLORS[status] ?? "bg-neutral-200 text-neutral-600"}
    />
  );
}
