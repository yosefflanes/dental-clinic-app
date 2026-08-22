import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./pages/Appointment";
import Home from "./pages/Home";
import MyAppointment from "./pages/MyAppointment";
import Services from "./pages/Services";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import AdminServices from "./pages/AdminServices";

function App() {
  return (
    <ReactLenis root>
      <Routes>
        {/* RUTE ADMIN (Hanya Sidebar, Tanpa Navbar/Footer User) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminSidebar>
              <AdminDashboard />
            </AdminSidebar>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <AdminSidebar>
              <AdminAppointments />
            </AdminSidebar>
          }
        />

        <Route
          path="/admin/services"
          element={
            <AdminSidebar>
              <AdminServices />
            </AdminSidebar>
          }
        />

        {/* RUTE USER / PUBLIK (Menggunakan Navbar dan Footer) */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/appointment"
                  element={
                    <ProtectedRoute>
                      <Appointment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointment/my"
                  element={
                    <ProtectedRoute>
                      <MyAppointment />
                    </ProtectedRoute>
                  }
                />
                <Route path="/services" element={<Services />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </ReactLenis>
  );
}

export default App;