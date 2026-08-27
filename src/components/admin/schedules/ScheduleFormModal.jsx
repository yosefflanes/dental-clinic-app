import { X, Clock } from "lucide-react";

// Komponen Modal Form untuk menambah jadwal
export default function ScheduleFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  doctors,
}) {
  if (!isOpen) return null; // Jika tidak open, render kosong

  // Fungsi pengisi jam shift otomatis
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

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] w-full max-w-md p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5">
          <h3 className="text-lg md:text-[20px] font-bold text-slate-800 m-0">
            Tambah Jadwal Baru
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Isi Jadwal */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
              Pilih Dokter
            </label>
            <select
              required
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm"
            >
              <option value="">-- Pilih Dokter --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
              Tanggal Praktik
            </label>
            <input
              type="date"
              required
              value={formData.practice_date}
              onChange={(e) => setFormData({ ...formData, practice_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm"
            />
          </div>

          <div className="pt-2">
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5 md:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Atur Jam Praktik
            </label>
            <select
              onChange={handleShiftChange}
              className="w-full px-4 py-2 mb-3 border border-teal-200 text-teal-800 bg-teal-50 rounded-xl focus:ring-2 focus:ring-[#14b8a6] outline-none text-sm font-medium cursor-pointer"
            >
              <option value="">-- Pilih Preset Shift Otomatis --</option>
              <option value="pagi">Shift Pagi (09:00 - 15:00)</option>
              <option value="siang">Shift Siang (15:00 - 21:00)</option>
              <option value="malam">Shift Malam (17:00 - 21:00)</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Mulai</label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Selesai</label>
                <input
                  type="time"
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2b4c50] text-white rounded-xl hover:bg-[#1f373a] font-semibold"
            >
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}