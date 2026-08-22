import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Calendar, Stethoscope, LogOut } from "lucide-react";

export default function AdminSidebar({ children }) {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = async () => {
    if (logout){
      await logout();
    } else {
      localStorage.removeItem("token");
    localStorage.removeItem("user");
    }
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-[#2b4c50]">Admin Panel</h1>
          <p className="text-xs text-gray-400">Dental Clinic Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#2b4c50] transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/admin/appointments"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#2b4c50] transition-colors"
          >
            <Calendar className="w-5 h-5" /> Kelola Appointment
          </Link>
          <Link
            to="/admin/services"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#2b4c50] transition-colors"
          >
            <Stethoscope className="w-5 h-5" /> Kelola Layanan
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}