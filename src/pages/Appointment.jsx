import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState("");
  
  // Data Dummy Layanan (Nanti dari API)
  const services = [
    { id: 1, name: "Konsultasi Umum" },
    { id: 2, name: "Pembersihan Karang Gigi (Scaling)" },
    { id: 3, name: "Tambal Gigi Estetik" },
    { id: 4, name: "Cabut Gigi" }
  ];

  // Data Dummy Jadwal Jam (Nanti ini difetch berdasarkan tanggal dari tabel doctor_schedules)
  const availableSchedules = [
    { id: 1, time: "17:00 - 18:00 WIB" },
    { id: 2, time: "18:00 - 19:00 WIB" },
    { id: 3, time: "19:00 - 20:00 WIB" },
  ];

  // Fungsi untuk mengecek hari (0 = Minggu, 1 = Senin, dst)
  const isSunday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getDay() === 0;
  };

  return (
    <section className="max-w-3xl mx-auto py-24 px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Buat Janji Temu</h2>
          <p className="text-slate-500">Pilih layanan dan tentukan waktu kunjunganmu.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Kolom Service_ID */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Pilih Layanan <span className="text-red-500">*</span></label>
            <select
              name="service_id"
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom"
              required
              defaultValue=""
            >
              <option value="" disabled>-- Silakan Pilih Layanan --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Pemilihan Tanggal */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Pilih Tanggal <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                // Mencegah pasien memilih tanggal di masa lalu
                min={new Date().toISOString().split("T")[0]} 
                className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom"
              />
              {isSunday(selectedDate) && (
                <span className="text-xs text-red-500 font-medium mt-1">
                  Maaf, klinik kami tutup pada hari Minggu. Silakan pilih hari lain.
                </span>
              )}
            </div>

            {/* Kolom doctor_schedule_id (Waktu) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Pilih Waktu <span className="text-red-500">*</span></label>
              <select
                name="doctor_schedule_id"
                disabled={!selectedDate || isSunday(selectedDate)}
                className="flex h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-custom disabled:bg-slate-50 disabled:text-slate-400"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  {!selectedDate 
                    ? "Pilih tanggal terlebih dahulu" 
                    : isSunday(selectedDate) 
                      ? "Tidak ada jadwal" 
                      : "-- Silakan Pilih Waktu --"}
                </option>
                {/* Opsi di bawah ini nantinya dirender dari API berdasarkan tanggal */}
                {!isSunday(selectedDate) && availableSchedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>{schedule.time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kolom Complaint */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Keluhan (Opsional)</label>
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
            disabled={isSunday(selectedDate)}
            className="w-full bg-blue-custom hover:bg-blue-dark mt-4 text-base h-12 rounded-xl disabled:opacity-50"
          >
            Konfirmasi Appointment
          </Button>
          
        </form>
      </div>
    </section>
  );
}