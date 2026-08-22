import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { Users, CalendarCheck, Wallet, Loader2, Award, Activity } from "lucide-react";

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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-[#14b8a6]" />
      </div>
    );
  }

  const summary = stats?.summary || {};
  const topServices = stats?.top_services || [];

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-[32px] font-bold text-slate-800 tracking-tight mb-1">Dashboard Utama</h1>
        <p className="text-slate-500 text-sm md:text-[16px]">Selamat datang kembali, Admin. Berikut ringkasan operasional klinik.</p>
      </div>

      {/* STATS CARDS GRID (Perbaikan struktur flex agar tidak terpotong di desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard 
          title="Total Antrean" 
          value={summary.total_appointments ?? 0} 
          icon={<CalendarCheck className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="Estimasi Pendapatan" 
          value={`Rp ${(summary.estimated_revenue ?? 0).toLocaleString("id-ID")}`} 
          icon={<Wallet className="w-6 h-6 text-emerald-600" />} 
          bgColor="bg-emerald-100"
        />
        <StatCard 
          title="Antrean Pending" 
          value={summary.pending_appointments ?? 0} 
          icon={<Users className="w-6 h-6 text-amber-600" />} 
          bgColor="bg-amber-100"
        />
        <StatCard 
          title="Antrean Selesai" 
          value={summary.completed_appointments ?? 0} 
          icon={<Activity className="w-6 h-6 text-[#14b8a6]" />} 
          bgColor="bg-teal-100"
        />
      </div>

      {/* TOP SERVICES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <Award className="w-5 h-5 text-[#14b8a6] shrink-0" />
          <h2 className="text-base md:text-lg font-bold text-slate-800 m-0">Layanan Terlaris (Top Services)</h2>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Nama Layanan</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Harga</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">Total Dipesan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topServices.length > 0 ? (
                topServices.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block font-medium text-slate-800 text-sm md:text-base">{item.service?.name || "Layanan Reguler"}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block text-[14px] md:text-[15px] font-semibold text-emerald-600">
                        Rp {(Number(item.service?.price) || 0).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top text-center">
                      <span className="inline-block px-3 md:px-4 py-1.5 rounded-full text-[12px] md:text-[13px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.total_appointment}x Booking
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                    Belum ada data layanan terlaris.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 md:w-13 md:h-13 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        {icon}
      </div>
      <div className="w-0 flex-1">
        <p className="text-[11px] md:text-[12px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide leading-tight">{title}</p>
        <p className="text-[14px] md:text-[17px] font-bold text-slate-800 tracking-tight leading-snug wrap-break-word">{value}</p>
      </div>
    </div>
  );
} 