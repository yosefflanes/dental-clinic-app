import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { Users, CalendarCheck, DollarSign, Loader2, Award } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    summary: {
      total_appointments: 0,
      completed_appointments: 0,
      pending_appointments: 0,
      canceled_appointments: 0,
      estimated_revenue: 0,
    },
    top_services: [],
    busiest_schedule: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/reports");
        
        console.log("Data Response Reports:", response);

        if (response && response.data) {
          setStats(response.data);
        } else if (response && response.summary) {
          setStats(response);
        }
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#2b4c50]" />
      </div>
    );
  }

  const summary = stats?.summary || {};
  const topServices = stats?.top_services || [];

  return (
    <div className="space-y-8 p-2">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Utama</h1>
        <p className="text-gray-500">Selamat datang kembali, Admin. Berikut ringkasan operasional klinik.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Appointment" 
          value={summary.total_appointments ?? 0} 
          icon={<CalendarCheck className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Estimasi Pendapatan" 
          value={`Rp ${(summary.estimated_revenue ?? 0).toLocaleString("id-ID")}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Antrean Pending" 
          value={summary.pending_appointments ?? 0} 
          icon={<Users className="w-6 h-6 text-amber-600" />} 
          bgColor="bg-amber-50"
        />
      </div>

      {/* TOP SERVICES TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#2b4c50]" />
          <h2 className="font-bold text-gray-800">Layanan Terlaris (Top Services)</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Nama Layanan</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4 text-center">Total Dipesan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topServices.length > 0 ? (
              topServices.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.service?.name || "Layanan Reguler"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    Rp {(Number(item.service?.price) || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                      {item.total_appointment}x Booking
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                  Belum ada data layanan terlaris.
                </td>
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