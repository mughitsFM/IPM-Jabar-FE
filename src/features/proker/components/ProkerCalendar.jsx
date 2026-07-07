// frontend/features/proker/components/ProkerCalendar.jsx
import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
  addMonths,
  subMonths,
  parseISO,
  isValid,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { useProkerList } from "../hooks/useProker";
import {
  STATUS_PROKER_LABELS,
  STATUS_PROKER_COLORS,
  STATUS_PROKER_DOT_COLORS,
} from "@/shared/constants/statusEnum";
import { formatMonthYear, formatDayMonth } from "@/shared/utils/formatDate";
import Badge from "@/shared/components/ui/Badge";

const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// Maksimum baris ("lane") agenda multi-hari yang ditampilkan langsung per
// minggu sebelum disingkat jadi "+n agenda lainnya".
const MAX_VISIBLE_LANES = 2;

// Palet warna untuk garis agenda multi-hari — sengaja dipisah dari warna
// status (STATUS_PROKER_*) karena maknanya berbeda: warna status menandai
// tahap proker, sedangkan warna garis ini menandai IDENTITAS agenda (supaya
// agenda A mudah dibedakan dari agenda B saat garisnya beririsan dalam
// kalender yang sama). Disiapkan 5 warna per bulan; kalau jumlah agenda
// multi-hari pada grid/bulan yang sama > 5, warna akan berulang (siklus).
const AGENDA_LINE_COLORS = [
  { bg: "bg-indigo-500" },
  { bg: "bg-amber-500" },
  { bg: "bg-rose-500" },
  { bg: "bg-cyan-600" },
  { bg: "bg-purple-500" },
];

/**
 * Susun agenda multi-hari yang overlap dengan satu baris minggu (7 hari) ke
 * dalam "lane" (baris) supaya garis yang beririsan tanggal tidak saling
 * menimpa — mirip logika event-packing pada Google Calendar / FullCalendar.
 */
function packWeekEventLanes(weekDays, multiDayEvents) {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  const segments = multiDayEvents
    .filter(
      (ev) =>
        ev._start.getTime() <= weekEnd.getTime() &&
        ev._end.getTime() >= weekStart.getTime()
    )
    .map((ev) => {
      const clampedStart =
        ev._start.getTime() < weekStart.getTime() ? weekStart : ev._start;
      const clampedEnd =
        ev._end.getTime() > weekEnd.getTime() ? weekEnd : ev._end;
      return {
        event: ev,
        startCol: differenceInCalendarDays(clampedStart, weekStart), // 0..6
        endCol: differenceInCalendarDays(clampedEnd, weekStart), // 0..6
        continuesBefore: ev._start.getTime() < weekStart.getTime(),
        continuesAfter: ev._end.getTime() > weekEnd.getTime(),
      };
    })
    .sort(
      (a, b) =>
        a.startCol - b.startCol || (b.endCol - b.startCol) - (a.endCol - a.startCol)
    );

  const laneLastCol = []; // kolom terakhir yang terpakai per lane
  const placements = segments.map((seg) => {
    let lane = laneLastCol.findIndex((lastCol) => lastCol < seg.startCol);
    if (lane === -1) {
      lane = laneLastCol.length;
      laneLastCol.push(seg.endCol);
    } else {
      laneLastCol[lane] = seg.endCol;
    }
    return { ...seg, lane };
  });

  return { placements, laneCount: laneLastCol.length };
}

/**
 * ProkerCalendar — tampilan kalender bulan berjalan untuk program kerja.
 *
 * - Agenda SATU HARI ditandai dengan titik warna (sesuai status) di angka
 *   tanggalnya, seperti sebelumnya.
 * - Agenda LEBIH DARI SATU HARI (mis. tanggal_mulai 7 → tanggal_selesai 9)
 *   digambar sebagai garis/bar menerus dari tanggal mulai sampai selesai,
 *   dengan nama agenda di dalam garisnya. Warna garis diambil dari palet
 *   5 warna (AGENDA_LINE_COLORS), di-assign per agenda per bulan — hanya
 *   warna yang benar-benar dipakai bulan itu yang muncul di legenda.
 *
 * Catatan penting: kode ini mengasumsikan setiap proker punya field
 * `tanggal_selesai` (selain `tanggal_mulai`) untuk agenda multi-hari. Kalau
 * field di response API berbeda nama, sesuaikan bagian `normalizedEvents`
 * di bawah.
 *
 * Catatan lama: kalender ini mengambil data dari endpoint publik /proker/
 * yang sama seperti daftar timeline (tanpa filter status), lalu memilah per
 * bulan di sisi client. Kalau jumlah proker sudah sangat banyak, endpoint
 * ini sebaiknya diberi query param bulan/tahun di backend agar tidak perlu
 * mengambil seluruh data sekaligus.
 */
