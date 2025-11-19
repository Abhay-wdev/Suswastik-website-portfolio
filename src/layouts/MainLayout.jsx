import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import FloatingCartButton from "../components/FloatingCartButton";
import Footer from "../components/Footer";
    // ⭐ ADD THIS
import { Toaster } from "react-hot-toast";

export default function MainLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  // ❗ FIX: your admin path should be "/admin" NOT "/adminu"
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ⭐ GLOBAL TOASTER (works for all pages) */}
      

      {/* Show only on NON-admin pages */}
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <FloatingCartButton />}
<Toaster position="top-right" reverseOrder={false} />
      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer only on NON-admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
