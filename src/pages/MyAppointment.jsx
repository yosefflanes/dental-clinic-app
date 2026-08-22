import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import AppointmentCard from "@/components/AppointmentCard";

export default function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    message: "",
    onConfirm: null,
  });

  // Fungsi untuk mengambil data riwayat appointment
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

  const handleCancelClick = (id) => {
    setModal({
      isOpen: true,
      type: "confirm",
      message: "Apakah kamu yakin ingin membatalkan appointment ini?",
      onConfirm: () => executeCancel(id),
    });
  };

  const executeCancel = async (id) => {
    setModal({ ...modal, isOpen: false });

    try {
      setCancelLoading(id);
      await apiRequest(`/appointments/${id}/cancel`, { method: "PATCH" });
      fetchAppointments();

      // Tampilkan modal sukses
      setModal({
        isOpen: true,
        type: "success",
        message: "Appointment berhasil dibatalkan.",
        onConfirm: null,
      });
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: error.message || "Gagal membatalkan appointment.",
        onConfirm: null,
      });
    } finally {
      setCancelLoading(null);
    }
  };

  const handlePayment = async (id) => {
    setModal({
      isOpen: true,
      type: "confirm",
      message: "Lanjutkan ke proses pembayaran untuk appointment ini?",
      onConfirm: () => executePayment(id),
    });
  };

  const executePayment = async (id) => {
    setModal((prev) => ({ ...prev, isOpen: false }));

    try {
      const response = await apiRequest("/payments", {
        method: "POST",
        body: { appointment_id: id },
      });

      const snapToken =
        response.data?.snap_token || response.data?.data?.snap_token;

      if (!snapToken) {
        throw new Error("Token pembayaran tidak ditemukan.");
      }

      // Fungsi pembantu untuk memanggil popup midtrans
      const payWithMidtrans = () => {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Berhasil bayar:", result);
            setModal({
              isOpen: true,
              type: "success",
              message: "Pembayaran berhasil diterima! Terima kasih.",
              onConfirm: () => fetchAppointments(),
            });
          },
          onPending: function (result) {
            console.log("Menunggu pembayaran:", result);

            setModal({
              isOpen: true,
              type: "success",
              message: "Menunggu pembayaran Anda diselesaikan.",
              onConfirm: () => fetchAppointments(),
            });
          },
          onError: function (result) {
            console.log("Pembayaran gagal atau dibatalkan:", result);
            setModal({
              isOpen: true,
              type: "error",
              message: "Pembayaran gagal atau dibatalkan.",
              onConfirm: null,
            });
          },
          onClose: function () {
            fetchAppointments();
          },
        });
      };

      if (!window.snap) {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "Mid-client-l8vNUtvAwpkS4GGm");

        script.onload = () => {
          payWithMidtrans();
        };

        document.body.appendChild(script);
      } else {
        payWithMidtrans();
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: error.message || "Gagal melakukan pembayaran",
        onConfirm: null,
      });
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
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
          Riwayat Appointment
        </h2>
        <p className="text-slate-500">
          Pantau jadwal dan status kunjunganmu ke klinik di sini.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500 mb-4">
            Kamu belum memiliki riwayat janji temu.
          </p>
          <Button
            onClick={() => (window.location.href = "/appointment")}
            className="bg-blue-custom hover:bg-blue-dark"
          >
            Buat Janji Temu Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => {
            const schedule = appt.doctor_schedule || appt.doctorSchedule;

            const normalizedAppt = {
              ...appt,
              date: schedule?.practice_date?.split("T")[0] || "-",
              doctor: schedule?.doctor || appt.doctor,
              doctor_schedule: schedule,
            };

            return (
              <AppointmentCard
                key={appt.id}
                appointment={normalizedAppt}
                onCancel={handleCancelClick}
                onPay={handlePayment}
                cancelLoading={cancelLoading}
              />
            );
          })}
        </div>
      )}
      <AlertModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
      />
    </section>
  );
}