export default function ProkerCalendar({ maxAgendaItems = 5 }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { data, isLoading, isError } = useProkerList({ limit: 100 });
  const prokerList = data?.data?.results ?? [];

  // Normalisasi semua proker: parse tanggal mulai/selesai sekali saja, dan
  // tandai mana yang "multi-hari" (durasi > 1 tanggal kalender).
  const normalizedEvents = useMemo(() => {
    return prokerList
      .map((p) => {
        if (!p.tanggal_mulai) return null;
        const start = parseISO(p.tanggal_mulai);
        if (!isValid(start)) return null;
        const rawEnd = p.tanggal_selesai ? parseISO(p.tanggal_selesai) : start;
        const end =
          isValid(rawEnd) && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
        return {
          ...p,
          _start: start,
          _end: end,
          _isMultiDay: differenceInCalendarDays(end, start) >= 1,
        };
      })
      .filter(Boolean);
  }, [prokerList]);

  // Peta agenda satu-hari per tanggal (key: yyyy-MM-dd), untuk titik status.
  const singleDayEventsByDate = useMemo(() => {
    const map = {};
    normalizedEvents.forEach((ev) => {
      if (ev._isMultiDay) return;
      const key = format(ev._start, "yyyy-MM-dd");
      (map[key] ??= []).push(ev);
    });
    return map;
  }, [normalizedEvents]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks = [];
  for (let i = 0; i < gridDays.length; i += 7) {
    weeks.push(gridDays.slice(i, i + 7));
  }

  // Agenda multi-hari yang overlap dengan grid yang sedang tampil, sekaligus
  // assign warna garis (5 warna, berurutan sesuai tanggal mulai, berulang
  // kalau lebih dari 5 agenda dalam grid/bulan yang sama).
  const { multiDayEvents, eventColorMap } = useMemo(() => {
    const items = normalizedEvents
      .filter(
        (ev) =>
          ev._isMultiDay &&
          ev._end.getTime() >= gridStart.getTime() &&
          ev._start.getTime() <= gridEnd.getTime()
      )
      .sort(
        (a, b) =>
          a._start.getTime() - b._start.getTime() ||
          (b._end.getTime() - b._start.getTime()) - (a._end.getTime() - a._start.getTime())
      );

    const colorMap = {};
    items.forEach((ev, idx) => {
      colorMap[ev.id] = AGENDA_LINE_COLORS[idx % AGENDA_LINE_COLORS.length];
    });

    return { multiDayEvents: items, eventColorMap: colorMap };
  }, [normalizedEvents, gridStart, gridEnd]);

  const goPrevMonth = () => {
    setViewDate((d) => subMonths(d, 1));
    setSelectedDate(null);
  };
  const goNextMonth = () => {
    setViewDate((d) => addMonths(d, 1));
    setSelectedDate(null);
  };
  const handleDayClick = (day) => {
    setSelectedDate((prev) => (prev && isSameDay(prev, day) ? null : day));
  };

  // Sumber agenda: kalau ada tanggal terpilih, tampilkan proker yang SEDANG
  // BERLANGSUNG di tanggal itu (termasuk agenda multi-hari yang belum
  // selesai, bukan cuma yang tanggal_mulai-nya persis hari itu). Kalau tidak
  // ada tanggal terpilih, tampilkan seluruh proker yang overlap dengan bulan
  // yang sedang dilihat.
  const agendaItems = useMemo(() => {
    if (selectedDate) {
      return normalizedEvents
        .filter((ev) => isWithinInterval(selectedDate, { start: ev._start, end: ev._end }))
        .sort((a, b) => a._start.getTime() - b._start.getTime());
    }
    return normalizedEvents
      .filter(
        (ev) =>
          ev._start.getTime() <= monthEnd.getTime() && ev._end.getTime() >= monthStart.getTime()
      )
      .sort((a, b) => a._start.getTime() - b._start.getTime());
  }, [selectedDate, normalizedEvents, monthStart, monthEnd]);

  const visibleAgendaItems = agendaItems.slice(0, maxAgendaItems);

  return (
    <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
      {/* Header navigasi bulan */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <button
          onClick={goPrevMonth}
          aria-label="Bulan sebelumnya"
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <p className="font-display font-bold text-neutral-900 text-base capitalize">
          {formatMonthYear(viewDate)}
        </p>

        <button
          onClick={goNextMonth}
          aria-label="Bulan berikutnya"
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {isLoading && <CalendarSkeleton />}

      {isError && (
        <p className="text-sm text-neutral-400 text-center py-10 px-5">
          Gagal memuat kalender program kerja.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {/* Label hari */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-400 px-3 pt-3">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Grid tanggal, per baris minggu (supaya garis agenda multi-hari
              bisa digambar menerus tepat di bawah baris tanggalnya) */}
          <div className="p-3 space-y-1">
            {weeks.map((week, weekIdx) => {
              const { placements, laneCount } = packWeekEventLanes(week, multiDayEvents);
              const visiblePlacements = placements.filter((p) => p.lane < MAX_VISIBLE_LANES);
              const hiddenLanes = laneCount - MAX_VISIBLE_LANES;

              return (
                <div key={weekIdx} className={weekIdx > 0 ? "mt-1.5" : ""}>
                  {/* Angka tanggal + titik agenda satu-hari */}
                  <div className="grid grid-cols-7 gap-1">
                    {week.map((day) => {
                      const key = format(day, "yyyy-MM-dd");
                      const dayEvents = singleDayEventsByDate[key] ?? [];
                      const statuses = [...new Set(dayEvents.map((e) => e.status))].slice(0, 3);
                      const ongoingMultiCount = multiDayEvents.filter(
                        (ev) =>
                          ev._start.getTime() <= day.getTime() && ev._end.getTime() >= day.getTime()
                      ).length;
                      const inMonth = isSameMonth(day, viewDate);
                      const selected = selectedDate && isSameDay(day, selectedDate);
                      const today = isToday(day);

                      return (
                        <button
                          key={key}
                          onClick={() => handleDayClick(day)}
                          aria-label={`${format(day, "d MMMM yyyy")}${
                            dayEvents.length + ongoingMultiCount
                              ? `, ${dayEvents.length + ongoingMultiCount} program kerja`
                              : ""
                          }`}
                          aria-pressed={!!selected}
                          className={`relative min-h-[40px] rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors duration-150
                            ${!inMonth ? "text-neutral-300" : "text-neutral-700"}
                            ${selected ? "bg-brand-green-500 text-white font-semibold" : ""}
                            ${!selected && today ? "ring-2 ring-brand-green-500 font-bold text-brand-green-600" : ""}
                            ${!selected ? "hover:bg-neutral-100" : ""}
                          `}
                        >
                          {format(day, "d")}
                          {statuses.length > 0 && (
                            <span className="flex gap-0.5 h-1">
                              {statuses.map((s) => (
                                <span
                                  key={s}
                                  className={`w-1 h-1 rounded-full ${selected ? "bg-white" : STATUS_PROKER_DOT_COLORS[s] ?? "bg-neutral-400"}`}
                                />
                              ))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Garis agenda multi-hari untuk baris minggu ini */}
                  {visiblePlacements.length > 0 && (
                    <div className="grid grid-cols-7 gap-1 auto-rows-[20px] mt-1">
                      {visiblePlacements.map(({ event, startCol, endCol, lane, continuesBefore, continuesAfter }) => (
                        <div
                          key={`${event.id}-${weekIdx}`}
                          title={`${event.nama_kegiatan} (${formatDayMonth(event.tanggal_mulai)} – ${formatDayMonth(event.tanggal_selesai ?? event.tanggal_mulai)})`}
                          style={{ gridColumn: `${startCol + 1} / ${endCol + 2}`, gridRow: lane + 1 }}
                          className={`${(eventColorMap[event.id] ?? AGENDA_LINE_COLORS[0]).bg} text-white text-[10px] leading-[20px] font-semibold px-2 truncate
                            ${continuesBefore ? "rounded-l-none" : "rounded-l-full"}
                            ${continuesAfter ? "rounded-r-none" : "rounded-r-full"}
                          `}
                        >
                          {continuesBefore ? "‹ " : ""}
                          {event.nama_kegiatan}
                          {continuesAfter ? " ›" : ""}
                        </div>
                      ))}
                    </div>
                  )}

                  {hiddenLanes > 0 && (
                    <p className="text-[10px] text-neutral-400 pl-1 mt-0.5">
                      +{hiddenLanes} agenda lainnya minggu ini
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda status (untuk titik agenda satu-hari) */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 pb-3 text-xs text-neutral-500">
            {Object.entries(STATUS_PROKER_LABELS).map(([value, label]) => (
              <span key={value} className="inline-flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_PROKER_DOT_COLORS[value]}`} />
                {label}
              </span>
            ))}
          </div>

          {/* Legenda warna garis agenda multi-hari — hanya menampilkan warna
              yang benar-benar dipakai bulan ini, bukan seluruh 5 warna */}
          {multiDayEvents.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 pb-4 text-xs text-neutral-500">
              <span className="text-neutral-400 font-semibold uppercase tracking-wide text-[10px]">
                Agenda multi-hari
              </span>
              {multiDayEvents.map((ev) => (
                <span key={ev.id} className="inline-flex items-center gap-1.5 max-w-[180px]">
                  <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${eventColorMap[ev.id].bg}`} />
                  <span className="truncate">{ev.nama_kegiatan}</span>
                </span>
              ))}
            </div>
          )}

          {/* Agenda */}
          <div className="border-t border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                {selectedDate ? format(selectedDate, "d MMMM yyyy") : "Agenda bulan ini"}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs font-semibold text-brand-green-500 hover:text-brand-green-600"
                >
                  Lihat semua bulan ini
                </button>
              )}
            </div>

            {visibleAgendaItems.length === 0 && (
              <p className="text-sm text-neutral-400">
                {selectedDate
                  ? "Tidak ada program kerja pada tanggal ini."
                  : "Belum ada program kerja yang dimulai pada bulan ini."}
              </p>
            )}

            {visibleAgendaItems.length > 0 && (
              <ul className="space-y-3">
                {visibleAgendaItems.map((p) => {
                  const dotColorClass = p._isMultiDay
                    ? (eventColorMap[p.id] ?? AGENDA_LINE_COLORS[0]).bg
                    : STATUS_PROKER_DOT_COLORS[p.status] ?? "bg-neutral-400";
                  const dateLabel = p._isMultiDay
                    ? `${formatDayMonth(p.tanggal_mulai)} – ${formatDayMonth(p.tanggal_selesai ?? p.tanggal_mulai)}`
                    : formatDayMonth(p.tanggal_mulai);

                  return (
                    <li key={p.id} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-neutral-400 text-center">
                        {dateLabel}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClass}`} />
                      <span className="flex-1 text-sm text-neutral-800 truncate">{p.nama_kegiatan}</span>
                      <Badge
                        label={STATUS_PROKER_LABELS[p.status] ?? p.status}
                        colorClass={STATUS_PROKER_COLORS[p.status]}
                        className="shrink-0"
                      />
                    </li>
                  );
                })}
              </ul>
            )}

            {agendaItems.length > maxAgendaItems && (
              <p className="text-xs text-neutral-400 mt-3">
                +{agendaItems.length - maxAgendaItems} program kerja lainnya bulan ini.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-neutral-100" />
        ))}
      </div>
      <div className="h-4 bg-neutral-100 rounded w-1/3 mt-4" />
      <div className="h-10 bg-neutral-100 rounded" />
      <div className="h-10 bg-neutral-100 rounded" />
    </div>
  );
}