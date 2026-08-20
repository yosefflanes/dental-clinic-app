import Dental from "../assets/dentalcare.png";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State untuk mengontrol Modal Login/Register
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [pendingRoute, setPendingRoute] = useState(null);

  // Mengambil data global dari AuthContext
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && pendingRoute) {
      navigate(pendingRoute);
      // eslint-disable-next-line
      setPendingRoute(null);
    }
  }, [isLoggedIn, pendingRoute, navigate]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuth = (type) => {
    setAuthType(type);
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Logika pencegatan saat menu Appointment diklik
  const handleAppointmentClick = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Jika belum login, buka modal login
      setPendingRoute("/appointment");
      openAuth("login");
    } else {
      navigate("/appointment");
    }
  };

  return (
    <header className="flex items-center justify-between w-full py-4 px-6 md:px-32 z-50 bg-white shadow-md rounded-b-2xl fixed top-0">
      <img
        src={Dental}
        alt="Dental Care"
        className="w-16 h-auto cursor-pointer"
        onClick={() => navigate("/")}
      />

      <nav className="hidden md:flex space-x-8">
        <Link
          to="/"
          className="text-slate-800 hover:text-blue-dark font-medium"
        >
          Beranda
        </Link>
        <Link
          to="/appointment"
          onClick={handleAppointmentClick}
          className="text-slate-800 hover:text-blue-dark font-medium cursor-pointer"
        >
          Appointment
        </Link>
        {user && (
          <Link
            to="/appointment/my"
            className="text-slate-800 hover:text-blue-dark font-medium cursor-pointer"
          >
            Riwayat Appointment
          </Link>
        )}
        <Link
          to="/services"
          className="text-slate-800 hover:text-blue-dark font-medium"
        >
          Layanan Kami
        </Link>
      </nav>

      {/* Bagian Tombol Kanan (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          // Jika SUDAH login, tampilkan nama user & tombol Keluar
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">
              Halo, {user?.name || "Pasien"}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={logout}
              className="border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Keluar
            </Button>
          </div>
        ) : (
          // Jika BELUM login, tampilkan tombol Masuk & Daftar
          <ButtonGroup>
            <Button
              size="lg"
              className="bg-blue-custom hover:bg-blue-dark cursor-pointer"
              onClick={() => openAuth("login")}
            >
              Masuk
            </Button>
            <Button
              size="lg"
              className="bg-blue-custom hover:bg-blue-dark cursor-pointer"
              onClick={() => openAuth("register")}
            >
              Daftar
            </Button>
          </ButtonGroup>
        )}
      </div>

      {/* Hamburger Button Mobile */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-slate-800 hover:text-blue-dark focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown Hamburger Menu (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-20 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-blue-dark rounded-md"
            >
              Beranda
            </Link>
            <Link
              to="/appointment"
              onClick={(e) => {
                toggleMenu();
                handleAppointmentClick(e);
                setIsMobileMenuOpen(false)
              }}
              className="block text-center px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-blue-dark rounded-md"
            >
              Appointment
            </Link>
            {user && (
              <Link
                to="/appointment/my"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-blue-dark rounded-md"
              >
                Riwayat Appointment
              </Link>
            )}
            <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-blue-dark rounded-md"
              >
                Layanan Kami
              </Link>
          </div>

          <div className="px-4 py-4 border-t border-slate-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <Button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              >
                Keluar ({user?.name})
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => openAuth("login")}
                  className="bg-blue-50 text-blue-dark border border-blue-200 hover:bg-blue-100"
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => openAuth("register")}
                  className="bg-blue-dark hover:bg-blue-500 text-white"
                >
                  Daftar
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Render Modal di dalam Navbar */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
        }}
        initialView={authType}
      />
    </header>
  );
};

export default Navbar;
