import { Footer } from "./components/layouts/Footer";
import { ReactLenis } from "lenis/react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./pages/Appointment";
import Home from "./pages/Home";
import MyAppointment from "./pages/MyAppointment";
import Services from "./pages/Services";
import AdminSidebar from "./components/layouts/AdminSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import AdminServices from "./pages/AdminServices";
import AdminSchedules from "./pages/AdminSchedules";

function App() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  return (
    <ReactLenis root>
      <Routes>
        {/* ================= RUTE KHUSUS ADMIN ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSidebar>
                <AdminDashboard />
              </AdminSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSidebar>
                <AdminAppointments />
              </AdminSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSidebar>
                <AdminServices />
              </AdminSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/schedules"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSidebar>
                <AdminSchedules />
              </AdminSidebar>
            </ProtectedRoute>
          }
        />

        {/* ================= RUTE UTAMA & PUBLIK ================= */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        {/* ================= RUTE KHUSUS USER (DIAMANKAN) ================= */}
        <Route
          path="/services"
          element={
            <ProtectedRoute requireUser={true}>
              <Navbar />
              <Services />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute requireUser={true}>
              <Navbar />
              <Appointment />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/my"
          element={
            <ProtectedRoute requireUser={true}>
              <Navbar />
              <MyAppointment />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Fallback jika URL tidak ditemukan */}
        <Route
          path="*"
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </ReactLenis>
  );
}

export default App;
