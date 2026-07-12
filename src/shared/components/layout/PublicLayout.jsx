import Navbar from "./Navbar";
import Footer from "./Footer";
import ThemeInjector from "@/shared/components/ThemeInjector";

/**
 * Layout untuk halaman publik — Navbar hijau di atas, Footer di bawah.
 * ThemeInjector tidak render apa pun (return null) — cuma set CSS variable
 * warna/font sesuai konfigurasi Manajemen Desain. Lihat 13-manajemen-desain.md.
 */
export default function PublicLayout({ children, className = "" }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ThemeInjector />
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
