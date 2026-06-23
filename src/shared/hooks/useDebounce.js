import { useEffect, useState } from "react";

/**
 * Menunda update nilai hingga pengguna berhenti mengetik selama `delay` ms.
 * Berguna untuk search/filter agar tidak request API setiap keystroke.
 *
 * @param {any} value - Nilai yang ingin di-debounce
 * @param {number} delay - Delay dalam ms (default: 400)
 * @returns {any} - Nilai yang sudah di-debounce
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
