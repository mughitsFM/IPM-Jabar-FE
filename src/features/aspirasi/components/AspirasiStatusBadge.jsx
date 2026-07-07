{/* frontend/features/aspirasi/components/AspirasiStatusBadge.jsx (lengkap) */}
import Badge from "@/shared/components/ui/Badge";
import { STATUS_ASPIRASI_LABELS, STATUS_ASPIRASI_COLORS } from "@/shared/constants/statusEnum";

export default function AspirasiStatusBadge({ status }) {
  return (
    <Badge
      label={STATUS_ASPIRASI_LABELS[status] ?? status}
      colorClass={STATUS_ASPIRASI_COLORS[status] ?? "bg-neutral-200 text-neutral-600"}
    />
  );
}
