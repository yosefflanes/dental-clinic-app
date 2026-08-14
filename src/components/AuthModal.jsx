import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthModal({ isOpen, onClose, initialView = "login" }) {
  const [view, setView] = useState(initialView);
  const modalRef = useRef(null);

  const {login, register} = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line
      setView(initialView);
      setFormData({
        name: "", phone: "", gender: "", date_of_birth: "",
        email: "", password: "", password_confirmation: ""
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      setErrorMessage(null);
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Tutup modal jika klik diluar
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Fungsi untuk update state formData saat user mengetik
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  // Fungsi tombol submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    let result;

    if (view === "login"){
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData);
    }

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      if (typeof result.errors === "string") {
        setErrorMessage(result.errors);
      } else if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        setErrorMessage(result.errors[firstErrorKey][0]);
      } else {
        setErrorMessage("Terjadi kesalahan pada server. Coba lagi");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
      <div
        ref={modalRef}
        data-lenis-prevent="true"
        className="relative w-full h-full md:h-auto max-h-screen md:max-h-[90vh] max-w-md bg-white border-0 md:border md:border-zinc-200 shadow-2xl rounded-none md:rounded-2xl p-6 md:p-8 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto overscroll-contain"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-800 transition-colors focus:outline-none z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col space-y-1 text-center mb-4 mt-8 md:mt-0 shrink-0">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {view === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h2>
          <p className="text-sm text-zinc-500">
            {view === "login"
              ? "Masukkan detail akunmu untuk melanjutkan."
              : "Lengkapi form di bawah untuk mendaftar."}
          </p>
        </div>

        {/* TAMPILAN ERROR BILA ADA */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm font-medium text-center animate-in fade-in">
            {errorMessage}
          </div>
        )}

        <form key={view} className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {view === "register" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-900">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-custom"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-900">Nomor HP</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-custom"
                  placeholder="081234567890"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium text-zinc-900">Jenis Kelamin</label>
                  <div className="flex items-center gap-4 h-11">
                    <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="pria" 
                        checked={formData.gender === "pria"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-custom focus:ring-blue-custom" 
                      />
                      Pria
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="wanita" 
                        checked={formData.gender === "wanita"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-custom focus:ring-blue-custom" 
                      />
                      Wanita
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium text-zinc-900">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-custom"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-custom"
              placeholder="email@contoh.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-custom"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {view === "register" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-900">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-custom"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-blue-custom text-white h-11 px-4 py-2 hover:bg-blue-dark mt-4 transition-colors shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              view === "login" ? "Masuk" : "Daftar"
            )}
          </button>
        </form>

        <div className="text-center text-sm mt-2 shrink-0">
          <span className="text-zinc-500">
            {view === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          </span>
          <button
            type="button"
            onClick={() => setView(view === "login" ? "register" : "login")}
            className="font-semibold text-blue-custom underline underline-offset-4 hover:text-blue-dark transition-colors"
          >
            {view === "login" ? "Daftar sekarang" : "Masuk di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}
