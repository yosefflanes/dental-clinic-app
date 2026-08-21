import { Sparkles } from "lucide-react";
import { formatRupiah } from "@/utils/format";

export default function ServiceCard({ service, index, onBook }) {
  return (
    <div
      className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow duration-300 animate-in fade-in zoom-in-95"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="h-12 w-12 bg-blue-50 text-blue-custom rounded-2xl flex items-center justify-center mb-6">
        <Sparkles size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{service.name}</h3>
      <p>
        {service.description ||
          "Perawatan gigi profesional yang dilakukan oleh dokter spesialis kami untuk menjaga kesehatan dan keindahan senyuman Anda."}
      </p>
      <div className="mb-6">
        <span className="text-sm font-medium text-slate-400 block mb-1">
          Mulai dari
        </span>
        <span className="text-2xl font-extrabold text-blue-custom">
          {formatRupiah(service.price)}
        </span>
      </div>
      <button
        onClick={onBook}
        className="w-full py-3 px-4 bg-slate-50 hover:bg-blue-custom hover:text-white text-blue-custom font-semibold rounded-xl transition-colors duration-200"
      >
        Buat Appointment
      </button>
    </div>
  );
}
