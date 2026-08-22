import { CalendarDays, Clock, Loader2, Stethoscope } from "lucide-react";

export default function AppointmentCard({
  appointment,
  onCancel,
  cancelLoading,
  onPay,
}) {
  const isCancelling = cancelLoading === appointment.id;
  const status = appointment.status?.toLowerCase();

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "Belum diatur";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = () => {
    const cleanStatus = status?.trim().toLowerCase();

    switch (cleanStatus) {
      case "pending":
      case "menunggu":
        return {
          badge:
            "bg-amber-100 text-amber-800 border border-amber-300 font-semibold",
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
          label: "Menunggu",
        };
      case "selesai":
      case "completed":
        return {
          badge:
            "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          label: "Selesai",
        };
      case "batal":
      case "cancelled":
        return {
          // Kita beri warna merah yang tegas agar langsung terlihat bedanya
          badge: "bg-red-100 text-red-800 border border-red-300 font-semibold",
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
          label: "Dibatalkan",
        };
      case "lunas":
      case "paid":
        return {
          badge:
            "bg-blue-100 text-blue-800 border border-blue-300 font-semibold",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          label: "Lunas / Menunggu Hari H",
        };
      default:
        return {
          badge:
            "bg-zinc-100 text-zinc-800 border border-zinc-300 font-semibold",
          iconBg: "bg-zinc-100",
          iconColor: "text-zinc-600",
          label: status || "Unknown",
        };
    }
  };

  const config = getStatusConfig();
  const startTime =
    appointment.doctor_schedule?.start_time?.substring(0, 5) || "--:--";
  const endTime =
    appointment.doctor_schedule?.end_time?.substring(0, 5) || "--:--";

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50">
      {/* ATAS: Info Layanan & Status */}
      <div>
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}
            >
              <Stethoscope className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 tracking-wider">
              ID: #{appointment.id?.toString().padStart(4, "0")}
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${config.badge}`}
          >
            {config.label}
          </span>
        </div>

        <h3 className="font-bold text-zinc-900 text-lg leading-snug mb-1">
          {appointment.service?.name || "Layanan Reguler"}
        </h3>
        <p className="text-sm font-medium text-zinc-500 mb-6">
          {appointment.doctor?.name || "Dokter Klinik"}
        </p>
      </div>

      {/* TENGAH: Garis Pemisah & Jadwal */}
      <div>
        <div className="w-full border-t border-zinc-100 mb-5"></div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                Tanggal
              </p>
              <p className="text-xs font-bold text-zinc-800">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                Waktu
              </p>
              <p className="text-xs font-bold text-zinc-800">
                {startTime} - {endTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BAWAH: Tombol Aksi (Hanya muncul jika status pending) */}
      {status === "pending" && (
        <div className="pt-4 border-t border-zinc-100 flex gap-3">
          <button
            onClick={() => onCancel(appointment.id)}
            disabled={isCancelling}
            className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl text-red-600 text-xs font-bold bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 hover:cursor-pointer"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Batalkan Janji"
            )}
          </button>

          <button
            onClick={() => onPay(appointment.id)}
            className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl bg-[#2b4c50] text-white text-xs font-bold hover:bg-blue-custom transition-colors shadow-sm hover:cursor-pointer"
          >
            Bayar Sekarang
          </button>
        </div>
      )}
      {/* KETERANGAN JIKA SUDAH LUNAS */}
      {appointment.payment && appointment.payment.status === "settlement" && (
        <div className="pt-4 border-t border-zinc-100 text-center">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block w-full">
            ✓ Pembayaran Berhasil (Menunggu Jadwal Kunjungan)
          </span>
        </div>
      )}
    </div>
  );
}
