import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaChevronUp,
} from "react-icons/fa";
import { useLenis } from "lenis/react";

export const Footer = () => {
  const lenis = useLenis();

  const scrollToTop = () => {
    lenis?.scrollTo(0);
  };

  return (
    <footer className="w-full bg-[#2b4c50] py-16 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Hubungi Kami */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex gap-4 items-start">
                <FaPhoneAlt className="mt-1 shrink-0 text-slate-400" />
                <p>
                  <a href="https://wa.me/6281387705577" target="_blank">
                    <span>+6281387705577</span>
                  </a>
                </p>
              </li>
              <li className="flex gap-4 items-center">
                <FaEnvelope className="shrink-0 text-slate-400" />
                <span>yosefflanes@gmail.com</span>
              </li>
              <li className="flex gap-4 items-center text-blue-custom">
                <FaGlobe className="shrink-0 text-slate-400" />
                <a
                  href="https://dental-clinic-eta-five.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  dentalcare.com
                </a>
              </li>
              <li className="flex gap-4 items-start">
                <FaMapMarkerAlt className="mt-1 shrin-0 text-slate-400" />
                <span className="leading-relaxed">
                  Jl. Kresna 2 No. 189, Babakan Cikao, Purwakarta 41151,
                  Indonesia
                </span>
              </li>
            </ul>
          </div>

          {/* Jam Praktek */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Jam Praktek</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex justify-between w-full max-w-55">
                <span>Senin - Kamis</span>
                <span>09:00 - 21:00</span>
              </li>
              <li className="flex justify-between w-full max-w-55">
                <span>Jumat & Sabtu</span>
                <span>17:00 - 21:00</span>
              </li>
              <li className="flex justify-between w-full max-w-55">
                <span>Minggu</span>
                <span>Tidak Praktek</span>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="flex flex-col lg:items-end text-sm text-slate-400 space-y-1">
            <p>
              <a
                href="https://www.linkedin.com/in/yosefflanes/"
                target="_blank"
              >
                © 2023 Dental Care
              </a>
            </p>
            <p>All Rights Reserved</p>
          </div>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-[#1f373a] hover:bg-[#152527] text-white p-4 rounded-tl-md md:rounded-md transition-colors focus:outline-none hover:cursor-pointer hover:text-blue-custom"
        aria-label="Kembali ke atas"
      >
        <FaChevronUp />
      </button>
    </footer>
  );
};
