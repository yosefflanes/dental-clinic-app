import { Filter } from "lucide-react";

export default function ScheduleFilter({
  doctors,
  filterDoctor,
  setFilterDoctor,
  filterMonth,
  setFilterMonth,
}) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Label Filter */}
      <div className="flex items-center gap-2 text-slate-700 font-semibold w-full md:w-auto">
        <Filter className="w-5 h-5 text-[#14b8a6]" />
        <span>Filter Jadwal:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Dropdown Pilih Dokter */}
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium"
        >
          <option value="">-- Semua Dokter --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>

        {/* Input Pilih Bulan */}
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium"
        />

        {/* Tombol Reset muncul jika ada filter yang aktif */}
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
  );
}