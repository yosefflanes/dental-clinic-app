import { Loader2 } from "lucide-react";

export default function AppointmentCard({
  appointment,
  onCancel,
  cancelLoading,
  onPay,
}) {
  const isCancelling = cancelLoading === appointment.id;
  const status = appointment.status?.toLowerCase()?.trim();
  
  const isSettled = appointment.payment?.status === "settlement" || appointment.payment?.status === "paid";

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
    // 1. PRIORITAS UTAMA: Jika status sudah selesai atau batal
    switch (status) {
      case "selesai":
      case "completed":
        return { dot: "bg-teal-600", text: "text-teal-700", label: "Selesai" };
      case "batal":
      case "cancelled":
        return { dot: "bg-rose-400", text: "text-rose-600", label: "Dibatalkan" };
      default:
        break;
    }

    // 2. PRIORITAS KEDUA: Jika sudah bayar tapi belum selesai/batal
    if (isSettled) {
      return { dot: "bg-teal-600", text: "text-teal-700", label: "Lunas · menunggu jadwal" };
    }

    // 3. PRIORITAS KETIGA: Jika masih pending / menunggu
    switch (status) {
      case "pending":
      case "menunggu":
        return { dot: "bg-amber-500", text: "text-amber-700", label: "Menunggu konfirmasi" };
      default:
        return { dot: "bg-slate-300", text: "text-slate-500", label: status || "Unknown" };
    }
  };

  const config = getStatusConfig();
  const startTime = appointment.doctor_schedule?.start_time?.substring(0, 5) || "--:--";
  const endTime = appointment.doctor_schedule?.end_time?.substring(0, 5) || "--:--";
  const isCancelled = status === "batal" || status === "cancelled";
  const isDone = status === "selesai" || status === "completed";
  
  // Tombol aksi hilang jika sudah selesai, dibatalkan, atau sudah lunas
  const isActionable = !isDone && !isCancelled && !isSettled;

  return (
    <div className="relative pb-6 last:pb-0">
      {/* Titik status di garis linimasa */}
      <span
        className={`absolute -left-5.75 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${config.dot}`}
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
        <span className="text-xs text-slate-400 tabular-nums">
          {formatDate(appointment.date)} · {startTime}–{endTime} WIB
        </span>
        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
      </div>

      <p className={`font-semibold text-slate-800 ${isCancelled ? "line-through text-slate-400" : ""}`}>
        {appointment.service?.name || "Layanan Reguler"}
      </p>
      <p className="text-sm text-slate-500 mb-3">
        {appointment.doctor?.name || "Dokter Klinik"}
        <span className="text-slate-300"> · </span>
        <span className="text-slate-400">#{appointment.id?.toString().padStart(4, "0")}</span>
      </p>

      {isActionable && (
        <div className="flex gap-2">
          <button
            onClick={() => onCancel(appointment.id)}
            disabled={isCancelling}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-rose-600 text-xs font-medium bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Batalkan"}
          </button>
          <button
            onClick={() => onPay(appointment.id)}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-teal-700 text-white text-xs font-medium hover:bg-teal-800 transition-colors"
          >
            Bayar sekarang
          </button>
        </div>
      )}
    </div>
  );
}