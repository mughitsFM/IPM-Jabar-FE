import { useEffect, useRef, useState } from "react";
import { useJumlahBelumDibaca } from "../hooks/useNotifikasi";
import NotificationDropdown from "./NotificationDropdown";

function BellIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M10 2.5a5 5 0 0 0-5 5v2.4c0 .5-.15 1-.44 1.4L3.5 13.2c-.5.7 0 1.7.85 1.7h11.3c.85 0 1.35-1 .85-1.7l-1.06-1.9a2.4 2.4 0 0 1-.44-1.4V7.5a5 5 0 0 0-5-5Z"
        strokeLinejoin="round"
      />
      <path d="M8 16.5a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

export default function NotificationBell() {
  const { data } = useJumlahBelumDibaca();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const jumlah = data?.data?.jumlah ?? 0;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifikasi"
        className="relative p-2 rounded-lg hover:bg-black/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <BellIcon className="w-5 h-5" />
        {jumlah > 0 && (
          <span className="absolute top-1 right-1 bg-brand-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {jumlah > 9 ? "9+" : jumlah}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}