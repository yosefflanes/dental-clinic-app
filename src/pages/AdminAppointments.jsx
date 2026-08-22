import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { ListChecks, Loader2, Check, X } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/appointments");
      if (response && response.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await apiRequest(`/appointments/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      await fetchAppointments();
    } catch (error) {
      console.error("Gagal memperbarui status appointment:", error);
      alert(error.message || "Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#14b8a6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight mb-1">
          Kelola Appointment
        </h1>
        <p className="text-slate-500 text-[16px]">
          Daftar seluruh reservasi dan jadwal kunjungan pasien klinik.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Title */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <ListChecks className="w-5 h-5 text-[#14b8a6]" />
          <h2 className="text-lg font-bold text-slate-800 m-0">
            Antrean Masuk Hari Ini
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Pasien
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Layanan Medis
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Jadwal Praktik
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Keluhan (Singkat)
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-5 align-top">
                      <span className="block font-medium text-slate-800 mb-1">
                        {appt.user?.name || "Pasien"}
                      </span>
                      <span className="text-[13px] text-slate-500">
                        {appt.user?.phone || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="block font-medium text-slate-800 mb-1">
                        {appt.service?.name || "Layanan"}
                      </span>
                      <span className="block text-[14px] font-semibold text-emerald-600 mt-1">
                        Rp{" "}
                        {(Number(appt.service?.price) || 0).toLocaleString(
                          "id-ID",
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="block font-medium text-slate-800 mb-1">
                        {appt.doctor_schedule?.practice_date
                          ? new Date(
                              appt.doctor_schedule.practice_date,
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                      <span className="text-[13px] text-slate-500">
                        {appt.doctor_schedule?.start_time?.slice(0, 5)} -{" "}
                        {appt.doctor_schedule?.end_time?.slice(0, 5)} WIB
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-[13px] text-slate-500 line-clamp-2 max-w-62.5 leading-relaxed">
                        {appt.complaint || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                          appt.status === "selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : appt.status === "batal"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top text-center">
                      {appt.status === "pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() =>
                              handleUpdateStatus(appt.id, "selesai")
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                            title="Tandai Selesai"
                          >
                            <Check className="w-5 h-5" strokeWidth={2.5} />
                          </button>
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => handleUpdateStatus(appt.id, "batal")}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="Batalkan"
                          >
                            <X className="w-5 h-5" strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[13px] text-slate-400 italic">
                          No Action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Belum ada antrean masuk hari ini.
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
