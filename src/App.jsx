import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./pages/Appointment";
import Home from "./pages/Home";
import MyAppointment from "./pages/MyAppointment";
import Services from "./pages/Services";

function App() {
  return (
    <ReactLenis root>
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
    </ReactLenis>
  );
}

export default App;
