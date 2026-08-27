import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "../api/apiRequest";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";
import AlertModal from "@/components/ui/AlertModal";

export default function Appointment() {
  const navigate = useNavigate();
  const { isModalOpen, modalConfig, showAlert, closeAlert } = useAlert();

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [complaint, setComplaint] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSunday = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString).getDay() === 0;
  };

  const upcomingDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const localIso = `${year}-${month}-${day}`;

    return {
      iso: localIso,
      day: d.toLocaleDateString("id-ID", { weekday: "short" }),
      date: d.getDate(),
      isSunday: d.getDay() === 0,
    };
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest("/services");
        const dataLayanan = response.data.data || response;
        setServices(Array.isArray(dataLayanan) ? dataLayanan : []);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedDate || isSunday(selectedDate)) {
      return;
    }

    const fetchDoctorsAndSchedules = async () => {
      setLoadingDoctors(true);
      try {
        const response = await apiRequest(
          `/doctor-schedules?date=${selectedDate}&limit=100`,
        );
        const dataJadwal = response.data.data || response;
        const schedulesArray = Array.isArray(dataJadwal) ? dataJadwal : [];

        const activeSchedules = schedulesArray.filter(
          (schedule) =>
            schedule.is_available === true || schedule.is_available === 1,
        );

        setAvailableSchedules(activeSchedules);

        const uniqueDoctors = [];
        const doctorIds = new Set();

        activeSchedules.forEach((item) => {
          if (item.doctor && !doctorIds.has(item.doctor.id)) {
            doctorIds.add(item.doctor.id);
            uniqueDoctors.push(item.doctor);
          }
        });

        setDoctors(uniqueDoctors);
      } catch (error) {
        console.error("Gagal mengambil jadwal dan dokter:", error);
        setDoctors([]);
        setAvailableSchedules([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctorsAndSchedules();
  }, [selectedDate]);

  const filteredSchedules = availableSchedules.filter(
    (schedule) => schedule.doctor_id == selectedDoctor,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      service_id: selectedService,
      doctor_schedule_id: selectedScheduleId,
      complaint,
    };

    try {
      const response = await apiRequest("/appointments", {
        method: "POST",
        body: payload,
      });

      showAlert({
        type: "success",
        title: "Berhasil!",
        message: response.message || "Appointment berhasil dibuat.",
        onConfirm: () => navigate("/appointment/my"),
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan sistem, silahkan coba lagi.";

      showAlert({
        type: "error",
        title: "Gagal Memuat",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    selectedService && selectedScheduleId && !isSubmitting && !loadingServices;

  return (
    <section className="max-w-2xl mx-auto py-24 px-6 mt-12">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Buat Appointment
          </h2>
          <p className="text-sm text-slate-500">
            Pilih layanan, tanggal, dokter, dan waktu kunjunganmu.
          </p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* 1. Pilih Layanan */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700">
              1. Pilih Layanan
            </label>
            {loadingServices ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat layanan...
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                      selectedService == service.id
                        ? "bg-[#14b8a6] text-white font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{service.name}</span>
                    {selectedService == service.id && (
                      <span className="text-white text-xs bg-teal-700 px-2 py-1 rounded">
                        Dipilih
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Pilih Tanggal */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700">
              2. Pilih Tanggal
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
              {upcomingDates.map((d) => (
                <button
                  type="button"
                  key={d.iso}
                  disabled={d.isSunday}
                  onClick={() => {
                    setSelectedDate(d.iso);
                    setSelectedDoctor("");
                    setSelectedScheduleId("");
                  }}
                  className={`flex-none w-17 text-center py-3 rounded-xl transition-all border ${
                    d.isSunday
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : selectedDate === d.iso
                        ? "bg-[#14b8a6] border-[#14b8a6] text-white shadow-md shadow-teal-200"
                        : "bg-white border-slate-200 text-slate-500 hover:border-[#14b8a6] hover:text-[#14b8a6]"
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                    {d.day}
                  </span>
                  <span className="text-xl font-black block">{d.date}</span>
                </button>
              ))}
            </div>
            {isSunday(selectedDate) && (
              <span className="text-xs text-red-500 font-medium">
                Klinik kami tutup pada hari Minggu.
              </span>
            )}
          </div>

          {/* 3. Pilih Dokter */}
          {selectedDate && !isSunday(selectedDate) && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                3. Pilih Dokter
                {loadingDoctors && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#14b8a6]" />
                )}
              </label>
              {!loadingDoctors && doctors.length === 0 ? (
                <p className="text-sm text-slate-400 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  Tidak ada dokter praktek pada tanggal ini.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {doctors.map((doc) => (
                    <button
                      type="button"
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctor(doc.id);
                        setSelectedScheduleId("");
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                        selectedDoctor == doc.id
                          ? "border-[#14b8a6] bg-teal-50 shadow-sm"
                          : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-bold ${selectedDoctor == doc.id ? "text-teal-900" : "text-slate-800"}`}
                        >
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doc.specialization || "Dokter Gigi"}
                        </p>
                      </div>
                      {selectedDoctor == doc.id && (
                        <span className="text-[#14b8a6] text-xs font-bold bg-white px-2 py-1 rounded shadow-sm">
                          Dipilih
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Pilih Waktu */}
          {selectedDoctor && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-700">
                4. Pilih Waktu
              </label>
              {filteredSchedules.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Jadwal penuh / tidak tersedia untuk dokter ini.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {filteredSchedules.map((schedule) => (
                    <button
                      type="button"
                      key={schedule.id}
                      onClick={() => setSelectedScheduleId(schedule.id)}
                      className={`py-2.5 rounded-xl text-sm border font-bold transition-all ${
                        selectedScheduleId == schedule.id
                          ? "bg-[#14b8a6] border-[#14b8a6] text-white shadow-md shadow-teal-200"
                          : "border-slate-200 text-slate-600 hover:border-[#14b8a6] hover:text-[#14b8a6]"
                      }`}
                    >
                      {schedule.start_time.substring(0, 5)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Keluhan */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Keluhan (Opsional)
            </label>
            <textarea
              rows="3"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none transition-all"
              placeholder="Ceritakan secara singkat keluhan gigi yang kamu rasakan..."
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="w-full bg-[#14b8a6] hover:bg-teal-600 text-white text-base font-bold h-14 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-teal-200"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Memproses...
              </span>
            ) : (
              "Konfirmasi Appointment"
            )}
          </Button>
        </form>
      </div>

      <AlertModal
        isOpen={isModalOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => {
          closeAlert();
          if (modalConfig.type === "success" && modalConfig.onConfirm) {
            modalConfig.onConfirm();
          }
        }}
        onConfirm={modalConfig.onConfirm}
      />
    </section>
  );
}
