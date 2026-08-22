import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  BriefcaseMedical,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from "lucide-react";

export default function AdminSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Kelola Appointment",
      path: "/admin/appointments",
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      name: "Kelola Layanan",
      path: "/admin/services",
      icon: <BriefcaseMedical className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative">
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <Stethoscope className="w-6 h-6 text-[#14b8a6]" /> DentalAdmin
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* OVERLAY UNTUK MOBILE SAAT SIDEBAR BUKA */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6
        h-screen shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          {/* Logo Desktop */}
          <div className="hidden md:flex items-center gap-3 font-bold text-slate-800 text-xl mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#14b8a6]" />
            </div>
            <span>DentalAdmin</span>
          </div>

          {/* Spacer khusus mobile agar tidak tertutup header bar */}
          <div className="md:hidden h-12" />

          {/* Menu List */}
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-teal-50 text-[#14b8a6] font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tombol Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Spacer untuk mobile agar konten tidak tertutup fixed header */}
        <div className="md:hidden h-16 shrink-0" />

        {/* Container Halaman Admin */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
