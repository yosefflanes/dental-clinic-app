import { CalendarDays } from "lucide-react";

// Komponen tabel menerima data jadwal dan fungsi untuk mengubah status
export default function ScheduleTable({ schedules, onToggleStatus, isModalOpen }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${
        isModalOpen ? "blur-[2px]" : ""
      }`}
    >
      {/* Header Tabel */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
        <CalendarDays className="w-5 h-5 text-[#14b8a6] shrink-0" />
        <h2 className="text-base md:text-lg font-bold text-slate-800 m-0">
          Hasil Jadwal Praktik{" "}
          <span className="text-xs font-normal text-slate-400">
            ({schedules.length} ditemukan)
          </span>
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                Dokter
              </th>
              <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                Tanggal Praktik
              </th>
              <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                Jam Praktik
              </th>
              <th className="px-4 md:px-6 py-3.5 text-[12px] md:text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">
                Status / Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schedules.length > 0 ? (
              schedules.map((sched) => (
                <tr key={sched.id} className="hover:bg-slate-50 transition-colors">
                  {/* Info Dokter */}
                  <td className="px-4 md:px-6 py-4 align-top">
                    <span className="block font-medium text-slate-800 text-sm md:text-base">
                      {sched.doctor?.name || "Dokter"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {sched.doctor?.specialization}
                    </span>
                  </td>
                  
                  {/* Info Tanggal */}
                  <td className="px-4 md:px-6 py-4 align-top">
                    <span className="block text-[14px] font-medium text-slate-700">
                      {new Date(sched.practice_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  
                  {/* Info Jam */}
                  <td className="px-4 md:px-6 py-4 align-top">
                    <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-[13px] font-bold">
                      {sched.start_time.substring(0, 5)} -{" "}
                      {sched.end_time.substring(0, 5)} WIB
                    </span>
                  </td>

                  {/* Tombol Toggle Status (Aktif/Cuti) */}
                  <td className="px-4 md:px-6 py-4 align-top text-center">
                    <button
                      onClick={() => onToggleStatus(sched.id, sched.is_available)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm ${
                        sched.is_available
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      title="Klik untuk mengubah status ketersediaan"
                    >
                      {sched.is_available ? "Aktif (Tersedia)" : "Cuti / Tutup"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                  Tidak ada jadwal yang sesuai dengan filter yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}