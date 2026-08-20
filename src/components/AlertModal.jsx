import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertModal({
  isOpen,
  type = "info", // "confirm", "success", "error"
  title,
  message,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  // Menentukan Ikon
  const renderIcon = () => {
    switch (type) {
      case "confirm":
        return <AlertTriangle className="h-14 w-14 text-yellow-500 mb-4" />;
      case "success":
        return <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />;
      case "error":
        return <XCircle className="h-14 w-14 text-red-500 mb-4" />;
      default:
        return null;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "confirm":
        return "Konfirmasi";
      case "success":
        return "Berhasil!";
      case "error":
        return "Gagal";
      default:
        return "Informasi";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
        {renderIcon()}

        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {title || getDefaultTitle()}
        </h3>

        <p className="text-slate-500 text-sm mb-6">{message}</p>

        <div className="flex w-full gap-3 justify-center">
          {type === "confirm" ? (
            <>
              <Button
                variant="outline"
                className="flex-1 border-slate-200 hover:bg-slate-50"
                onClick={onClose}
              >
                Tidak
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={onConfirm}
              >
                Ya, Lanjutkan
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-blue-custom hover:bg-blue-dark text-white"
              onClick={onClose}
            >
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
