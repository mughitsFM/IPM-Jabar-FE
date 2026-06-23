import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Layout untuk halaman publik — Navbar hijau di atas, Footer di bawah.
 */
export default function PublicLayout({ children, className = "" }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
