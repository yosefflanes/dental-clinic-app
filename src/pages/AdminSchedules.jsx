import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { Loader2, Plus } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import AlertModal from "@/components/ui/AlertModal";

// Import Komponen Kecil yang Baru Saja Kita Buat
import ScheduleFilter from "@/components/admin/schedules/ScheduleFilter";
import ScheduleTable from "@/components/admin/schedules/ScheduleTable";
import ScheduleFormModal from "@/components/admin/schedules/ScheduleFormModal";

export default function AdminSchedules() {
  // 1. Inisiasi Hooks & State Utama
  const {
    isModalOpen: isAlertOpen,
    modalConfig,
    showAlert,
    closeAlert,
  } = useAlert();

  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. State untuk Filter
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  // 3. State untuk Form Tambah Jadwal
  const [formData, setFormData] = useState({
    doctor_id: "",
    practice_date: "",
    start_time: "09:00",
    end_time: "15:00",
  });

  // 4. Fungsi Mengambil Data Master (Dokter & Jadwal)
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
    // eslint-disable-next-line
    fetchData();
  }, []);

  // 5. Eksekusi Penyaringan Jadwal (Hanya tampilkan hari ini ke depan)
  const todayString = new Date().toISOString().split("T")[0]; // (YYYY-MM-DD)

  const filteredSchedules = schedules.filter((sched) => {
    const isNotPassed = sched.practice_date
      ? sched.practice_date >= todayString
      : false;

    const matchDoctor = filterDoctor ? sched.doctor_id == filterDoctor : true;

    const schedMonth = sched.practice_date
      ? sched.practice_date.slice(0, 7)
      : "";
    const matchMonth = filterMonth ? schedMonth === filterMonth : true;

    return isNotPassed && matchDoctor && matchMonth;
  });

  // 6. Fungsi Submit Jadwal Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/doctor-schedules", { method: "POST", body: formData });
      setIsModalOpen(false);
      fetchData();
      showAlert({
        type: "success",
        title: "Berhasil",
        message: "Jadwal berhasil disimpan.",
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Gagal",
        message: error.message || "Gagal menyimpan jadwal.",
      });
    }
  };

  // 7. Fungsi Ubah Status (Aktif/Cuti)
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await apiRequest(`/doctor-schedules/${id}/availability`, {
        method: "PATCH",
        body: { is_available: !currentStatus },
      });
      fetchData();
      showAlert({
        type: "success",
        title: "Status Diperbarui",
        message: "Ketersediaan jadwal dokter diubah.",
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Gagal",
        message: error.message || "Gagal mengubah status.",
      });
    }
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-[#14b8a6]" />
      </div>
    );
  }

  // 8. Tampilan Render Akhir (Terlihat Sangat Bersih!)
  return (
    <div className="space-y-6 max-w-full overflow-hidden relative">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-[32px] font-bold text-slate-800 tracking-tight mb-1">
            Kelola Jadwal
          </h1>
          <p className="text-slate-500 text-sm md:text-[16px]">
            Atur tanggal, jam praktik, dan status ketersediaan.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2b4c50] text-white px-5 py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1f373a] shadow-md transition-all text-sm md:text-base shrink-0"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} /> Tambah Jadwal
        </button>
      </div>

      {/* Komponen Filter */}
      <ScheduleFilter
        doctors={doctors}
        filterDoctor={filterDoctor}
        setFilterDoctor={setFilterDoctor}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
      />

      {/* Komponen Tabel Data */}
      <ScheduleTable
        schedules={filteredSchedules}
        onToggleStatus={handleToggleAvailability}
        isModalOpen={isModalOpen}
      />

      {/* Komponen Modal Form Tambah */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        doctors={doctors}
      />

      {/* Modal Notifikasi Error/Success */}
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
