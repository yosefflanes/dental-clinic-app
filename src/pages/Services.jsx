import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiRequest";
import { Loader2, Sparkles } from "lucide-react";
import { formatRupiah } from "@/utils/format";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest("/services");
        const dataLayanan = response.data?.data;
        setServices(Array.isArray(dataLayanan) ? dataLayanan : []);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-24 px-6 min-h-screen mt-10">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
          Layanan Klinik Kami
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Kami menyediakan berbagai perawatan kesehatan gigi terbaik dengan
          dokter profesional dan peralatan modern untuk senyum cerah Anda.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-custom mb-4" />
          <p className="text-slate-500 font-medium">Memuat daftar layanan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500">
            Belum ada data layanan yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow duration-300 animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 bg-blue-50 text-blue-custom rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {service.name}
              </h3>

              <p className="text-slate-500 text-sm mb-6 grow leading-relaxed">
                {service.description ||
                  "Perawatan gigi profesional yang dilakukan oleh dokter spesialis kami untuk menjaga kesehatan dan keindahan senyum Anda."}
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
                onClick={() => navigate("/appointment")}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-blue-custom hover:text-white text-blue-custom font-semibold rounded-xl transition-colors duration-200"
              >
                Buat Janji
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
