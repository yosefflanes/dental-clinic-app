import { FaStar } from "react-icons/fa";

export const TestimoniCard = ({ name, location, ulasan }) => {
  return (
    <div className="flex flex-col gap-4 bg-[#1a5e67]/70 rounded-2xl p-6">

      {/* Header Kartu: Avatar, Nama dan lokasi */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-teal-400 to-lime-300 shrink-0">
          <span className="text-white font-bold text-xl">X</span>
        </div>

        {/* Nama dan lokasi */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold text-base md:text-lg leading-tight">
            {name}
          </h3>
          <p className="text-slate-300 text-sm mt-1">{location}</p>
        </div>
      </div>

      {/* Ulasan */}
      <p className="text-white text-sm leading-relaxed mb-2">{ulasan}</p>

      {/* Bintang */}
      <div className="flex gap-1 mt-auto text-yellow-400">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
  );
};
