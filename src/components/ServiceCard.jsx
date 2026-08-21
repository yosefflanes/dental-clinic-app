import { ArrowRight } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function ServiceCard({ service, index, onBook }) {
  return (
    <div 
      className="group flex flex-col h-full bg-white border border-zinc-200 rounded-xl p-6 transition-all duration-300 hover:border-blue-custom hover:shadow-md animate-in fade-in hover:bg-blue-50"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mb-4">
        <span className="inline-block px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[11px] font-bold uppercase tracking-widest rounded-md">
          Layanan Medis
        </span>
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-tight">
        {service.name}
      </h3>
      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
        {service.description || "Perawatan komprehensif oleh tenaga medis profesional untuk memastikan kesehatan gigi dan mulut yang optimal."}
      </p>
      <div className="mt-auto flex items-end justify-between pt-5 border-t border-zinc-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Biaya Estimasi
          </span>
          <span className="text-lg font-bold text-zinc-900">
            {formatRupiah(service.price)}
          </span>
        </div>
        <button
          onClick={onBook}
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[#2b4c50] text-white text-sm font-medium transition-all group-hover:bg-blue-custom focus:outline-none hover:cursor-pointer"
        >
          Pilih
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}