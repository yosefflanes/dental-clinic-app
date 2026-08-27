import { FiCheck, FiShield, FiDollarSign, FiCalendar } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import { FeatureCard } from "./ui/FeatureCard";
import { TestimoniSection } from "./TestimoniSection";

export const Main = () => {
  const features = [
    {
      id: 1,
      title: "Dokter Gigi Spesialis",
      desc: "Ditangani dokter spesialis sesuai kebutuhan perawatan terbaik.",
      icon: <FiCheck />,
      iconBg: "bg-teal-500",
    },
    {
      id: 2,
      title: "Terima berbagai macam metode pembayaran",
      desc: "Menerima pembayaran cash, via transfer, QRIS, dan lain-lain.",
      icon: <BsPatchCheckFill />,
      iconBg: "bg-indigo-500",
    },
    {
      id: 3,
      title: "Teknologi Terkini",
      desc: "Peralatan modern untuk perawatan akurat, cepat dan nyaman.",
      icon: <FiShield />,
      iconBg: "bg-lime-500",
    },
    {
      id: 4,
      title: "Jaminan Kenyamanan",
      desc: "Pelayanan ramah, nyaman, bersih dan minim rasa takut.",
      icon: <FiCheck />,
      iconBg: "bg-teal-500",
    },
    {
      id: 5,
      title: "Harga Transparan",
      desc: "Biaya jelas di awal tanpa ada biaya tersembunyi.",
      icon: <FiDollarSign />,
      iconBg: "bg-rose-500",
    },
    {
      id: 6,
      title: "Booking Online Mudah",
      desc: "Buat Appointment cepat dan praktis melalui website ini.",
      icon: <FiCalendar />,
      iconBg: "bg-orange-400",
    },
  ];

  return (
    // Container utama
    <main className="max-w-7xl mx-auto px-4 py-12 bg-[#FAEFDF]">
      {/* Wrapper Border */}
      <div className="bg-white flex flex-col lg:flex-row gap-12 p-8 lg:p-12 border border-orange-200 rounded-3xl">
        {/* Bagian Kiri: Teks dan Statistik */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-slate-800 leading-tight mb-4">
            Klinik Gigi yang <br />
            Bisa <span className="text-blue-custom">Kamu Percaya</span>
          </h2>
          <p className="text-slate-500 mb-8">
            Dental Care hadir sebagai mitra kesehatan gigi jangka panjang untuk seluruh
            keluarga Indonesia dengan standar pelayanan tertinggi.
          </p>

          {/* Statistik */}
          <div className="flex gap-8">
            <div>
              <p className="text-4xl font-black text-slate-800">2<span className="text-blue-custom">+</span></p>
              <p className="text-sm text-slate-500 mt-1">Tahun Melayani</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800">250<span className="text-blue-custom">+</span></p>
              <p className="text-sm text-slate-500 mt-1">Pasien Puas</p>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Grid Card Fitur */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              iconBg={feature.iconBg}
            />
          ))}
        </div>
      </div>
      <TestimoniSection />
    </main>
  );
};
