import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { CalendarDays, Loader2, Plus, Trash2, Pen, X, Clock, Filter } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import AlertModal from "@/components/AlertModal";

export default function AdminSchedules() {
  const { isModalOpen: isAlertOpen, modalConfig, showAlert, closeAlert } = useAlert();
  
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Filter Pencarian
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7) // Default bulan & tahun saat ini (YYYY-MM)
  );

  const [formData, setFormData] = useState({
    doctor_id: "",
    practice_date: "",
    start_time: "",
    end_time: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const scheduleRes = await apiRequest("/doctor-schedules?limit=500");
      const schedData = scheduleRes.data?.data || scheduleRes.data || [];
      setSchedules(Array.isArray(schedData) ? schedData : []);

      if (doctors.length === 0) {
        const doctorRes = await apiRequest("/doctors");
        const docData = doctorRes.data?.data || doctorRes.data || [];
        setDoctors(Array.isArray(docData) ? docData : []);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logika Filter Data Jadwal berdasarkan Dokter dan Bulan
  const filteredSchedules = schedules.filter((sched) => {
    const matchDoctor = filterDoctor ? sched.doctor_id == filterDoctor : true;
    const schedMonth = sched.practice_date ? sched.practice_date.slice(0, 7) : "";
    const matchMonth = filterMonth ? schedMonth === filterMonth : true;

    return matchDoctor && matchMonth;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiRequest(`/doctor-schedules/${editId}`, { method: "PUT", body: formData });
      } else {
        await apiRequest("/doctor-schedules", { method: "POST", body: formData });
      }
      closeModal();
      fetchData();
      showAlert({ type: "success", title: "Berhasil", message: "Jadwal berhasil disimpan." });
    } catch (error) {
      showAlert({ type: "error", title: "Gagal Menyimpan", message: error.message || "Gagal menyimpan data jadwal." });
    }
  };

  // Fungsi untuk mengubah status ketersediaan (Aktif / Cuti)
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await apiRequest(`/doctor-schedules/${id}/availability`, {
        method: "PATCH",
        body: { is_available: !currentStatus },
      });
      fetchData();
      showAlert({ type: "success", title: "Status Diperbarui", message: "Ketersediaan jadwal dokter berhasil diubah." });
    } catch (error) {
      showAlert({ type: "error", title: "Gagal", message: error.message || "Gagal mengubah status jadwal." });
    }
  };

  const confirmDelete = (id) => {
    showAlert({
      type: "confirm",
      title: "Hapus Jadwal?",
      message: "Apakah Anda yakin ingin menghapus jadwal praktik ini secara permanen?",
      confirmVariant: "danger",
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id) => {
    closeAlert();
    try {
      await apiRequest(`/doctor-schedules/${id}`, { method: "DELETE" });
      fetchData();
      showAlert({ type: "success", title: "Terhapus", message: "Jadwal berhasil dihapus." });
    } catch (error) {
      showAlert({ type: "error", title: "Gagal Menghapus", message: error.message || "Gagal menghapus jadwal." });
    }
  };

  const openEditModal = (schedule) => {
    setEditId(schedule.id);
    setFormData({
      doctor_id: schedule.doctor_id,
      practice_date: schedule.practice_date.split("T")[0],
      start_time: schedule.start_time.substring(0, 5),
      end_time: schedule.end_time.substring(0, 5),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ doctor_id: "", practice_date: "", start_time: "", end_time: "" });
  };

  const handleShiftChange = (e) => {
    const shift = e.target.value;
    if (shift === "pagi") {
      setFormData({ ...formData, start_time: "09:00", end_time: "15:00" });
    } else if (shift === "siang") {
      setFormData({ ...formData, start_time: "15:00", end_time: "21:00" });
    } else if (shift === "malam") {
      setFormData({ ...formData, start_time: "17:00", end_time: "21:00" });
    }
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-[#14b8a6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden relative">
      {/* HEADER & TOMBOL TAMBAH */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-[32px] font-bold text-slate-800 tracking-tight mb-1">Kelola Jadwal</h1>
          <p className="text-slate-500 text-sm md:text-[16px]">Atur tanggal, jam praktik, dan status ketersediaan dokter.</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ doctor_id: "", practice_date: "", start_time: "08:00", end_time: "12:00" });
            setIsModalOpen(true);
          }}
          className="bg-[#2b4c50] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1f373a] transition-all shadow-md shadow-[#2b4c50]/20 text-sm md:text-base shrink-0"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} /> Tambah Jadwal
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-semibold w-full md:w-auto">
          <Filter className="w-5 h-5 text-[#14b8a6]" />
          <span>Filter Jadwal:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium"
          >
            <option value="">-- Semua Dokter --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>

          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium"
          />

          {(filterDoctor || filterMonth) && (
            <button
              onClick={() => {
                setFilterDoctor("");
                setFilterMonth("");
              }}
              className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${isModalOpen ? 'blur-[2px]' : ''}`}>
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <CalendarDays className="w-5 h-5 text-[#14b8a6] shrink-0" />
          <h2 className="text-base md:text-lg font-bold text-slate-800 m-0">
            Hasil Jadwal Praktik <span className="text-xs font-normal text-slate-400">({filteredSchedules.length} ditemukan)</span>
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-162.5">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Dokter</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Tanggal Praktik</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">Jam Praktik</th>
                <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">Status / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((sched) => (
                  <tr key={sched.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block font-medium text-slate-800 text-sm md:text-base">{sched.doctor?.name || "Dokter"}</span>
                      <span className="text-xs text-slate-500">{sched.doctor?.specialization}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="block text-[14px] font-medium text-slate-700">
                        {new Date(sched.practice_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-[13px] font-bold">
                        {sched.start_time.substring(0, 5)} - {sched.end_time.substring(0, 5)} WIB
                      </span>
                    </td>
                    
                    {/* KOLOM STATUS (KLIK UNTUK TOGGLE AKTIF/CUTI) */}
                    <td className="px-4 md:px-6 py-4 align-top text-center">
                      <button
                        onClick={() => handleToggleAvailability(sched.id, sched.is_available)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm ${
                          sched.is_available 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                        title="Klik untuk mengubah status ketersediaan"
                      >
                        {sched.is_available ? "Aktif" : "Cuti / Libur"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    Tidak ada jadwal yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH/EDIT JADWAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[20px] w-full max-w-md p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5">
              <h3 className="text-lg md:text-[20px] font-bold text-slate-800 m-0">
                {editId ? "Ubah Jadwal" : "Tambah Jadwal Baru"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] md:text-[14px] font-medium text-slate-600 mb-1.5">Pilih Dokter</label>
                <select
                  required
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none text-sm"
                >
                  <option value="">-- Pilih Dokter --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] md:text-[14px] font-medium text-slate-600 mb-1.5">Tanggal Praktik</label>
                <input
                  type="date"
                  required
                  value={formData.practice_date}
                  onChange={(e) => setFormData({ ...formData, practice_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[13px] md:text-[14px] font-medium text-slate-600 mb-1.5 md:flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Atur Jam Praktik
                </label>
                <select
                  onChange={handleShiftChange}
                  className="w-full px-4 py-2 mb-3 border border-teal-200 text-teal-800 bg-teal-50 rounded-xl focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="">-- Pilih Preset Shift Otomatis --</option>
                  <option value="pagi">Shift Pagi (09:00 - 15:00)</option>
                  <option value="siang">Shift Siang (15:00 - 21:00)</option>
                  <option value="malam">Shift Sore (17:00 - 21:00)</option>
                </select>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Mulai</label>
                    <input
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Selesai</label>
                    <input
                      type="time"
                      required
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2b4c50] text-white rounded-xl hover:bg-[#1f373a] font-semibold transition-all shadow-md"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={isAlertOpen}
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