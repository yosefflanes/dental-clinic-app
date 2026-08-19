import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "../api/apiRequest";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Appointment() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSunday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getDay() === 0;
  };

  // 1. Ambil data layanan saat halaman pertama dibuka
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

  // 2. Ambil daftar dokter & jadwal berdasarkan tanggal yang dipilih
  useEffect(() => {
    // Jika tanggal belum dipilih atau hari Minggu, langsung reset state di dalam fungsi async atau bersihkan dengan aman
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

        setAvailableSchedules(schedulesArray);

        const uniqueDoctors = [];
        const doctorIds = new Set();

        schedulesArray.forEach((item) => {
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

  // Filter jadwal spesifik berdasarkan dokter yang dipilih user
  const filteredSchedules = availableSchedules.filter(
    (schedule) => schedule.doctor_id == selectedDoctor,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      service_id: e.target.service_id.value,
      doctor_schedule_id: e.target.doctor_schedule_id.value,
      complaint: e.target.complaint.value,
    };

    try {
      const response = await apiRequest("/appointments", "POST", payload);
      alert("Berhasil!", response.message);

      navigate("/appointment/my");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan sistem, silahkan coba lagi.";
      alert("Gagal:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-24 px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
            Buat Janji Temu
          </h2>
          <p className="text-slate-500">
            Pilih layanan, tanggal, dokter, dan waktu kunjunganmu.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Kolom Service_ID */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Pilih Layanan <span className="text-red-500">*</span>
            </label>
            <select
              name="service_id"
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom disabled:opacity-50"
              required
              defaultValue=""
              disabled={loadingServices}
            >
              <option value="" disabled>
                {loadingServices
                  ? "Memuat layanan..."
                  : "-- Silakan Pilih Layanan --"}
              </option>
              {Array.isArray(services) &&
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Pemilihan Tanggal */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Pilih Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setSelectedDate(newDate);
                  setSelectedDoctor("");
                  if (!newDate || isSunday(newDate)) {
                    setDoctors([]);
                    setAvailableSchedules([]);
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom"
              />
              {isSunday(selectedDate) && (
                <span className="text-xs text-red-500 font-medium mt-1">
                  Maaf, klinik kami tutup pada hari Minggu.
                </span>
              )}
            </div>

            {/* Kolom Pilih Dokter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Pilih Dokter <span className="text-red-500">*</span>
                {loadingDoctors && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-custom" />
                )}
              </label>
              <select
                name="doctor_id"
                disabled={
                  !selectedDate ||
                  isSunday(selectedDate) ||
                  loadingDoctors ||
                  doctors.length === 0
                }
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom disabled:bg-slate-50 disabled:text-slate-400"
                required
              >
                <option value="" disabled>
                  {!selectedDate
                    ? "Pilih tanggal terlebih dahulu"
                    : isSunday(selectedDate)
                      ? "Tidak ada jadwal"
                      : loadingDoctors
                        ? "Mencari dokter..."
                        : doctors.length === 0
                          ? "Tidak ada dokter praktek"
                          : "-- Pilih Dokter --"}
                </option>
                {Array.isArray(doctors) &&
                  doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization || "Dokter Gigi"})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Kolom Waktu (Berdasarkan Dokter yang Dipilih) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Pilih Waktu <span className="text-red-500">*</span>
            </label>
            <select
              name="doctor_schedule_id"
              disabled={!selectedDoctor || filteredSchedules.length === 0}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom disabled:bg-slate-50 disabled:text-slate-400"
              required
              defaultValue=""
            >
              <option value="" disabled>
                {!selectedDoctor
                  ? "Pilih dokter terlebih dahulu"
                  : filteredSchedules.length === 0
                    ? "Jadwal penuh / tidak tersedia"
                    : "-- Silakan Pilih Waktu --"}
              </option>
              {Array.isArray(filteredSchedules) &&
                filteredSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.start_time.substring(0, 5)} -{" "}
                    {schedule.end_time.substring(0, 5)} WIB
                  </option>
                ))}
            </select>
          </div>

          {/* Kolom Complaint */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Keluhan (Opsional)
            </label>
            <textarea
              name="complaint"
              rows="4"
              className="flex w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-custom resize-none"
              placeholder="Ceritakan secara singkat keluhan gigi yang kamu rasakan..."
            ></textarea>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={
              isSunday(selectedDate) ||
              loadingServices ||
              loadingDoctors ||
              isSubmitting
            }
            className="w-full bg-blue-custom hover:bg-blue-dark mt-4 text-base h-12 rounded-xl disabled:opacity-50 hover:cursor-pointer"
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
    </section>
  );
}
