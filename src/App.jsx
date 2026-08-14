import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./pages/Appointment";
import Home from "./pages/Home";

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
      </Routes>
      <Footer />
    </ReactLenis>
  );
}

export default App;
