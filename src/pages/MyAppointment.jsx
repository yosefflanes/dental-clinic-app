import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, User, Stethoscope } from "lucide-react";

export default function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const [modal, setModal] =  useState({
    isOpen: false,
    type: "",
    message: "",
    onConfirm: null,
  });

  // Fungsi untuk mengambil data riwayat janji temu
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/appointments/my");
      
      const data = response.data?.data?.data || response.data?.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data janji temu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAppointments();
  }, []);

  // Fungsi untuk membatalkan janji temu
  const handleCancel = async (id) => {
    setModal({...modal, isOpen: false});

    try {
      setCancelLoading(id);
      await apiRequest(`/appointments/${id}/cancel`, {method: "PATCH"});
      fetchAppointments();

      setModal({
        isOpen: true,
        type: "success",
        message: "Appointment berhasil dibatalkan.",
        onConfirm: null,
      });
    } catch (error) {
      const errorMessage = error.message || "Gagal membatalkan appointment.";

      setModal({
        isOpen: true,
        type: "error",
        message: errorMessage,
        onConfirm: null,
      });
    } finally {
      setCancelLoading(null);
    }
  }

  // Fungsi untuk menentukan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "batal":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-custom" />
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto py-24 px-6 min-h-screen mt-12">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Riwayat Janji Temu</h2>
        <p className="text-slate-500">Pantau jadwal dan status kunjunganmu ke klinik di sini.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500 mb-4">Kamu belum memiliki riwayat janji temu.</p>
          <Button onClick={() => window.location.href = "/appointment"} className="bg-blue-custom hover:bg-blue-dark">
            Buat Janji Temu Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appt) => {
            const schedule = appt.doctor_schedule || appt.doctorSchedule;
            const doctor = schedule?.doctor || appt.doctor;
            const service = appt.service;

            return (
              <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                
                {/* Informasi Kiri */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">{service?.name || "Layanan Gigi"}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-custom" />
                      <span>{doctor?.name || "Dokter tidak ditemukan"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-custom" />
                      <span>{doctor?.specialization  || "Dokter Gigi"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-custom" />
                      <span>{schedule?.practice_date ? schedule.practice_date.split('T')[0] : "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-custom" />
                      <span>
                        {schedule?.start_time?.substring(0, 5)} - {schedule?.end_time?.substring(0, 5)} WIB
                      </span>
                    </div>
                  </div>
                  
                  {appt.complaint && (
                    <div className="mt-2 text-sm text-slate-500 bg-blue-100 p-3 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Keluhan: </span> {appt.complaint}
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Kanan */}
                <div className="w-full md:w-auto flex flex-col gap-2 mt-4 md:mt-0">
                  {/* Nantinya tombol BAYAR ditaruh di sini jika statusnya sudah diatur */}
                  {/* <Button className="w-full bg-green-500 hover:bg-green-600">Bayar Sekarang</Button> */}

                  {appt.status === "pending" && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                      onClick={() => handleCancel(appt.id)}
                      disabled={cancelLoading === appt.id}
                    >
                      {cancelLoading === appt.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Membatalkan...
                        </span>
                      ) : (
                        "Batalkan Janji"
                      )}
                    </Button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
      <AlertModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({...modal, isOpen: false})}
        onConfirm={modal.onConfirm}
      />
    </section>
  );
}