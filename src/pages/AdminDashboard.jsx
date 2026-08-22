import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { Users, CalendarCheck, DollarSign, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_appointments: 0,
    total_revenue: 0,
    total_customers: 0,
    recent_appointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/reports");
        setStats(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-[#2b4c50]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Utama</h1>
        <p className="text-gray-500">Selamat datang kembali, Admin. Berikut ringkasan operasional klinik.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Appointment" 
          value={stats.total_appointments} 
          icon={<CalendarCheck className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${stats.total_revenue?.toLocaleString() || 0}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Total Pasien" 
          value={stats.total_customers} 
          icon={<Users className="w-6 h-6 text-amber-600" />} 
          bgColor="bg-amber-50"
        />
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Aktivitas Terbaru</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Pasien</th>
              <th className="px-6 py-4">Layanan</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.recent_appointments?.length > 0 ? (
              stats.recent_appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{appt.user?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{appt.service?.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400">Belum ada aktivitas terbaru.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${bgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  );
}