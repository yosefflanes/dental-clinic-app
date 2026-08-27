import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { ListChecks, Loader2, Check, X } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import Pagination from "@/components/ui/Pagination";
import AlertModal from "@/components/AlertModal"; 

export default function AdminAppointments() {
  const { isModalOpen, modalConfig, showAlert, closeAlert } = useAlert();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/appointments?page=${page}`);
      const resBody = response.data ? response.data : response;

      const paginationObject =  resBody.data?.current_page !== undefined ? resBody.data : resBody;
      if (paginationObject && Array.isArray(paginationObject.data)) {
        setAppointments(paginationObject.data);
        setCurrentPage(paginationObject.current_page);
        setLastPage(paginationObject.last_page);
      } else if (Array.isArray(resBody.data)) {
        setAppointments(resBody.data);
      } else if (Array.isArray(resBody)){
        setAppointments(resBody);
      }
    } catch (error) {
      console.error("Gagal mengambil data appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAppointments(currentPage);
  }, [currentPage]);

  const confirmUpdateStatus = (id, newStatus) => {
    showAlert({
      type: "confirm",
      title: newStatus === 'selesai' ? "Tandai Selesai?" : "Batalkan Antrean?",
      message: newStatus === 'selesai' 
        ? "Apakah pasien ini sudah selesai ditangani dan pembayaran telah dilunasi?" 
        : "Apakah Anda yakin ingin membatalkan antrean ini? Tindakan ini tidak dapat dikembalikan.",
      confirmVariant: newStatus === 'selesai' ? "primary" : "danger",
      onConfirm: () => executeUpdateStatus(id, newStatus),
    });
  };

  const executeUpdateStatus = async (id, newStatus) => {
    closeAlert(); // Tutup modal konfirmasi
    try {
      setUpdatingId(id);
      await apiRequest(`/appointments/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      await fetchAppointments(currentPage);
      
      showAlert({
        type: "success",
        title: "Berhasil!",
        message: "Status antrean berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Gagal memperbarui status appointment:", error);
      showAlert({
        type: "error",
        title: "Gagal Memperbarui",
        message: error.message || "Terjadi kesalahan pada sistem.",
      });
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
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="px-2 md:px-0">
        <h1 className="text-2xl md:text-[32px] font-bold text-slate-800 tracking-tight mb-1">Kelola Appointment</h1>
        <p className="text-slate-500 text-sm md:text-[16px]">Daftar seluruh reservasi dan jadwal kunjungan pasien klinik.</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <ListChecks className="w-5 h-5 text-[#14b8a6] shrink-0" />
          <h2 className="text-base md:text-lg font-bold text-slate-800 m-0">Antrean Masuk Hari Ini</h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-187.5">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Pasien</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Layanan Medis</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Jadwal Praktik</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Keluhan</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">Status</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block font-medium text-slate-800 text-sm mb-0.5">{appt.user?.name || "Pasien"}</span>
                      <span className="text-[12px] text-slate-500">{appt.user?.phone || "-"}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block font-medium text-slate-800 text-sm mb-0.5">{appt.service?.name || "Layanan"}</span>
                      <span className="block text-[13px] font-semibold text-emerald-600 mt-0.5">
                        Rp {(Number(appt.service?.price) || 0).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block font-medium text-slate-800 text-sm mb-0.5">
                        {appt.doctor_schedule?.practice_date ? new Date(appt.doctor_schedule.practice_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                      </span>
                      <span className="text-[12px] text-slate-500">
                        {appt.doctor_schedule?.start_time?.slice(0,5)} - {appt.doctor_schedule?.end_time?.slice(0,5)} WIB
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <p className="text-[12px] md:text-[13px] text-slate-500 line-clamp-2 max-w-50 leading-relaxed">
                        {appt.complaint || "-"}
                      </p>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] md:text-[12px] font-bold uppercase tracking-wider ${
                        appt.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' :
                        appt.status === 'batal' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top text-center">
                      {appt.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => confirmUpdateStatus(appt.id, 'selesai')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                            title="Tandai Selesai"
                          >
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => confirmUpdateStatus(appt.id, 'batal')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="Batalkan"
                          >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-400 italic">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    Belum ada antrean masuk hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      </div>

      <AlertModal
        isOpen={isModalOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmVariant={modalConfig.confirmVariant}
        onClose={closeAlert}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}