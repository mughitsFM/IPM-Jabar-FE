import { useNavigate } from "react-router-dom";
import { useNotifikasiList, useTandaiDibaca, useTandaiSemuaDibaca } from "../hooks/useNotifikasi";
// [ASUMSI] util format waktu relatif sudah ada di project (dipakai di modul lain,
// mis. daftar surat/aspirasi) — sesuaikan path import bila berbeda.
import { formatDate } from "@/shared/utils/formatDate";

const TIPE_ICON = {
  artikel_disetujui: DocumentIcon,
  artikel_revisi: DocumentIcon,
  artikel_ditolak: DocumentIcon,
  surat_masuk: MailIcon,
  aspirasi_masuk: ChatIcon,
  aspirasi_dibalas: ChatIcon,
};

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 2h5l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M11 2v3h3M7.5 10h5M7.5 13h5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
      <path d="M3 5.5 10 11l7-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v6A1.5 1.5 0 0 1 15.5 13H8l-3.5 3v-3H4.5A1.5 1.5 0 0 1 3 11.5v-6Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotifikasiIcon({ tipe }) {
  const Icon = TIPE_ICON[tipe] ?? ChatIcon;
  return (
    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green-50 text-brand-green-500 flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </span>
  );
}

export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifikasiList({ limit: 10 });
  const tandaiDibaca = useTandaiDibaca();
  const tandaiSemua = useTandaiSemuaDibaca();

  const items = data?.data?.results ?? [];
  const adaBelumDibaca = items.some((item) => !item.dibaca);

  const handleClickItem = async (item) => {
    if (!item.dibaca) {
      await tandaiDibaca.mutateAsync(item.id);
    }
    onClose?.();
    console.warn(`menuju link ${item.link}`);
    navigate(item.link);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[28rem] flex flex-col bg-white rounded-card shadow-lg border border-neutral-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <p className="font-display font-semibold text-sm text-neutral-800">Notifikasi</p>
        {adaBelumDibaca && (
          <button
            onClick={() => tandaiSemua.mutate()}
            disabled={tandaiSemua.isPending}
            className="text-xs font-semibold text-brand-green-500 hover:text-brand-green-600 min-h-[32px]"
          >
            Tandai semua terbaca
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {isLoading && (
          <div className="px-4 py-6 text-center text-sm text-neutral-400">Memuat notifikasi…</div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-neutral-400">
            Belum ada notifikasi.
          </div>
        )}

        {!isLoading &&
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClickItem(item)}
              className={`w-full text-left flex gap-3 px-4 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors min-h-[44px] ${
                item.dibaca ? "" : "bg-brand-green-50/40"
              }`}
            >
              <NotifikasiIcon tipe={item.tipe} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-800 truncate">{item.judul}</p>
                <p className="text-xs text-neutral-500 line-clamp-2">{item.pesan}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{formatDate(item.created_at)}</p>
              </div>
              {!item.dibaca && (
                <span className="w-2 h-2 rounded-full bg-brand-red-500 flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))}
      </div>
    </div>
  );
}